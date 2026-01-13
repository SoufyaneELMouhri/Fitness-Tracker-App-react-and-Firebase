import { db } from '../firebase/firebase';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  getDocs, 
  query, 
  where,
  serverTimestamp,
  setDoc
} from 'firebase/firestore';

const progressServices = {
  
  // ============= WEIGHT TRACKING (from users collection) =============
  
  // Get user profile (includes weight)
  getUserProfile: async (userId) => {
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        return { success: true, data: userSnap.data() };
      } else {
        return { success: false, error: 'User not found' };
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return { success: false, error: error.message };
    }
  },

  // Update weight in user profile
  updateUserWeight: async (userId, weight) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        weight: weight,
        updated_at: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      console.error('Error updating weight:', error);
      return { success: false, error: error.message };
    }
  },

  // Add weight log entry (creates history)
  addWeightEntry: async (userId, weightData) => {
    try {
      const weightRef = collection(db, 'weightHistory');
      const newEntry = await addDoc(weightRef, {
        userId,
        weight: weightData.weight,
        unit: weightData.unit || 'kg',
        date: weightData.date || new Date().toISOString().split('T')[0],
        notes: weightData.notes || '',
        timestamp: serverTimestamp()
      });
      
      // Also update current weight in user profile
      await progressServices.updateUserWeight(userId, weightData.weight);
      
      return { success: true, id: newEntry.id };
    } catch (error) {
      console.error('Error adding weight entry:', error);
      return { success: false, error: error.message };
    }
  },

  // Get weight history
  getWeightLogs: async (userId, limit = 30) => {
    try {
      const weightRef = collection(db, 'weightHistory');
      const q = query(
        weightRef,
        where('userId', '==', userId)
      );
      
      const querySnapshot = await getDocs(q);
      const logs = [];
      
      querySnapshot.forEach((doc) => {
        logs.push({ id: doc.id, ...doc.data() });
      });
      
      // If no history, get current weight from user profile
      if (logs.length === 0) {
        const userResult = await progressServices.getUserProfile(userId);
        if (userResult.success && userResult.data.weight) {
          logs.push({
            id: 'current',
            userId,
            weight: userResult.data.weight,
            unit: 'kg',
            date: new Date().toISOString().split('T')[0],
            notes: 'Current weight'
          });
        }
      }
      
      // Sort by date descending
      logs.sort((a, b) => b.date.localeCompare(a.date));
      
      return { success: true, data: logs.slice(0, limit) };
    } catch (error) {
      console.error('Error fetching weight logs:', error);
      return { success: false, error: error.message };
    }
  },

  // Delete weight entry
  deleteWeightEntry: async (entryId) => {
    try {
      if (entryId === 'current') {
        return { success: false, error: 'Cannot delete current weight' };
      }
      await deleteDoc(doc(db, 'weightHistory', entryId));
      return { success: true };
    } catch (error) {
      console.error('Error deleting weight entry:', error);
      return { success: false, error: error.message };
    }
  },

  // ============= BODY MEASUREMENTS (using user profile) =============
  
  // Add/update body measurements in user profile
  updateMeasurements: async (userId, measurementData) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        measurements: {
          ...measurementData,
          lastUpdated: new Date().toISOString().split('T')[0]
        },
        updated_at: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      console.error('Error updating measurements:', error);
      return { success: false, error: error.message };
    }
  },

  // Get measurements from user profile
  getMeasurements: async (userId) => {
    try {
      const userResult = await progressServices.getUserProfile(userId);
      
      if (userResult.success && userResult.data.measurements) {
        return { 
          success: true, 
          data: [userResult.data.measurements] // Return as array for consistency
        };
      }
      
      return { success: true, data: [] };
    } catch (error) {
      console.error('Error fetching measurements:', error);
      return { success: false, error: error.message };
    }
  },

  // ============= WORKOUT SESSIONS (using existing workouts collection) =============
  
  // Get workout sessions from workouts collection
  getWorkoutSessions: async (userId, limit = 30) => {
    try {
      const workoutRef = collection(db, 'workouts');
      const q = query(
        workoutRef,
        where('userId', '==', userId)
      );
      
      const querySnapshot = await getDocs(q);
      const workouts = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        workouts.push({ 
          id: doc.id, 
          ...data,
          // Normalize data structure
          date: data.date || data.created_at?.toDate().toISOString().split('T')[0],
          workoutName: data.name || data.workoutName || 'Workout',
          duration: data.duration || 0,
          caloriesBurned: data.caloriesBurned || data.calories || 0,
          exercises: data.exercises || []
        });
      });
      
      // Sort by date descending
      workouts.sort((a, b) => {
        const dateA = a.date || '';
        const dateB = b.date || '';
        return dateB.localeCompare(dateA);
      });
      
      return { success: true, data: workouts.slice(0, limit) };
    } catch (error) {
      console.error('Error fetching workout sessions:', error);
      return { success: false, error: error.message };
    }
  },

  // Add workout session
  addWorkoutSession: async (userId, workoutData) => {
    try {
      const workoutRef = collection(db, 'workouts');
      const newWorkout = await addDoc(workoutRef, {
        userId,
        name: workoutData.workoutName || workoutData.name,
        date: workoutData.date || new Date().toISOString().split('T')[0],
        duration: workoutData.duration || 0,
        caloriesBurned: workoutData.caloriesBurned || 0,
        exercises: workoutData.exercises || [],
        notes: workoutData.notes || '',
        created_at: serverTimestamp()
      });
      
      // Update user's totalWorkouts count
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const currentTotal = userSnap.data().totalWorkouts || 0;
        await updateDoc(userRef, {
          totalWorkouts: currentTotal + 1,
          lastActive: serverTimestamp()
        });
      }
      
      return { success: true, id: newWorkout.id };
    } catch (error) {
      console.error('Error adding workout session:', error);
      return { success: false, error: error.message };
    }
  },

  // ============= PERSONAL RECORDS =============
  
  // Get personal records from user profile
  getPersonalRecords: async (userId) => {
    try {
      const userResult = await progressServices.getUserProfile(userId);
      
      if (userResult.success && userResult.data.personalRecords) {
        return { 
          success: true, 
          data: Object.values(userResult.data.personalRecords)
        };
      }
      
      return { success: true, data: [] };
    } catch (error) {
      console.error('Error fetching personal records:', error);
      return { success: false, error: error.message };
    }
  },

  // Add/update personal record in user profile
  addPersonalRecord: async (userId, prData) => {
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      
      const currentPRs = userSnap.exists() 
        ? (userSnap.data().personalRecords || {}) 
        : {};
      
      const exerciseKey = prData.exerciseName.toLowerCase().replace(/\s+/g, '_');
      
      currentPRs[exerciseKey] = {
        exerciseName: prData.exerciseName,
        weight: prData.weight,
        reps: prData.reps,
        unit: prData.unit || 'kg',
        date: prData.date || new Date().toISOString().split('T')[0],
        notes: prData.notes || ''
      };
      
      await updateDoc(userRef, {
        personalRecords: currentPRs,
        updated_at: serverTimestamp()
      });
      
      return { success: true };
    } catch (error) {
      console.error('Error adding personal record:', error);
      return { success: false, error: error.message };
    }
  },

  // ============= GOALS TRACKING =============
  
  // Get goals from user profile
  getActiveGoals: async (userId) => {
    try {
      const userResult = await progressServices.getUserProfile(userId);
      
      if (userResult.success) {
        const userData = userResult.data;
        const goals = [];
        
        // Create goal from user's goals field
        if (userData.goals) {
          goals.push({
            id: 'main-goal',
            userId,
            goalType: userData.goals,
            targetValue: userData.targetWeight || userData.weight,
            currentValue: userData.weight,
            status: 'active'
          });
        }
        
        return { success: true, data: goals };
      }
      
      return { success: true, data: [] };
    } catch (error) {
      console.error('Error fetching goals:', error);
      return { success: false, error: error.message };
    }
  },

  // Update goal in user profile
  setGoal: async (userId, goalData) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        goals: goalData.goalType,
        targetWeight: goalData.targetValue,
        updated_at: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      console.error('Error setting goal:', error);
      return { success: false, error: error.message };
    }
  },

  // Update goal progress (weight)
  updateGoalProgress: async (goalId, currentValue, status = 'active') => {
    // This is handled by updateUserWeight
    return { success: true };
  },

  // ============= STATISTICS & ANALYTICS =============
  
  // Calculate weight change
  calculateWeightChange: (weightLogs) => {
    if (!weightLogs || weightLogs.length < 1) {
      return { 
        change: 0, 
        percentage: 0,
        startWeight: 0,
        currentWeight: 0
      };
    }

    if (weightLogs.length === 1) {
      return {
        change: 0,
        percentage: 0,
        startWeight: weightLogs[0].weight,
        currentWeight: weightLogs[0].weight,
        startDate: weightLogs[0].date,
        currentDate: weightLogs[0].date
      };
    }

    const sorted = [...weightLogs].sort((a, b) => a.date.localeCompare(b.date));
    const firstWeight = sorted[0].weight;
    const lastWeight = sorted[sorted.length - 1].weight;
    
    const change = lastWeight - firstWeight;
    const percentage = firstWeight > 0 ? ((change / firstWeight) * 100).toFixed(1) : 0;

    return {
      change: change.toFixed(1),
      percentage: parseFloat(percentage),
      startWeight: firstWeight,
      currentWeight: lastWeight,
      startDate: sorted[0].date,
      currentDate: sorted[sorted.length - 1].date
    };
  },

  // Calculate body measurement changes
  calculateMeasurementChanges: (measurements) => {
    if (!measurements || measurements.length === 0) {
      return null;
    }

    // For single measurement, show current values
    if (measurements.length === 1) {
      const current = measurements[0];
      const changes = {};
      const bodyParts = ['chest', 'waist', 'hips', 'biceps', 'thighs', 'calves'];

      bodyParts.forEach(part => {
        if (current[part]) {
          changes[part] = {
            start: current[part],
            current: current[part],
            change: 0
          };
        }
      });

      return changes;
    }

    const sorted = [...measurements].sort((a, b) => a.date.localeCompare(b.date));
    const first = sorted[0];
    const last = sorted[sorted.length - 1];

    const changes = {};
    const bodyParts = ['chest', 'waist', 'hips', 'biceps', 'thighs', 'calves'];

    bodyParts.forEach(part => {
      if (first[part] && last[part]) {
        changes[part] = {
          start: first[part],
          current: last[part],
          change: (last[part] - first[part]).toFixed(1)
        };
      }
    });

    return changes;
  },

  // Get workout statistics
  getWorkoutStats: (workoutSessions) => {
    if (!workoutSessions || workoutSessions.length === 0) {
      return {
        totalWorkouts: 0,
        totalDuration: 0,
        totalVolume: 0,
        totalCalories: 0,
        averageDuration: 0
      };
    }

    const total = workoutSessions.reduce((acc, workout) => ({
      duration: acc.duration + (workout.duration || 0),
      volume: acc.volume + (workout.totalVolume || 0),
      calories: acc.calories + (workout.caloriesBurned || 0)
    }), { duration: 0, volume: 0, calories: 0 });

    return {
      totalWorkouts: workoutSessions.length,
      totalDuration: total.duration,
      totalVolume: Math.round(total.volume),
      totalCalories: Math.round(total.calories),
      averageDuration: workoutSessions.length > 0 
        ? Math.round(total.duration / workoutSessions.length) 
        : 0
    };
  },

  // Get progress summary
  getProgressSummary: async (userId) => {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const startDate = thirtyDaysAgo.toISOString().split('T')[0];

      const [weightResult, workoutResult, goalsResult] = await Promise.all([
        progressServices.getWeightLogs(userId, 30),
        progressServices.getWorkoutSessions(userId, 30),
        progressServices.getActiveGoals(userId)
      ]);

      const recentWeight = weightResult.data?.filter(w => w.date >= startDate) || [];
      const recentWorkouts = workoutResult.data?.filter(w => w.date >= startDate) || [];

      const summary = {
        weightChange: progressServices.calculateWeightChange(recentWeight),
        workoutStats: progressServices.getWorkoutStats(recentWorkouts),
        activeGoals: goalsResult.data || [],
        period: '30 days'
      };

      return { success: true, data: summary };
    } catch (error) {
      console.error('Error getting progress summary:', error);
      return { success: false, error: error.message };
    }
  },

  // Calculate workout streak
  calculateWorkoutStreak: (workoutSessions) => {
    if (!workoutSessions || workoutSessions.length === 0) {
      return { currentStreak: 0, longestStreak: 0 };
    }

    // Get unique workout dates
    const uniqueDates = [...new Set(workoutSessions.map(w => w.date))].sort();
    
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 1;
    
    for (let i = 1; i < uniqueDates.length; i++) {
      const prevDate = new Date(uniqueDates[i - 1]);
      const currDate = new Date(uniqueDates[i]);
      const diffDays = Math.floor((currDate - prevDate) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }
    
    longestStreak = Math.max(longestStreak, tempStreak);
    
    // Check if last workout was today or yesterday
    const lastWorkout = new Date(uniqueDates[uniqueDates.length - 1]);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    lastWorkout.setHours(0, 0, 0, 0);
    
    const daysDiff = Math.floor((today - lastWorkout) / (1000 * 60 * 60 * 24));
    
    if (daysDiff <= 1) {
      currentStreak = tempStreak;
    }

    return { currentStreak, longestStreak };
  },

  // ============= DUMMY METHODS (for compatibility) =============
  
  addMeasurements: async (userId, data) => {
    return progressServices.updateMeasurements(userId, data);
  },
  
  updateWeightEntry: async (entryId, data) => {
    return { success: true };
  },
  
  getProgressPhotos: async () => {
    return { success: true, data: [] };
  },
  
  addProgressPhoto: async () => {
    return { success: false, error: 'Feature not available' };
  },
  
  deleteProgressPhoto: async () => {
    return { success: false, error: 'Feature not available' };
  }
};

export default progressServices;
