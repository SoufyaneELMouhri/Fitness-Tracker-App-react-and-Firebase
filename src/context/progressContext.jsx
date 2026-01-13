import { createContext, useContext, useReducer, useEffect, useCallback } from "react";
import progressServices from '../services/progressServices';
import { UseAuth } from '../Hooks/UseAuth'; 

const ProgressContext = createContext();

// Action Types
const ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  
  // Weight
  SET_WEIGHT_LOGS: 'SET_WEIGHT_LOGS',
  ADD_WEIGHT_LOG: 'ADD_WEIGHT_LOG',
  UPDATE_WEIGHT_LOG: 'UPDATE_WEIGHT_LOG',
  DELETE_WEIGHT_LOG: 'DELETE_WEIGHT_LOG',
  
  // Measurements
  SET_MEASUREMENTS: 'SET_MEASUREMENTS',
  ADD_MEASUREMENT: 'ADD_MEASUREMENT',
  
  // Progress Photos
  SET_PROGRESS_PHOTOS: 'SET_PROGRESS_PHOTOS',
  ADD_PROGRESS_PHOTO: 'ADD_PROGRESS_PHOTO',
  DELETE_PROGRESS_PHOTO: 'DELETE_PROGRESS_PHOTO',
  
  // Workouts
  SET_WORKOUT_SESSIONS: 'SET_WORKOUT_SESSIONS',
  ADD_WORKOUT_SESSION: 'ADD_WORKOUT_SESSION',
  
  // Personal Records
  SET_PERSONAL_RECORDS: 'SET_PERSONAL_RECORDS',
  ADD_PERSONAL_RECORD: 'ADD_PERSONAL_RECORD',
  
  // Goals
  SET_GOALS: 'SET_GOALS',
  ADD_GOAL: 'ADD_GOAL',
  UPDATE_GOAL: 'UPDATE_GOAL',
  
  // Statistics
  SET_PROGRESS_SUMMARY: 'SET_PROGRESS_SUMMARY',
  SET_WEIGHT_STATS: 'SET_WEIGHT_STATS',
  SET_WORKOUT_STATS: 'SET_WORKOUT_STATS',
  
  RESET_STATE: 'RESET_STATE'
};

// Initial State
const initialState = {
  loading: false,
  error: null,
  
  // Weight Tracking
  weightLogs: [],
  weightStats: {
    change: 0,
    percentage: 0,
    startWeight: 0,
    currentWeight: 0
  },
  
  // Body Measurements
  measurements: [],
  measurementChanges: null,
  
  // Progress Photos
  progressPhotos: [],
  
  // Workout Tracking
  workoutSessions: [],
  workoutStats: {
    totalWorkouts: 0,
    totalDuration: 0,
    totalVolume: 0,
    totalCalories: 0,
    averageDuration: 0
  },
  workoutStreak: {
    currentStreak: 0,
    longestStreak: 0
  },
  
  // Personal Records
  personalRecords: [],
  
  // Goals
  activeGoals: [],
  
  // Summary
  progressSummary: null
};

// Reducer
const progressReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
      
    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
      
    // Weight
    case ACTIONS.SET_WEIGHT_LOGS:
      const weightStats = progressServices.calculateWeightChange(action.payload);
      return {
        ...state,
        weightLogs: action.payload,
        weightStats,
        loading: false
      };
      
    case ACTIONS.ADD_WEIGHT_LOG:
      const updatedWeightLogs = [action.payload, ...state.weightLogs];
      return {
        ...state,
        weightLogs: updatedWeightLogs,
        weightStats: progressServices.calculateWeightChange(updatedWeightLogs),
        loading: false
      };
      
    case ACTIONS.UPDATE_WEIGHT_LOG:
      const logsAfterUpdate = state.weightLogs.map(log =>
        log.id === action.payload.id ? { ...log, ...action.payload.data } : log
      );
      return {
        ...state,
        weightLogs: logsAfterUpdate,
        weightStats: progressServices.calculateWeightChange(logsAfterUpdate),
        loading: false
      };
      
    case ACTIONS.DELETE_WEIGHT_LOG:
      const logsAfterDelete = state.weightLogs.filter(log => log.id !== action.payload);
      return {
        ...state,
        weightLogs: logsAfterDelete,
        weightStats: progressServices.calculateWeightChange(logsAfterDelete),
        loading: false
      };
      
    // Measurements
    case ACTIONS.SET_MEASUREMENTS:
      const measurementChanges = progressServices.calculateMeasurementChanges(action.payload);
      return {
        ...state,
        measurements: action.payload,
        measurementChanges,
        loading: false
      };
      
    case ACTIONS.ADD_MEASUREMENT:
      const updatedMeasurements = [action.payload, ...state.measurements];
      return {
        ...state,
        measurements: updatedMeasurements,
        measurementChanges: progressServices.calculateMeasurementChanges(updatedMeasurements),
        loading: false
      };
      
    // Progress Photos
    case ACTIONS.SET_PROGRESS_PHOTOS:
      return { ...state, progressPhotos: action.payload, loading: false };
      
    case ACTIONS.ADD_PROGRESS_PHOTO:
      return {
        ...state,
        progressPhotos: [action.payload, ...state.progressPhotos],
        loading: false
      };
      
    case ACTIONS.DELETE_PROGRESS_PHOTO:
      return {
        ...state,
        progressPhotos: state.progressPhotos.filter(photo => photo.id !== action.payload),
        loading: false
      };
      
    // Workouts
    case ACTIONS.SET_WORKOUT_SESSIONS:
      const workoutStats = progressServices.getWorkoutStats(action.payload);
      const workoutStreak = progressServices.calculateWorkoutStreak(action.payload);
      return {
        ...state,
        workoutSessions: action.payload,
        workoutStats,
        workoutStreak,
        loading: false
      };
      
    case ACTIONS.ADD_WORKOUT_SESSION:
      const updatedWorkouts = [action.payload, ...state.workoutSessions];
      return {
        ...state,
        workoutSessions: updatedWorkouts,
        workoutStats: progressServices.getWorkoutStats(updatedWorkouts),
        workoutStreak: progressServices.calculateWorkoutStreak(updatedWorkouts),
        loading: false
      };
      
    // Personal Records
    case ACTIONS.SET_PERSONAL_RECORDS:
      return { ...state, personalRecords: action.payload, loading: false };
      
    case ACTIONS.ADD_PERSONAL_RECORD:
      return {
        ...state,
        personalRecords: [...state.personalRecords, action.payload],
        loading: false
      };
      
    // Goals
    case ACTIONS.SET_GOALS:
      return { ...state, activeGoals: action.payload, loading: false };
      
    case ACTIONS.ADD_GOAL:
      return {
        ...state,
        activeGoals: [...state.activeGoals, action.payload],
        loading: false
      };
      
    case ACTIONS.UPDATE_GOAL:
      return {
        ...state,
        activeGoals: state.activeGoals.map(goal =>
          goal.id === action.payload.id ? { ...goal, ...action.payload.data } : goal
        ),
        loading: false
      };
      
    // Statistics
    case ACTIONS.SET_PROGRESS_SUMMARY:
      return { ...state, progressSummary: action.payload, loading: false };
      
    case ACTIONS.RESET_STATE:
      return initialState;
      
    default:
      return state;
  }
};

export const ProgressProvider = ({ children }) => {
  const [state, dispatch] = useReducer(progressReducer, initialState);
  const { currentUser } = UseAuth(); // ✅ Keep your custom hook name

  // ============= HELPER FUNCTIONS =============
  
  const setLoading = useCallback((isLoading) => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: isLoading });
  }, []);

  const setError = useCallback((error) => {
    dispatch({ type: ACTIONS.SET_ERROR, payload: error });
  }, []);

  // ============= WEIGHT TRACKING =============
  
  const loadWeightLogs = useCallback(async () => {
    if (!currentUser) return;
    
    const result = await progressServices.getWeightLogs(currentUser.uid, 30);
    
    if (result.success) {
      dispatch({ type: ACTIONS.SET_WEIGHT_LOGS, payload: result.data });
    } else {
      setError(result.error);
    }
  }, [currentUser, setError]);

  const addWeightLog = useCallback(async (weightData) => {
    if (!currentUser) return { success: false, error: 'Not authenticated' };
    
    setLoading(true);
    const result = await progressServices.addWeightEntry(currentUser.uid, weightData);
    
    if (result.success) {
      await loadWeightLogs();
      return { success: true };
    } else {
      setError(result.error);
      return { success: false, error: result.error };
    }
  }, [currentUser, setLoading, setError, loadWeightLogs]);

  const updateWeightLog = useCallback(async (logId, updatedData) => {
    setLoading(true);
    const result = await progressServices.updateWeightEntry(logId, updatedData);
    
    if (result.success) {
      dispatch({
        type: ACTIONS.UPDATE_WEIGHT_LOG,
        payload: { id: logId, data: updatedData }
      });
      return { success: true };
    } else {
      setError(result.error);
      return { success: false, error: result.error };
    }
  }, [setLoading, setError]);

  const deleteWeightLog = useCallback(async (logId) => {
    setLoading(true);
    const result = await progressServices.deleteWeightEntry(logId);
    
    if (result.success) {
      dispatch({ type: ACTIONS.DELETE_WEIGHT_LOG, payload: logId });
      return { success: true };
    } else {
      setError(result.error);
      return { success: false, error: result.error };
    }
  }, [setLoading, setError]);

  // ============= BODY MEASUREMENTS =============
  
  const loadMeasurements = useCallback(async () => {
    if (!currentUser) return;
    
    const result = await progressServices.getMeasurements(currentUser.uid, 20);
    
    if (result.success) {
      dispatch({ type: ACTIONS.SET_MEASUREMENTS, payload: result.data });
    } else {
      setError(result.error);
    }
  }, [currentUser, setError]);

  const addMeasurement = useCallback(async (measurementData) => {
    if (!currentUser) return { success: false, error: 'Not authenticated' };
    
    setLoading(true);
    const result = await progressServices.addMeasurements(currentUser.uid, measurementData);
    
    if (result.success) {
      await loadMeasurements();
      return { success: true };
    } else {
      setError(result.error);
      return { success: false, error: result.error };
    }
  }, [currentUser, setLoading, setError, loadMeasurements]);

  // ============= PROGRESS PHOTOS =============
  
  const loadProgressPhotos = useCallback(async () => {
    if (!currentUser) return;
    
    const result = await progressServices.getProgressPhotos(currentUser.uid, 50);
    
    if (result.success) {
      dispatch({ type: ACTIONS.SET_PROGRESS_PHOTOS, payload: result.data });
    } else {
      setError(result.error);
    }
  }, [currentUser, setError]);

  const addProgressPhoto = useCallback(async (photoData) => {
    if (!currentUser) return { success: false, error: 'Not authenticated' };
    
    setLoading(true);
    const result = await progressServices.addProgressPhoto(currentUser.uid, photoData);
    
    if (result.success) {
      await loadProgressPhotos();
      return { success: true };
    } else {
      setError(result.error);
      return { success: false, error: result.error };
    }
  }, [currentUser, setLoading, setError, loadProgressPhotos]);

  const deleteProgressPhoto = useCallback(async (photoId) => {
    setLoading(true);
    const result = await progressServices.deleteProgressPhoto(photoId);
    
    if (result.success) {
      dispatch({ type: ACTIONS.DELETE_PROGRESS_PHOTO, payload: photoId });
      return { success: true };
    } else {
      setError(result.error);
      return { success: false, error: result.error };
    }
  }, [setLoading, setError]);

  // ============= WORKOUT SESSIONS =============
  
  const loadWorkoutSessions = useCallback(async () => {
    if (!currentUser) return;
    
    const result = await progressServices.getWorkoutSessions(currentUser.uid, 30);
    
    if (result.success) {
      dispatch({ type: ACTIONS.SET_WORKOUT_SESSIONS, payload: result.data });
    } else {
      setError(result.error);
    }
  }, [currentUser, setError]);

  const addWorkoutSession = useCallback(async (workoutData) => {
    if (!currentUser) return { success: false, error: 'Not authenticated' };
    
    setLoading(true);
    const result = await progressServices.addWorkoutSession(currentUser.uid, workoutData);
    
    if (result.success) {
      await loadWorkoutSessions();
      return { success: true };
    } else {
      setError(result.error);
      return { success: false, error: result.error };
    }
  }, [currentUser, setLoading, setError, loadWorkoutSessions]);

  // ============= PERSONAL RECORDS =============
  
  const loadPersonalRecords = useCallback(async () => {
    if (!currentUser) return;
    
    const result = await progressServices.getPersonalRecords(currentUser.uid);
    
    if (result.success) {
      dispatch({ type: ACTIONS.SET_PERSONAL_RECORDS, payload: result.data });
    } else {
      setError(result.error);
    }
  }, [currentUser, setError]);

  const addPersonalRecord = useCallback(async (prData) => {
    if (!currentUser) return { success: false, error: 'Not authenticated' };
    
    setLoading(true);
    const result = await progressServices.addPersonalRecord(currentUser.uid, prData);
    
    if (result.success) {
      await loadPersonalRecords();
      return { success: true };
    } else {
      setError(result.error);
      return { success: false, error: result.error };
    }
  }, [currentUser, setLoading, setError, loadPersonalRecords]);

  // ============= GOALS =============
  
  const loadActiveGoals = useCallback(async () => {
    if (!currentUser) return;
    
    const result = await progressServices.getActiveGoals(currentUser.uid);
    
    if (result.success) {
      dispatch({ type: ACTIONS.SET_GOALS, payload: result.data });
    } else {
      setError(result.error);
    }
  }, [currentUser, setError]);

  const setGoal = useCallback(async (goalData) => {
    if (!currentUser) return { success: false, error: 'Not authenticated' };
    
    setLoading(true);
    const result = await progressServices.setGoal(currentUser.uid, goalData);
    
    if (result.success) {
      await loadActiveGoals();
      return { success: true };
    } else {
      setError(result.error);
      return { success: false, error: result.error };
    }
  }, [currentUser, setLoading, setError, loadActiveGoals]);

  const updateGoalProgress = useCallback(async (goalId, currentValue, status = 'active') => {
    setLoading(true);
    const result = await progressServices.updateGoalProgress(goalId, currentValue, status);
    
    if (result.success) {
      dispatch({
        type: ACTIONS.UPDATE_GOAL,
        payload: { id: goalId, data: { currentValue, status } }
      });
      return { success: true };
    } else {
      setError(result.error);
      return { success: false, error: result.error };
    }
  }, [setLoading, setError]);

  // ============= STATISTICS =============
  
  const loadProgressSummary = useCallback(async () => {
    if (!currentUser) return;
    
    const result = await progressServices.getProgressSummary(currentUser.uid);
    
    if (result.success) {
      dispatch({ type: ACTIONS.SET_PROGRESS_SUMMARY, payload: result.data });
    } else {
      setError(result.error);
    }
  }, [currentUser, setError]);

  // ============= LOAD ALL DATA =============
  
  const loadAllProgressData = useCallback(async () => {
    if (!currentUser) return;
    
    setLoading(true);
    
    try {
      await Promise.all([
        loadWeightLogs(),
        loadMeasurements(),
        loadProgressPhotos(),
        loadWorkoutSessions(),
        loadPersonalRecords(),
        loadActiveGoals(),
        loadProgressSummary()
      ]);
    } catch (error) {
      setError(error.message);
    }
  }, [
    currentUser,
    setLoading,
    setError,
    loadWeightLogs,
    loadMeasurements,
    loadProgressPhotos,
    loadWorkoutSessions,
    loadPersonalRecords,
    loadActiveGoals,
    loadProgressSummary
  ]);

  // Load data on mount
  useEffect(() => {
    if (currentUser) {
      loadAllProgressData();
    }
  }, [currentUser, loadAllProgressData]);

  // ============= HELPER FUNCTIONS =============

  const getLatestWeight = useCallback(() => {
    if (state.weightLogs.length === 0) return null;
    return state.weightLogs[0];
  }, [state.weightLogs]);

  const getLatestMeasurements = useCallback(() => {
    if (state.measurements.length === 0) return null;
    return state.measurements[0];
  }, [state.measurements]);

  const getGoalProgress = useCallback((goal) => {
    if (!goal || !goal.targetValue || !goal.currentValue) return 0;
    
    const startValue = goal.startValue || goal.currentValue;
    const progress = Math.abs(goal.currentValue - startValue);
    const target = Math.abs(goal.targetValue - startValue);
    
    if (target === 0) return 0;
    
    return Math.min(Math.round((progress / target) * 100), 100);
  }, []);

  // ============= CONTEXT VALUE =============
  
  const value = {
    // State
    ...state,
    
    // Weight
    addWeightLog,
    updateWeightLog,
    deleteWeightLog,
    loadWeightLogs,
    getLatestWeight,
    
    // Measurements
    addMeasurement,
    loadMeasurements,
    getLatestMeasurements,
    
    // Progress Photos
    addProgressPhoto,
    deleteProgressPhoto,
    loadProgressPhotos,
    
    // Workouts
    addWorkoutSession,
    loadWorkoutSessions,
    
    // Personal Records
    addPersonalRecord,
    loadPersonalRecords,
    
    // Goals
    setGoal,
    updateGoalProgress,
    loadActiveGoals,
    getGoalProgress,
    
    // Statistics
    loadProgressSummary,
    loadAllProgressData,
    
    // Utilities
    setError,
    clearError: () => setError(null)
  };

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
};

;

export { ProgressContext };
