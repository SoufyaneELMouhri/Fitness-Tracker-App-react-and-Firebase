import React, { useState } from 'react';
import { useNutrition } from '../../Hooks/useNutrition';
import AddFoodModal from '../../Components/componentUsers/Nutrition/AddFoodModal';

export default function Nutrition() {
  const {
    // State from context
    foodLogs,
    dailyTotals,
    nutritionGoals,
    mealGroups,
    waterIntake,
    loading,
    selectedDate,
    
    // Functions from context
    addFoodLog,
    deleteFoodLog,
    addWaterLog,
    getRemainingNutrition,
    getProgressPercentage,
    goToToday,
    goToPreviousDay,
    goToNextDay
  } = useNutrition();

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState('breakfast');

  // Quick add foods (static - could move to Firebase later)
  const quickAddFoods = [
    { name: '🥑 Avocado', calories: 160, protein: 2, carbs: 9, fat: 15, servingSize: 100, servingUnit: 'g' },
    { name: '🍗 Chicken Breast', calories: 165, protein: 31, carbs: 0, fat: 3.6, servingSize: 100, servingUnit: 'g' },
    { name: '🥚 Eggs (2)', calories: 140, protein: 12, carbs: 1, fat: 10, servingSize: 2, servingUnit: 'eggs' },
    { name: '🍎 Apple', calories: 95, protein: 0.5, carbs: 25, fat: 0.3, servingSize: 1, servingUnit: 'medium' },
    { name: '🥜 Almonds', calories: 160, protein: 6, carbs: 6, fat: 14, servingSize: 28, servingUnit: 'g' },
    { name: '🥛 Milk', calories: 122, protein: 8, carbs: 12, fat: 5, servingSize: 240, servingUnit: 'ml' }
  ];

  // Calculate remaining nutrition
  const remaining = getRemainingNutrition();

  // Handle quick add
  const handleQuickAdd = async (food) => {
    const result = await addFoodLog({
      foodName: food.name,
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fat: food.fat,
      servingSize: food.servingSize,
      servingUnit: food.servingUnit,
      mealType: 'snack',
      quantity: 1
    });

    if (result.success) {
      // Show success message (you can add toast notification here)
      console.log('Food added successfully!');
    }
  };

  // Handle water glass click
  const handleWaterClick = async () => {
    if (waterIntake < nutritionGoals.water) {
      await addWaterLog(1);
    }
  };

  // Open modal for specific meal
  const handleAddMeal = (mealType) => {
    setSelectedMealType(mealType);
    setShowAddModal(true);
  };

  // Calculate meal totals
  const getMealTotals = (mealType) => {
    const meals = mealGroups[mealType] || [];
    return meals.reduce((sum, meal) => sum + (meal.calories * (meal.quantity || 1)), 0);
  };

  // Format date display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date().toISOString().split('T')[0];
    
    if (dateString === today) return 'Today';
    
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getPercentage = (nutrient) => {
    return getProgressPercentage(nutrient);
  };

  if (loading && foodLogs.length === 0) {
    return (
      <div className="min-vh-100 bg-light d-flex justify-content-center align-items-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-light p-4">
      <div className="container-fluid">
        {/* Header with Date Navigation */}
        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="display-5 fw-bold">Nutrition Tracker 🍎</h1>
              <p className="text-muted">Track your daily nutrition and stay on target</p>
            </div>
            
            {/* Date Navigator */}
            <div className="btn-group">
              <button className="btn btn-outline-secondary" onClick={goToPreviousDay}>
                ←
              </button>
              <button className="btn btn-outline-secondary" onClick={goToToday}>
                {formatDate(selectedDate)}
              </button>
              <button className="btn btn-outline-secondary" onClick={goToNextDay}>
                →
              </button>
            </div>
          </div>
        </div>

        {/* Daily Summary Cards */}
        <div className="row g-4 mb-4">
          {/* Calories */}
          <div className="col-12 col-md-6 col-lg-3">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h3 className="h6 text-muted mb-0">Calories</h3>
                  <span style={{fontSize: '1.5rem'}}>🔥</span>
                </div>
                <div className="mb-2">
                  <span className="display-6 fw-bold">{dailyTotals.calories}</span>
                  <span className="text-muted"> / {nutritionGoals.dailyCalories}</span>
                </div>
                <div className="progress mb-2" style={{height: '8px'}}>
                  <div 
                    className="progress-bar bg-warning" 
                    style={{width: `${getPercentage('calories')}%`}}
                  ></div>
                </div>
                <p className="small text-muted mb-0">
                  {remaining.calories > 0 ? remaining.calories : 0} kcal remaining
                </p>
              </div>
            </div>
          </div>

          {/* Protein */}
          <div className="col-12 col-md-6 col-lg-3">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h3 className="h6 text-muted mb-0">Protein</h3>
                  <span style={{fontSize: '1.5rem'}}>🥩</span>
                </div>
                <div className="mb-2">
                  <span className="display-6 fw-bold">{dailyTotals.protein}g</span>
                  <span className="text-muted"> / {nutritionGoals.protein}g</span>
                </div>
                <div className="progress mb-2" style={{height: '8px'}}>
                  <div 
                    className="progress-bar bg-danger" 
                    style={{width: `${getPercentage('protein')}%`}}
                  ></div>
                </div>
                <p className="small text-muted mb-0">{getPercentage('protein')}% of goal</p>
              </div>
            </div>
          </div>

          {/* Carbs */}
          <div className="col-12 col-md-6 col-lg-3">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h3 className="h6 text-muted mb-0">Carbs</h3>
                  <span style={{fontSize: '1.5rem'}}>🍞</span>
                </div>
                <div className="mb-2">
                  <span className="display-6 fw-bold">{dailyTotals.carbs}g</span>
                  <span className="text-muted"> / {nutritionGoals.carbs}g</span>
                </div>
                <div className="progress mb-2" style={{height: '8px'}}>
                  <div 
                    className="progress-bar bg-warning" 
                    style={{width: `${getPercentage('carbs')}%`}}
                  ></div>
                </div>
                <p className="small text-muted mb-0">
                  {remaining.carbs > 0 ? remaining.carbs : 0}g remaining
                </p>
              </div>
            </div>
          </div>

          {/* Fat */}
          <div className="col-12 col-md-6 col-lg-3">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h3 className="h6 text-muted mb-0">Fat</h3>
                  <span style={{fontSize: '1.5rem'}}>🥑</span>
                </div>
                <div className="mb-2">
                  <span className="display-6 fw-bold">{dailyTotals.fat}g</span>
                  <span className="text-muted"> / {nutritionGoals.fat}g</span>
                </div>
                <div className="progress mb-2" style={{height: '8px'}}>
                  <div 
                    className="progress-bar bg-success" 
                    style={{width: `${getPercentage('fat')}%`}}
                  ></div>
                </div>
                <p className="small text-muted mb-0">
                  {remaining.fat > 0 ? remaining.fat : 0}g remaining
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="row g-4">
          {/* Today's Meals */}
          <div className="col-12 col-lg-8">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h2 className="h4 fw-bold mb-0">Today's Meals</h2>
                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={() => handleAddMeal('breakfast')}
                  >
                    + Add Meal
                  </button>
                </div>

                {foodLogs.length === 0 ? (
                  <div className="text-center py-5 text-muted">
                    <span style={{fontSize: '3rem'}}>🍽️</span>
                    <p className="mt-3">No meals logged yet. Start tracking your nutrition!</p>
                  </div>
                ) : (
                  <div className="vstack gap-3">
                    {/* Breakfast */}
                    {mealGroups.breakfast.length > 0 && (
                      <div className="border rounded p-3">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <div>
                            <h3 className="h5 fw-bold mb-0">Breakfast</h3>
                          </div>
                          <div className="text-end">
                            <p className="h4 text-warning fw-bold mb-0">
                              {getMealTotals('breakfast')}
                            </p>
                            <p className="small text-muted mb-0">calories</p>
                          </div>
                        </div>
                        <div className="vstack gap-2">
                          {mealGroups.breakfast.map((food) => (
                            <div 
                              key={food.id} 
                              className="d-flex justify-content-between align-items-center bg-light rounded p-2"
                            >
                              <span className="small">{food.foodName}</span>
                              <div className="d-flex gap-3 align-items-center">
                                <div className="d-flex gap-2 small text-muted">
                                  <span>P: {food.protein}g</span>
                                  <span>C: {food.carbs}g</span>
                                  <span>F: {food.fat}g</span>
                                </div>
                                <button 
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => deleteFoodLog(food.id)}
                                >
                                  ×
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Lunch */}
                    {mealGroups.lunch.length > 0 && (
                      <div className="border rounded p-3">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <div>
                            <h3 className="h5 fw-bold mb-0">Lunch</h3>
                          </div>
                          <div className="text-end">
                            <p className="h4 text-warning fw-bold mb-0">
                              {getMealTotals('lunch')}
                            </p>
                            <p className="small text-muted mb-0">calories</p>
                          </div>
                        </div>
                        <div className="vstack gap-2">
                          {mealGroups.lunch.map((food) => (
                            <div 
                              key={food.id} 
                              className="d-flex justify-content-between align-items-center bg-light rounded p-2"
                            >
                              <span className="small">{food.foodName}</span>
                              <div className="d-flex gap-3 align-items-center">
                                <div className="d-flex gap-2 small text-muted">
                                  <span>P: {food.protein}g</span>
                                  <span>C: {food.carbs}g</span>
                                  <span>F: {food.fat}g</span>
                                </div>
                                <button 
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => deleteFoodLog(food.id)}
                                >
                                  ×
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Dinner */}
                    {mealGroups.dinner.length > 0 && (
                      <div className="border rounded p-3">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <div>
                            <h3 className="h5 fw-bold mb-0">Dinner</h3>
                          </div>
                          <div className="text-end">
                            <p className="h4 text-warning fw-bold mb-0">
                              {getMealTotals('dinner')}
                            </p>
                            <p className="small text-muted mb-0">calories</p>
                          </div>
                        </div>
                        <div className="vstack gap-2">
                          {mealGroups.dinner.map((food) => (
                            <div 
                              key={food.id} 
                              className="d-flex justify-content-between align-items-center bg-light rounded p-2"
                            >
                              <span className="small">{food.foodName}</span>
                              <div className="d-flex gap-3 align-items-center">
                                <div className="d-flex gap-2 small text-muted">
                                  <span>P: {food.protein}g</span>
                                  <span>C: {food.carbs}g</span>
                                  <span>F: {food.fat}g</span>
                                </div>
                                <button 
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => deleteFoodLog(food.id)}
                                >
                                  ×
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Snacks */}
                    {mealGroups.snack.length > 0 && (
                      <div className="border rounded p-3">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <div>
                            <h3 className="h5 fw-bold mb-0">Snacks</h3>
                          </div>
                          <div className="text-end">
                            <p className="h4 text-warning fw-bold mb-0">
                              {getMealTotals('snack')}
                            </p>
                            <p className="small text-muted mb-0">calories</p>
                          </div>
                        </div>
                        <div className="vstack gap-2">
                          {mealGroups.snack.map((food) => (
                            <div 
                              key={food.id} 
                              className="d-flex justify-content-between align-items-center bg-light rounded p-2"
                            >
                              <span className="small">{food.foodName}</span>
                              <div className="d-flex gap-3 align-items-center">
                                <div className="d-flex gap-2 small text-muted">
                                  <span>P: {food.protein}g</span>
                                  <span>C: {food.carbs}g</span>
                                  <span>F: {food.fat}g</span>
                                </div>
                                <button 
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => deleteFoodLog(food.id)}
                                >
                                  ×
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-12 col-lg-4">
            <div className="vstack gap-4">
              {/* Water Intake */}
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h2 className="h5 fw-bold mb-0">Water Intake</h2>
                    <span style={{fontSize: '1.5rem'}}>💧</span>
                  </div>

                  <div className="mb-3">
                    <div className="mb-2">
                      <span className="display-6 fw-bold text-primary">{waterIntake}</span>
                      <span className="text-muted"> / {nutritionGoals.water} glasses</span>
                    </div>
                    <div className="progress" style={{height: '8px'}}>
                      <div 
                        className="progress-bar bg-primary" 
                        style={{width: `${(waterIntake / nutritionGoals.water) * 100}%`}}
                      ></div>
                    </div>
                  </div>

                  <div className="row g-2">
                    {[...Array(8)].map((_, index) => (
                      <div key={index} className="col-3">
                        <button
                          className={`btn w-100 rounded d-flex align-items-center justify-content-center ${
                            index < waterIntake ? 'bg-primary bg-opacity-10' : 'bg-light'
                          }`}
                          style={{height: '48px', fontSize: '1.5rem', border: 'none'}}
                          onClick={handleWaterClick}
                          disabled={index < waterIntake}
                        >
                          {index < waterIntake ? '💧' : '🫗'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Add Foods */}
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <h2 className="h5 fw-bold mb-3">Quick Add</h2>
                  <div className="row g-2">
                    {quickAddFoods.map((food, index) => (
                      <div key={index} className="col-6">
                        <button 
                          className="btn btn-outline-secondary w-100 text-start p-2"
                          onClick={() => handleQuickAdd(food)}
                        >
                          <div className="fw-medium small">{food.name}</div>
                          <div className="small text-warning">{food.calories} cal</div>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Food Modal */}
      {showAddModal && (
        <AddFoodModal
          show={showAddModal}
          onClose={() => setShowAddModal(false)}
          mealType={selectedMealType}
        />
      )}
    </div>
  );
}
