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
  serverTimestamp 
} from 'firebase/firestore';

const nutritionServices = {
  
  // ============= MEAL LOGGING =============
  
  addFoodLog: async (userId, foodData) => {
    try {
      const logRef = collection(db, 'foodLogs');
      const newLog = await addDoc(logRef, {
        userId,
        foodName: foodData.foodName,
        calories: foodData.calories,
        protein: foodData.protein,
        carbs: foodData.carbs,
        fat: foodData.fat,
        fiber: foodData.fiber || 0,
        servingSize: foodData.servingSize,
        servingUnit: foodData.servingUnit,
        mealType: foodData.mealType,
        date: foodData.date || new Date().toISOString().split('T')[0],
        timestamp: serverTimestamp(),
        quantity: foodData.quantity || 1
      });
      return { success: true, id: newLog.id };
    } catch (error) {
      console.error('Error adding food log:', error);
      return { success: false, error: error.message };
    }
  },

  // Get food logs for specific date - ✅ NO INDEX NEEDED
  getFoodLogsByDate: async (userId, date) => {
    try {
      const logsRef = collection(db, 'foodLogs');
      
      // ✅ Simple query without orderBy
      const q = query(
        logsRef,
        where('userId', '==', userId),
        where('date', '==', date)
      );
      
      const querySnapshot = await getDocs(q);
      const logs = [];
      
      querySnapshot.forEach((doc) => {
        logs.push({ id: doc.id, ...doc.data() });
      });
      
      // ✅ Sort in JavaScript instead of Firebase
      logs.sort((a, b) => {
        // Handle timestamp objects from Firebase
        if (b.timestamp && a.timestamp) {
          const timeB = b.timestamp.seconds || 0;
          const timeA = a.timestamp.seconds || 0;
          return timeB - timeA; // Descending order (newest first)
        }
        return 0;
      });
      
      return { success: true, data: logs };
    } catch (error) {
      console.error('Error fetching food logs:', error);
      return { success: false, error: error.message };
    }
  },

  // Update food log entry
  updateFoodLog: async (logId, updatedData) => {
    try {
      const logRef = doc(db, 'foodLogs', logId);
      await updateDoc(logRef, updatedData);
      return { success: true };
    } catch (error) {
      console.error('Error updating food log:', error);
      return { success: false, error: error.message };
    }
  },

  // Delete food log entry
  deleteFoodLog: async (logId) => {
    try {
      await deleteDoc(doc(db, 'foodLogs', logId));
      return { success: true };
    } catch (error) {
      console.error('Error deleting food log:', error);
      return { success: false, error: error.message };
    }
  },

  // ============= NUTRITION CALCULATIONS =============
  
  calculateDailyTotals: (foodLogs) => {
    const totals = {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0
    };

    foodLogs.forEach(log => {
      const multiplier = log.quantity || 1;
      totals.calories += (log.calories || 0) * multiplier;
      totals.protein += (log.protein || 0) * multiplier;
      totals.carbs += (log.carbs || 0) * multiplier;
      totals.fat += (log.fat || 0) * multiplier;
      totals.fiber += (log.fiber || 0) * multiplier;
    });

    return {
      calories: Math.round(totals.calories),
      protein: Math.round(totals.protein),
      carbs: Math.round(totals.carbs),
      fat: Math.round(totals.fat),
      fiber: Math.round(totals.fiber)
    };
  },

  calculateCaloriesFromMacros: (protein, carbs, fat) => {
    return (protein * 4) + (carbs * 4) + (fat * 9);
  },

  calculateMacroPercentages: (protein, carbs, fat) => {
    const totalCalories = (protein * 4) + (carbs * 4) + (fat * 9);
    if (totalCalories === 0) return { proteinPercent: 0, carbsPercent: 0, fatPercent: 0 };
    
    return {
      proteinPercent: Math.round((protein * 4 / totalCalories) * 100),
      carbsPercent: Math.round((carbs * 4 / totalCalories) * 100),
      fatPercent: Math.round((fat * 9 / totalCalories) * 100)
    };
  },

  calculateRemaining: (consumed, goals) => {
    return {
      calories: goals.dailyCalories - consumed.calories,
      protein: goals.protein - consumed.protein,
      carbs: goals.carbs - consumed.carbs,
      fat: goals.fat - consumed.fat
    };
  },

  groupByMealType: (foodLogs) => {
    const grouped = {
      breakfast: [],
      lunch: [],
      dinner: [],
      snack: []
    };

    foodLogs.forEach(log => {
      const mealType = log.mealType || 'snack';
      if (grouped[mealType]) {
        grouped[mealType].push(log);
      }
    });

    const mealTotals = {};
    Object.keys(grouped).forEach(mealType => {
      mealTotals[mealType] = nutritionServices.calculateDailyTotals(grouped[mealType]);
    });

    return { meals: grouped, totals: mealTotals };
  },

  // ============= NUTRITION GOALS =============
  
  saveNutritionGoals: async (userId, goals) => {
    try {
      const userGoalsRef = doc(db, 'nutritionGoals', userId);
      
      // Try to update first
      try {
        await updateDoc(userGoalsRef, {
          dailyCalories: goals.dailyCalories,
          protein: goals.protein,
          carbs: goals.carbs,
          fat: goals.fat,
          fiber: goals.fiber || 25,
          water: goals.water || 8,
          updatedAt: serverTimestamp()
        });
      } catch (updateError) {
        // If document doesn't exist, use setDoc instead
        const { setDoc } = await import('firebase/firestore');
        await setDoc(userGoalsRef, {
          userId,
          dailyCalories: goals.dailyCalories,
          protein: goals.protein,
          carbs: goals.carbs,
          fat: goals.fat,
          fiber: goals.fiber || 25,
          water: goals.water || 8,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error saving nutrition goals:', error);
      return { success: false, error: error.message };
    }
  },

  getNutritionGoals: async (userId) => {
    try {
      const goalsRef = doc(db, 'nutritionGoals', userId);
      const docSnap = await getDoc(goalsRef);
      
      if (docSnap.exists()) {
        return { success: true, data: docSnap.data() };
      } else {
        // Return default goals
        return { 
          success: true, 
          data: {
            dailyCalories: 2000,
            protein: 150,
            carbs: 200,
            fat: 65,
            fiber: 25,
            water: 8
          }
        };
      }
    } catch (error) {
      console.error('Error fetching nutrition goals:', error);
      return { success: false, error: error.message };
    }
  },

  calculateMacroGoals: (weight, height, age, gender, activityLevel, goal) => {
    let bmr;
    if (gender === 'male') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      veryActive: 1.9
    };

    const tdee = bmr * (activityMultipliers[activityLevel] || 1.2);

    let dailyCalories;
    let proteinRatio, carbsRatio, fatRatio;

    switch (goal) {
      case 'lose':
        dailyCalories = Math.round(tdee - 500);
        proteinRatio = 0.35;
        carbsRatio = 0.35;
        fatRatio = 0.30;
        break;
      case 'gain':
        dailyCalories = Math.round(tdee + 300);
        proteinRatio = 0.30;
        carbsRatio = 0.45;
        fatRatio = 0.25;
        break;
      default:
        dailyCalories = Math.round(tdee);
        proteinRatio = 0.30;
        carbsRatio = 0.40;
        fatRatio = 0.30;
    }

    const protein = Math.round((dailyCalories * proteinRatio) / 4);
    const carbs = Math.round((dailyCalories * carbsRatio) / 4);
    const fat = Math.round((dailyCalories * fatRatio) / 9);

    return {
      dailyCalories,
      protein,
      carbs,
      fat,
      fiber: 25,
      water: 8,
      bmr: Math.round(bmr),
      tdee: Math.round(tdee)
    };
  },

  // ============= WATER TRACKING =============
  
  addWaterLog: async (userId, glasses, date) => {
    try {
      const waterRef = collection(db, 'waterLogs');
      await addDoc(waterRef, {
        userId,
        glasses,
        date: date || new Date().toISOString().split('T')[0],
        timestamp: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      console.error('Error adding water log:', error);
      return { success: false, error: error.message };
    }
  },

  // Get water logs for date - ✅ NO INDEX NEEDED
  getWaterLogs: async (userId, date) => {
    try {
      const waterRef = collection(db, 'waterLogs');
      const q = query(
        waterRef,
        where('userId', '==', userId),
        where('date', '==', date)
      );
      
      const querySnapshot = await getDocs(q);
      let totalGlasses = 0;
      
      querySnapshot.forEach((doc) => {
        totalGlasses += doc.data().glasses || 0;
      });
      
      return { success: true, data: totalGlasses };
    } catch (error) {
      console.error('Error fetching water logs:', error);
      return { success: false, error: error.message };
    }
  },

  // ============= CUSTOM FOODS =============
  
  addCustomFood: async (userId, foodData) => {
    try {
      const foodRef = collection(db, 'customFoods');
      const newFood = await addDoc(foodRef, {
        userId,
        name: foodData.name,
        calories: foodData.calories,
        protein: foodData.protein,
        carbs: foodData.carbs,
        fat: foodData.fat,
        fiber: foodData.fiber || 0,
        servingSize: foodData.servingSize,
        servingUnit: foodData.servingUnit,
        barcode: foodData.barcode || null,
        createdAt: serverTimestamp()
      });
      return { success: true, id: newFood.id };
    } catch (error) {
      console.error('Error adding custom food:', error);
      return { success: false, error: error.message };
    }
  },

  // Get user's custom foods - ✅ NO INDEX NEEDED
  getCustomFoods: async (userId) => {
    try {
      const foodsRef = collection(db, 'customFoods');
      const q = query(foodsRef, where('userId', '==', userId));
      
      const querySnapshot = await getDocs(q);
      const foods = [];
      
      querySnapshot.forEach((doc) => {
        foods.push({ id: doc.id, ...doc.data() });
      });
      
      // ✅ Sort alphabetically in JavaScript
      foods.sort((a, b) => a.name.localeCompare(b.name));
      
      return { success: true, data: foods };
    } catch (error) {
      console.error('Error fetching custom foods:', error);
      return { success: false, error: error.message };
    }
  },

  // ============= STATISTICS & REPORTS =============
  
  // Get weekly nutrition summary - ✅ NO INDEX NEEDED
  getWeeklySummary: async (userId, startDate, endDate) => {
    try {
      const logsRef = collection(db, 'foodLogs');
      
      // ✅ Simple query - only filter by userId
      const q = query(
        logsRef,
        where('userId', '==', userId)
      );
      
      const querySnapshot = await getDocs(q);
      const dailyData = {};
      
      // ✅ Filter date range in JavaScript
      querySnapshot.forEach((doc) => {
        const log = doc.data();
        
        // Filter by date range
        if (log.date >= startDate && log.date <= endDate) {
          if (!dailyData[log.date]) {
            dailyData[log.date] = [];
          }
          dailyData[log.date].push(log);
        }
      });

      // Calculate totals for each day
      const summary = Object.keys(dailyData).map(date => ({
        date,
        totals: nutritionServices.calculateDailyTotals(dailyData[date])
      }));
      
      // ✅ Sort by date
      summary.sort((a, b) => a.date.localeCompare(b.date));

      return { success: true, data: summary };
    } catch (error) {
      console.error('Error fetching weekly summary:', error);
      return { success: false, error: error.message };
    }
  },

  calculateAverageIntake: (weeklySummary) => {
    if (!weeklySummary || weeklySummary.length === 0) {
      return { calories: 0, protein: 0, carbs: 0, fat: 0 };
    }

    const totals = weeklySummary.reduce((acc, day) => ({
      calories: acc.calories + day.totals.calories,
      protein: acc.protein + day.totals.protein,
      carbs: acc.carbs + day.totals.carbs,
      fat: acc.fat + day.totals.fat
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

    const days = weeklySummary.length;

    return {
      calories: Math.round(totals.calories / days),
      protein: Math.round(totals.protein / days),
      carbs: Math.round(totals.carbs / days),
      fat: Math.round(totals.fat / days)
    };
  },

  // ============= RECIPES =============
  
  saveRecipe: async (userId, recipeData) => {
    try {
      const recipesRef = collection(db, 'recipes');
      const newRecipe = await addDoc(recipesRef, {
        userId,
        name: recipeData.name,
        ingredients: recipeData.ingredients,
        instructions: recipeData.instructions || '',
        servings: recipeData.servings || 1,
        totalNutrition: recipeData.totalNutrition,
        createdAt: serverTimestamp()
      });
      return { success: true, id: newRecipe.id };
    } catch (error) {
      console.error('Error saving recipe:', error);
      return { success: false, error: error.message };
    }
  },

  // Get user recipes - ✅ NO INDEX NEEDED
  getRecipes: async (userId) => {
    try {
      const recipesRef = collection(db, 'recipes');
      const q = query(recipesRef, where('userId', '==', userId));
      
      const querySnapshot = await getDocs(q);
      const recipes = [];
      
      querySnapshot.forEach((doc) => {
        recipes.push({ id: doc.id, ...doc.data() });
      });
      
      // ✅ Sort by name in JavaScript
      recipes.sort((a, b) => a.name.localeCompare(b.name));
      
      return { success: true, data: recipes };
    } catch (error) {
      console.error('Error fetching recipes:', error);
      return { success: false, error: error.message };
    }
  }
};

export default nutritionServices;
