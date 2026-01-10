// services/workouts/workoutServices.js
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  orderBy,
  limit,
  startAfter,     
  serverTimestamp,
  addDoc,
  increment,
} from 'firebase/firestore';
import { auth, db } from '../firebase/firebase';

const workoutServices = {


  logWorkout: async (workoutData) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No user logged in');

      const workoutWithUser = {
        ...workoutData,
        userId: user.uid,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'workouts'), workoutWithUser);
      
      // Update user stats
      await updateDoc(doc(db, 'users', user.uid), {
        totalWorkouts: increment(1),
        [`coachStats.totalWorkouts`]: increment(1),
        lastActive: serverTimestamp(),
        updated_at: serverTimestamp()
      });

      console.log('✅ Workout logged:', docRef.id);
      return { id: docRef.id, ...workoutWithUser };
    } catch (error) {
      console.error('❌ Log workout error:', error);
      throw error;
    }
  },

  /**
   * ✅ Get user workouts (pagination support)
   */
  getUserWorkouts: async (userId, limitCount = 20, lastDoc = null) => {
    try {
      let q = query(
        collection(db, 'workouts'),
        where('userId', '==', userId),
        orderBy('workoutDate', 'desc'),
        limit(limitCount)
      );

      // ✅ Fix: Use startAfter with last document
      if (lastDoc) {
        q = query(q, startAfter(lastDoc));
      }

      const snapshot = await getDocs(q);
      const workouts = snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
      }));

      // Return last doc for pagination
      return { 
        workouts, 
        lastDoc: snapshot.docs[snapshot.docs.length - 1] 
      };
    } catch (error) {
      console.error('❌ Get workouts error:', error);
      return { workouts: [], lastDoc: null };
    }
  },

  /**
   * ✅ Get workouts by date range
   */
  getWorkoutsByDate: async (userId, startDate, endDate) => {
    try {
      const q = query(
        collection(db, 'workouts'),
        where('userId', '==', userId),
        where('workoutDate', '>=', startDate),
        where('workoutDate', '<=', endDate),
        orderBy('workoutDate', 'desc')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
      }));
    } catch (error) {
      console.error('❌ Get workouts by date error:', error);
      return [];
    }
  },

  /**
   * ✅ Get single workout
   */
  getWorkout: async (workoutId) => {
    try {
      const docSnap = await getDoc(doc(db, 'workouts', workoutId));
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      console.error('❌ Get workout error:', error);
      return null;
    }
  },

  /**
   * ✅ Update workout
   */
  updateWorkout: async (workoutId, workoutData) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No user logged in');

      await updateDoc(doc(db, 'workouts', workoutId), {
        ...workoutData,
        updated_at: serverTimestamp()
      });

      console.log('✅ Workout updated:', workoutId);
      return true;
    } catch (error) {
      console.error('❌ Update workout error:', error);
      throw error;
    }
  },

  /**
   * ✅ Delete workout
   */
  deleteWorkout: async (workoutId) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No user logged in');

      await deleteDoc(doc(db, 'workouts', workoutId));

      // Update user stats
      await updateDoc(doc(db, 'users', user.uid), {
        totalWorkouts: increment(-1)
      });

      console.log('✅ Workout deleted:', workoutId);
      return true;
    } catch (error) {
      console.error('❌ Delete workout error:', error);
      throw error;
    }
  },

  /**
   * ✅ Get workout stats (last 30 days)
   */
  getWorkoutStats: async (userId) => {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const workouts = await workoutServices.getWorkoutsByDate(
        userId, 
        thirtyDaysAgo, 
        new Date()
      );

      const stats = {
        totalWorkouts: workouts.length,
        totalDuration: workouts.reduce((sum, w) => sum + (w.duration || 0), 0),
        totalCalories: workouts.reduce((sum, w) => sum + (w.caloriesBurned || 0), 0),
        avgRating: workouts.length > 0 
          ? (workouts.reduce((sum, w) => sum + (w.rating || 0), 0) / workouts.length)
          : 0,
        longestStreak: calculateStreak(workouts)
      };

      return stats;
    } catch (error) {
      console.error('❌ Get workout stats error:', error);
      return null;
    }
  },

  /**
   * ✅ Get top exercises for user
   */
  getFavoriteExercises: async (userId, limit = 10) => {
    try {
      const { workouts } = await workoutServices.getUserWorkouts(userId, 50);
      
      const exerciseCounts = {};
      workouts.forEach(workout => {
        if (workout.exercises) {
          workout.exercises.forEach(ex => {
            exerciseCounts[ex.exerciseId] = (exerciseCounts[ex.exerciseId] || 0) + 1;
          });
        }
      });

      const sortedExercises = Object.entries(exerciseCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, limit)
        .map(([exerciseId, count]) => ({ exerciseId, count }));

      return sortedExercises;
    } catch (error) {
      console.error('❌ Get favorite exercises error:', error);
      return [];
    }
  },

  /**
   * ✅ Coach: Get client workouts
   */
  getClientWorkouts: async (coachId, clientId, limit = 20) => {
    try {
      const q = query(
        collection(db, 'workouts'),
        where('userId', '==', clientId),
        where('coachId', '==', coachId),
        orderBy('workoutDate', 'desc'),
        limit(limit)
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
      }));
    } catch (error) {
      console.error('❌ Get client workouts error:', error);
      return [];
    }
  }
};

// ✅ Helper function
const calculateStreak = (workouts) => {
  if (!workouts?.length) return 0;
  
  const dates = workouts
    .map(w => w.workoutDate?.toDate?.())
    .filter(Boolean)
    .sort((a, b) => b - a);
    
  if (!dates.length) return 0;
    
  let streak = 1;
  let maxStreak = 1;
  
  for (let i = 1; i < dates.length; i++) {
    const prevDay = new Date(dates[i - 1]);
    prevDay.setDate(prevDay.getDate() + 1);
    
    if (dates[i].toDateString() === prevDay.toDateString()) {
      streak++;
      maxStreak = Math.max(maxStreak, streak);
    } else {
      streak = 1;
    }
  }  
  return maxStreak;
};

export default workoutServices;
