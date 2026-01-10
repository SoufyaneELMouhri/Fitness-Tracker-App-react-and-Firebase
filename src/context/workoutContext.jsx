// contexts/WorkoutContext.jsx
import React, { createContext, useState, useEffect, useCallback } from 'react';
import workoutServices from '../services/workoutServices';
import { UseAuth } from '../Hooks/UseAuth';

const WorkoutContext = createContext(null);

export const WorkoutProvider = ({ children }) => {
  const { currentUser } = UseAuth();
  
  // State
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [favoriteExercises, setFavoriteExercises] = useState([]);
  const [activeWorkout, setActiveWorkout] = useState(null);
  
  // Pagination
  const [hasMoreWorkouts, setHasMoreWorkouts] = useState(true);
  const [lastWorkoutDoc, setLastWorkoutDoc] = useState(null);

  // ✅ Load workouts on mount & user change
  useEffect(() => {
    if (!currentUser) {
      setWorkouts([]);
      setStats(null);
      setFavoriteExercises([]);
      setHasMoreWorkouts(true);
      setLastWorkoutDoc(null);
      return;
    }

    loadWorkouts();
    loadStats();
    loadFavorites();
  }, [currentUser]);

  // ✅ Load initial workouts
  const loadWorkouts = useCallback(async (loadMore = false) => {
    if (!currentUser || (!loadMore && !hasMoreWorkouts)) return;

    setLoading(true);
    try {
      const { workouts: newWorkouts, lastDoc } = await workoutServices.getUserWorkouts(
        currentUser.uid, 
        20, 
        loadMore ? lastWorkoutDoc : null
      );

      if (loadMore) {
        setWorkouts(prev => [...prev, ...newWorkouts]);
      } else {
        setWorkouts(newWorkouts);
      }

      setLastWorkoutDoc(lastDoc);
      setHasMoreWorkouts(newWorkouts.length === 20);
      
      console.log('✅ Loaded workouts:', newWorkouts.length);
    } catch (error) {
      console.error('❌ Load workouts error:', error);
    } finally {
      setLoading(false);
    }
  }, [currentUser?.uid, lastWorkoutDoc, hasMoreWorkouts]);

  // ✅ Load workout stats
  const loadStats = useCallback(async () => {
    if (!currentUser) return;

    try {
      const workoutStats = await workoutServices.getWorkoutStats(currentUser.uid);
      setStats(workoutStats);
    } catch (error) {
      console.error('❌ Load stats error:', error);
    }
  }, [currentUser?.uid]);

  // ✅ Load favorite exercises
  const loadFavorites = useCallback(async () => {
    if (!currentUser) return;

    try {
      const favorites = await workoutServices.getFavoriteExercises(currentUser.uid, 10);
      setFavoriteExercises(favorites);
    } catch (error) {
      console.error('❌ Load favorites error:', error);
    }
  }, [currentUser?.uid]);

  // ✅ Log new workout
  const logWorkout = async (workoutData) => {
    if (!currentUser) throw new Error('No user logged in');

    try {
      setLoading(true);
      const newWorkout = await workoutServices.logWorkout(workoutData);
      
      // Add to beginning of list
      setWorkouts(prev => [newWorkout, ...prev]);
      
      // Refresh stats
      await loadStats();
      
      console.log('✅ Workout logged successfully');
      return newWorkout;
    } catch (error) {
      console.error('❌ Log workout error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ✅ Update workout
  const updateWorkout = async (workoutId, workoutData) => {
    try {
      setLoading(true);
      await workoutServices.updateWorkout(workoutId, workoutData);
      
      // Update local state
      setWorkouts(prev => prev.map(w => 
        w.id === workoutId ? { ...w, ...workoutData } : w
      ));
      
      console.log('✅ Workout updated');
      return true;
    } catch (error) {
      console.error('❌ Update workout error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete workout
  const deleteWorkout = async (workoutId) => {
    try {
      setLoading(true);
      await workoutServices.deleteWorkout(workoutId);
      
      // Remove from local state
      setWorkouts(prev => prev.filter(w => w.id !== workoutId));
      
      console.log('✅ Workout deleted');
      return true;
    } catch (error) {
      console.error('❌ Delete workout error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ✅ Load more workouts (infinite scroll)
  const loadMoreWorkouts = useCallback(() => {
    loadWorkouts(true);
  }, [loadWorkouts]);

  // ✅ Start new workout
  const startWorkout = (workoutTemplate = null) => {
    setActiveWorkout({
      id: null,
      template: workoutTemplate,
      exercises: [],
      duration: 0,
      caloriesBurned: 0,
      notes: ''
    });
  };

  // ✅ Complete active workout
  const completeWorkout = async (workoutData) => {
    if (!activeWorkout) throw new Error('No active workout');

    const finalWorkout = {
      ...workoutData,
      exercises: activeWorkout.exercises,
      duration: activeWorkout.duration,
      caloriesBurned: activeWorkout.caloriesBurned
    };

    await logWorkout(finalWorkout);
    setActiveWorkout(null);
  };

  const value = {
    // Data
    workouts,
    stats,
    favoriteExercises,
    activeWorkout,
    loading,
    hasMoreWorkouts,
    
    // Actions
    logWorkout,
    updateWorkout,
    deleteWorkout,
    loadMoreWorkouts,
    startWorkout,
    completeWorkout,
    refreshWorkouts: loadWorkouts,
    
    // Computed
    totalWorkouts: workouts.length,
    avgWorkoutCalories: stats?.totalCalories / workouts.length || 0
  };

  return (
    <WorkoutContext.Provider value={value}>
      {children}
    </WorkoutContext.Provider>
  );
};


export default WorkoutContext;
