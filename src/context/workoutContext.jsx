// contexts/WorkoutContext.jsx
import React, { createContext, useState, useEffect, useCallback } from 'react';
import workoutServices from '../services/workoutServices';
import { UseAuth } from '../Hooks/UseAuth';

const WorkoutContext = createContext(null);

export const WorkoutProvider = ({ children }) => {
  const { currentUser } = UseAuth();
  
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [favoriteExercises, setFavoriteExercises] = useState([]);
  const [activeWorkout, setActiveWorkout] = useState(null);
  
  const [hasMoreWorkouts, setHasMoreWorkouts] = useState(true);
  const [lastWorkoutDoc, setLastWorkoutDoc] = useState(null);

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
      
      console.log('Loaded workouts:', newWorkouts.length);
    } catch (error) {
      console.error('Load workouts error:', error);
    } finally {
      setLoading(false);
    }
  }, [currentUser?.uid, lastWorkoutDoc, hasMoreWorkouts]);

  const loadStats = useCallback(async () => {
    if (!currentUser) return;

    try {
      const workoutStats = await workoutServices.getWorkoutStats(currentUser.uid);
      setStats(workoutStats);
    } catch (error) {
      console.error('Load stats error:', error);
    }
  }, [currentUser?.uid]);

  const loadFavorites = useCallback(async () => {
    if (!currentUser) return;

    try {
      const favorites = await workoutServices.getFavoriteExercises(currentUser.uid, 10);
      setFavoriteExercises(favorites);
    } catch (error) {
      console.error('Load favorites error:', error);
    }
  }, [currentUser?.uid]);

  const getWorkout = async (workoutId) => {
    if (!currentUser) throw new Error('No user logged in');

    try {
      const cachedWorkout = workouts.find(w => w.id === workoutId);
      if (cachedWorkout) {
        console.log('Workout from cache:', workoutId);
        return cachedWorkout;
      }

      console.log('Fetching workout from Firestore:', workoutId);
      const workout = await workoutServices.getWorkout(workoutId);
      
      if (!workout) {
        console.error('Workout not found:', workoutId);
        return null;
      }

      console.log('Workout fetched:', workout);
      return workout;
    } catch (error) {
      console.error('Get workout error:', error);
      throw error;
    }
  };

  const logWorkout = async (workoutData) => {
    if (!currentUser) throw new Error('No user logged in');

    try {
      setLoading(true);
      const newWorkout = await workoutServices.logWorkout(workoutData);
      
      setWorkouts(prev => [newWorkout, ...prev]);
      
      await loadStats();
      
      console.log('Workout logged successfully');
      return newWorkout;
    } catch (error) {
      console.error('Log workout error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateWorkout = async (workoutId, workoutData) => {
    try {
      setLoading(true);
      await workoutServices.updateWorkout(workoutId, workoutData);
      
      setWorkouts(prev => prev.map(w => 
        w.id === workoutId ? { ...w, ...workoutData } : w
      ));
      
      console.log('Workout updated');
      return true;
    } catch (error) {
      console.error('Update workout error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteWorkout = async (workoutId) => {
    try {
      setLoading(true);
      await workoutServices.deleteWorkout(workoutId);
      
      setWorkouts(prev => prev.filter(w => w.id !== workoutId));
      
      console.log('Workout deleted');
      return true;
    } catch (error) {
      console.error('Delete workout error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loadMoreWorkouts = useCallback(() => {
    loadWorkouts(true);
  }, [loadWorkouts]);

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
    workouts,
    stats,
    favoriteExercises,
    activeWorkout,
    loading,
    hasMoreWorkouts,
    
    getWorkout,
    logWorkout,
    updateWorkout,
    deleteWorkout,
    loadMoreWorkouts,
    startWorkout,
    completeWorkout,
    refreshWorkouts: loadWorkouts,
    
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
