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
      
      await updateDoc(doc(db, 'users', user.uid), {
        totalWorkouts: increment(1),
        [`coachStats.totalWorkouts`]: increment(1),
        lastActive: serverTimestamp(),
        updated_at: serverTimestamp()
      });

      return { id: docRef.id, ...workoutWithUser };
    } catch (error) {
      console.error('Log workout error:', error);
      throw error;
    }
  },

  getUserWorkouts: async (userId, limitCount = 20, lastDoc = null) => {
    try {
      let q = query(
        collection(db, 'workouts'),
        where('userId', '==', userId),
        orderBy('created_at', 'desc'), 
        limit(limitCount)
      );

      if (lastDoc) {
        q = query(q, startAfter(lastDoc));
      }

      const snapshot = await getDocs(q);
      const workouts = snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
      }));

      return { workouts, lastDoc: snapshot.docs[snapshot.docs.length - 1] };
    } catch (error) {
      console.error('Get workouts error:', error);
      return { workouts: [], lastDoc: null };
    }
  },

  getWorkoutsByDate: async (userId, startDate, endDate) => {
    try {
      const { workouts } = await workoutServices.getUserWorkouts(userId, 50);
      const filtered = workouts.filter(w => {
        const date = w.workoutDate;
        return date >= startDate && date <= endDate;
      });
      return filtered;
    } catch (error) {
      console.error('Get workouts by date error:', error);
      return [];
    }
  },

  getWorkout: async (workoutId) => {
    try {
      const docSnap = await getDoc(doc(db, 'workouts', workoutId));
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      console.error('Get workout error:', error);
      return null;
    }
  },

  updateWorkout: async (workoutId, workoutData) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No user logged in');

      await updateDoc(doc(db, 'workouts', workoutId), {
        ...workoutData,
        updated_at: serverTimestamp()
      });

      return true;
    } catch (error) {
      console.error('Update workout error:', error);
      throw error;
    }
  },

  deleteWorkout: async (workoutId) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No user logged in');

      await deleteDoc(doc(db, 'workouts', workoutId));

      await updateDoc(doc(db, 'users', user.uid), {
        totalWorkouts: increment(-1)
      });

      return true;
    } catch (error) {
      console.error('Delete workout error:', error);
      throw error;
    }
  },

  getWorkoutStats: async (userId) => {
    try {
      const { workouts } = await workoutServices.getUserWorkouts(userId, 30);
      
      const stats = {
        totalWorkouts: workouts.length,
        totalCalories: workouts.reduce((sum, w) => sum + (w.caloriesBurned || 0), 0),
        avgRating: workouts.length > 0 
          ? (workouts.reduce((sum, w) => sum + (w.rating || 0), 0) / workouts.length)
          : 0,
        longestStreak: workouts.length
      };

      return stats;
    } catch (error) {
      console.error('Get workout stats error:', error);
      return null;
    }
  },

  getFavoriteExercises: async (userId, limit = 10) => {
    try {
      const { workouts } = await workoutServices.getUserWorkouts(userId, 50);
      
      const exerciseCounts = {};
      workouts.forEach(workout => {
        if (workout.exercises) {
          workout.exercises.forEach(ex => {
            exerciseCounts[ex.name || ex.exerciseId] = (exerciseCounts[ex.name || ex.exerciseId] || 0) + 1;
          });
        }
      });

      const sortedExercises = Object.entries(exerciseCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, limit)
        .map(([exerciseId, count]) => ({ exerciseId, count }));

      return sortedExercises;
    } catch (error) {
      console.error('Get favorite exercises error:', error);
      return [];
    }
  },

  getClientWorkouts: async (coachId, clientId, limit = 20) => {
    try {
      const { workouts } = await workoutServices.getUserWorkouts(clientId, limit);
      return workouts.filter(w => w.coachId === coachId);
    } catch (error) {
      console.error('Get client workouts error:', error);
      return [];
    }
  }
};

export default workoutServices;
