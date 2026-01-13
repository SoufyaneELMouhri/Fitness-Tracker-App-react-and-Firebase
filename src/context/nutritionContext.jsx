import { createContext, useContext, useReducer, useEffect } from "react";
import nutritionServices from '../services/nutritionServices'; // your services file
import { UseAuth } from '../Hooks/UseAuth'; // assuming you have auth context

const NutritionContext = createContext();

// Action Types
const ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_FOOD_LOGS: 'SET_FOOD_LOGS',
  ADD_FOOD_LOG: 'ADD_FOOD_LOG',
  UPDATE_FOOD_LOG: 'UPDATE_FOOD_LOG',
  DELETE_FOOD_LOG: 'DELETE_FOOD_LOG',
  SET_DAILY_TOTALS: 'SET_DAILY_TOTALS',
  SET_NUTRITION_GOALS: 'SET_NUTRITION_GOALS',
  SET_WATER_INTAKE: 'SET_WATER_INTAKE',
  SET_CUSTOM_FOODS: 'SET_CUSTOM_FOODS',
  SET_WEEKLY_SUMMARY: 'SET_WEEKLY_SUMMARY',
  SET_SELECTED_DATE: 'SET_SELECTED_DATE',
  SET_MEAL_GROUPS: 'SET_MEAL_GROUPS',
  RESET_STATE: 'RESET_STATE'
};

// Initial State
const initialState = {
  loading: false,
  error: null,
  selectedDate: new Date().toISOString().split('T')[0],
  
  // Food Logs
  foodLogs: [],
  mealGroups: {
    breakfast: [],
    lunch: [],
    dinner: [],
    snack: []
  },
  
  // Daily Totals
  dailyTotals: {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0
  },
  
  // Goals
  nutritionGoals: {
    dailyCalories: 2000,
    protein: 150,
    carbs: 200,
    fat: 65,
    fiber: 25,
    water: 8
  },
  
  // Water Tracking
  waterIntake: 0,
  
  // Custom Foods
  customFoods: [],
  
  // Weekly Data
  weeklySummary: [],
  averageIntake: {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0
  }
};

// Reducer
const nutritionReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
      
    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
      
    case ACTIONS.SET_SELECTED_DATE:
      return { ...state, selectedDate: action.payload };
      
    case ACTIONS.SET_FOOD_LOGS:
      const totals = nutritionServices.calculateDailyTotals(action.payload);
      const groups = nutritionServices.groupByMealType(action.payload);
      return {
        ...state,
        foodLogs: action.payload,
        dailyTotals: totals,
        mealGroups: groups.meals,
        loading: false
      };
      
    case ACTIONS.ADD_FOOD_LOG:
      const updatedLogs = [...state.foodLogs, action.payload];
      const newTotals = nutritionServices.calculateDailyTotals(updatedLogs);
      const newGroups = nutritionServices.groupByMealType(updatedLogs);
      return {
        ...state,
        foodLogs: updatedLogs,
        dailyTotals: newTotals,
        mealGroups: newGroups.meals,
        loading: false
      };
      
    case ACTIONS.UPDATE_FOOD_LOG:
      const logsAfterUpdate = state.foodLogs.map(log =>
        log.id === action.payload.id ? { ...log, ...action.payload.data } : log
      );
      const totalsAfterUpdate = nutritionServices.calculateDailyTotals(logsAfterUpdate);
      const groupsAfterUpdate = nutritionServices.groupByMealType(logsAfterUpdate);
      return {
        ...state,
        foodLogs: logsAfterUpdate,
        dailyTotals: totalsAfterUpdate,
        mealGroups: groupsAfterUpdate.meals,
        loading: false
      };
      
    case ACTIONS.DELETE_FOOD_LOG:
      const logsAfterDelete = state.foodLogs.filter(log => log.id !== action.payload);
      const totalsAfterDelete = nutritionServices.calculateDailyTotals(logsAfterDelete);
      const groupsAfterDelete = nutritionServices.groupByMealType(logsAfterDelete);
      return {
        ...state,
        foodLogs: logsAfterDelete,
        dailyTotals: totalsAfterDelete,
        mealGroups: groupsAfterDelete.meals,
        loading: false
      };
      
    case ACTIONS.SET_DAILY_TOTALS:
      return { ...state, dailyTotals: action.payload };
      
    case ACTIONS.SET_NUTRITION_GOALS:
      return { ...state, nutritionGoals: action.payload, loading: false };
      
    case ACTIONS.SET_WATER_INTAKE:
      return { ...state, waterIntake: action.payload, loading: false };
      
    case ACTIONS.SET_CUSTOM_FOODS:
      return { ...state, customFoods: action.payload, loading: false };
      
    case ACTIONS.SET_WEEKLY_SUMMARY:
      const avgIntake = nutritionServices.calculateAverageIntake(action.payload);
      return {
        ...state,
        weeklySummary: action.payload,
        averageIntake: avgIntake,
        loading: false
      };
      
    case ACTIONS.SET_MEAL_GROUPS:
      return { ...state, mealGroups: action.payload };
      
    case ACTIONS.RESET_STATE:
      return initialState;
      
    default:
      return state;
  }
};

const NutritionProvider = ({ children }) => {
  const [state, dispatch] = useReducer(nutritionReducer, initialState);
  const { currentUser } = UseAuth(); // Get current user from auth context

  // ============= LOAD DATA ON DATE CHANGE =============
  useEffect(() => {
    if (currentUser) {
      loadDailyData();
      loadWaterIntake();
    }
  }, [state.selectedDate, currentUser]);

  // Load user goals on mount
  useEffect(() => {
    if (currentUser) {
      loadNutritionGoals();
      loadCustomFoods();
    }
  }, [currentUser]);

  // ============= HELPER FUNCTIONS =============
  
  const setLoading = (isLoading) => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: isLoading });
  };

  const setError = (error) => {
    dispatch({ type: ACTIONS.SET_ERROR, payload: error });
  };

  // ============= FOOD LOGS =============
  
  const loadDailyData = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    const result = await nutritionServices.getFoodLogsByDate(
      currentUser.uid,
      state.selectedDate
    );
    
    if (result.success) {
      dispatch({ type: ACTIONS.SET_FOOD_LOGS, payload: result.data });
    } else {
      setError(result.error);
    }
  };

  const addFoodLog = async (foodData) => {
    if (!currentUser) return { success: false, error: 'Not authenticated' };
    
    setLoading(true);
    const result = await nutritionServices.addFoodLog(currentUser.uid, {
      ...foodData,
      date: state.selectedDate
    });
    
    if (result.success) {
      // Reload data to get the new entry with ID
      await loadDailyData();
      return { success: true };
    } else {
      setError(result.error);
      return { success: false, error: result.error };
    }
  };

  const updateFoodLog = async (logId, updatedData) => {
    setLoading(true);
    const result = await nutritionServices.updateFoodLog(logId, updatedData);
    
    if (result.success) {
      dispatch({
        type: ACTIONS.UPDATE_FOOD_LOG,
        payload: { id: logId, data: updatedData }
      });
      return { success: true };
    } else {
      setError(result.error);
      return { success: false, error: result.error };
    }
  };

  const deleteFoodLog = async (logId) => {
    setLoading(true);
    const result = await nutritionServices.deleteFoodLog(logId);
    
    if (result.success) {
      dispatch({ type: ACTIONS.DELETE_FOOD_LOG, payload: logId });
      return { success: true };
    } else {
      setError(result.error);
      return { success: false, error: result.error };
    }
  };

  // ============= NUTRITION GOALS =============
  
  const loadNutritionGoals = async () => {
    if (!currentUser) return;
    
    const result = await nutritionServices.getNutritionGoals(currentUser.uid);
    
    if (result.success) {
      dispatch({ type: ACTIONS.SET_NUTRITION_GOALS, payload: result.data });
    } else {
      setError(result.error);
    }
  };

  const saveNutritionGoals = async (goals) => {
    if (!currentUser) return { success: false, error: 'Not authenticated' };
    
    setLoading(true);
    const result = await nutritionServices.saveNutritionGoals(currentUser.uid, goals);
    
    if (result.success) {
      dispatch({ type: ACTIONS.SET_NUTRITION_GOALS, payload: goals });
      return { success: true };
    } else {
      setError(result.error);
      return { success: false, error: result.error };
    }
  };

  const calculateAndSaveGoals = async (userProfile) => {
    const { weight, height, age, gender, activityLevel, goal } = userProfile;
    
    const calculatedGoals = nutritionServices.calculateMacroGoals(
      weight,
      height,
      age,
      gender,
      activityLevel,
      goal
    );
    
    return await saveNutritionGoals(calculatedGoals);
  };

  // ============= WATER TRACKING =============
  
  const loadWaterIntake = async () => {
    if (!currentUser) return;
    
    const result = await nutritionServices.getWaterLogs(
      currentUser.uid,
      state.selectedDate
    );
    
    if (result.success) {
      dispatch({ type: ACTIONS.SET_WATER_INTAKE, payload: result.data });
    } else {
      setError(result.error);
    }
  };

  const addWaterLog = async (glasses) => {
    if (!currentUser) return { success: false, error: 'Not authenticated' };
    
    setLoading(true);
    const result = await nutritionServices.addWaterLog(
      currentUser.uid,
      glasses,
      state.selectedDate
    );
    
    if (result.success) {
      // Update local state
      const newTotal = state.waterIntake + glasses;
      dispatch({ type: ACTIONS.SET_WATER_INTAKE, payload: newTotal });
      return { success: true };
    } else {
      setError(result.error);
      return { success: false, error: result.error };
    }
  };

  // ============= CUSTOM FOODS =============
  
  const loadCustomFoods = async () => {
    if (!currentUser) return;
    
    const result = await nutritionServices.getCustomFoods(currentUser.uid);
    
    if (result.success) {
      dispatch({ type: ACTIONS.SET_CUSTOM_FOODS, payload: result.data });
    } else {
      setError(result.error);
    }
  };

  const addCustomFood = async (foodData) => {
    if (!currentUser) return { success: false, error: 'Not authenticated' };
    
    setLoading(true);
    const result = await nutritionServices.addCustomFood(currentUser.uid, foodData);
    
    if (result.success) {
      await loadCustomFoods();
      return { success: true, id: result.id };
    } else {
      setError(result.error);
      return { success: false, error: result.error };
    }
  };

  // ============= STATISTICS =============
  
  const loadWeeklySummary = async (startDate, endDate) => {
    if (!currentUser) return;
    
    setLoading(true);
    const result = await nutritionServices.getWeeklySummary(
      currentUser.uid,
      startDate,
      endDate
    );
    
    if (result.success) {
      dispatch({ type: ACTIONS.SET_WEEKLY_SUMMARY, payload: result.data });
    } else {
      setError(result.error);
    }
  };

  // ============= DATE MANAGEMENT =============
  
  const changeDate = (newDate) => {
    dispatch({ type: ACTIONS.SET_SELECTED_DATE, payload: newDate });
  };

  const goToToday = () => {
    const today = new Date().toISOString().split('T')[0];
    dispatch({ type: ACTIONS.SET_SELECTED_DATE, payload: today });
  };

  const goToPreviousDay = () => {
    const currentDate = new Date(state.selectedDate);
    currentDate.setDate(currentDate.getDate() - 1);
    dispatch({
      type: ACTIONS.SET_SELECTED_DATE,
      payload: currentDate.toISOString().split('T')[0]
    });
  };

  const goToNextDay = () => {
    const currentDate = new Date(state.selectedDate);
    currentDate.setDate(currentDate.getDate() + 1);
    dispatch({
      type: ACTIONS.SET_SELECTED_DATE,
      payload: currentDate.toISOString().split('T')[0]
    });
  };

  // ============= CALCULATIONS =============
  
  const getRemainingNutrition = () => {
    return nutritionServices.calculateRemaining(
      state.dailyTotals,
      state.nutritionGoals
    );
  };

  const getMacroPercentages = () => {
    return nutritionServices.calculateMacroPercentages(
      state.dailyTotals.protein,
      state.dailyTotals.carbs,
      state.dailyTotals.fat
    );
  };

  const getProgressPercentage = (nutrient) => {
    const consumed = state.dailyTotals[nutrient] || 0;
    const goal = state.nutritionGoals[nutrient === 'calories' ? 'dailyCalories' : nutrient] || 1;
    return Math.min(Math.round((consumed / goal) * 100), 100);
  };

  // ============= CONTEXT VALUE =============
  
  const value = {
    // State
    ...state,
    
    // Food Logs
    addFoodLog,
    updateFoodLog,
    deleteFoodLog,
    loadDailyData,
    
    // Goals
    loadNutritionGoals,
    saveNutritionGoals,
    calculateAndSaveGoals,
    
    // Water
    addWaterLog,
    loadWaterIntake,
    
    // Custom Foods
    addCustomFood,
    loadCustomFoods,
    
    // Statistics
    loadWeeklySummary,
    
    // Date Management
    changeDate,
    goToToday,
    goToPreviousDay,
    goToNextDay,
    
    // Calculations
    getRemainingNutrition,
    getMacroPercentages,
    getProgressPercentage,
    
    // Utilities
    setError,
    clearError: () => setError(null)
  };

  return (
    <NutritionContext.Provider value={value}>
      {children}
    </NutritionContext.Provider>
  );
};

// Custom Hook
export const useNutrition = () => {
  const context = useContext(NutritionContext);
  if (!context) {
    throw new Error('useNutrition must be used within NutritionProvider');
  }
  return context;
};

export { NutritionContext, NutritionProvider };
