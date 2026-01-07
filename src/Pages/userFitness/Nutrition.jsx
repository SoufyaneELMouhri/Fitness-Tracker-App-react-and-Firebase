import React from 'react';

export default function Nutrition() {
  const dailyGoals = {
    calories: { consumed: 1850, goal: 2200 },
    protein: { consumed: 95, goal: 150 },
    carbs: { consumed: 180, goal: 250 },
    fat: { consumed: 62, goal: 75 }
  };

  const todaysMeals = [
    {
      id: 1,
      mealType: 'Breakfast',
      time: '8:30 AM',
      foods: [
        { name: 'Oatmeal with berries', calories: 320, protein: 12, carbs: 54, fat: 8 },
        { name: 'Greek yogurt', calories: 150, protein: 15, carbs: 12, fat: 4 }
      ],
      totalCalories: 470
    },
    {
      id: 2,
      mealType: 'Lunch',
      time: '1:00 PM',
      foods: [
        { name: 'Grilled chicken salad', calories: 420, protein: 45, carbs: 28, fat: 18 },
        { name: 'Brown rice', calories: 215, protein: 5, carbs: 45, fat: 2 }
      ],
      totalCalories: 635
    },
    {
      id: 3,
      mealType: 'Snack',
      time: '4:30 PM',
      foods: [
        { name: 'Protein shake', calories: 250, protein: 25, carbs: 15, fat: 8 },
        { name: 'Banana', calories: 105, protein: 1, carbs: 27, fat: 0 }
      ],
      totalCalories: 355
    },
    {
      id: 4,
      mealType: 'Dinner',
      time: '7:30 PM',
      foods: [
        { name: 'Salmon fillet', calories: 280, protein: 34, carbs: 0, fat: 16 },
        { name: 'Sweet potato', calories: 110, protein: 3, carbs: 26, fat: 0 }
      ],
      totalCalories: 390
    }
  ];

  const waterIntake = { current: 6, goal: 8 };

  const quickAddFoods = [
    { name: '🥑 Avocado', calories: 160 },
    { name: '🍗 Chicken Breast', calories: 165 },
    { name: '🥚 Eggs (2)', calories: 140 },
    { name: '🍎 Apple', calories: 95 },
    { name: '🥜 Almonds', calories: 160 },
    { name: '🥛 Milk', calories: 122 }
  ];

  const getPercentage = (consumed, goal) => Math.min((consumed / goal) * 100, 100);

  return (
    <div className="min-vh-100 bg-light p-4">
      <div className="container-fluid">
        {/* Header */}
        <div className="mb-4">
          <h1 className="display-5 fw-bold">Nutrition Tracker 🍎</h1>
          <p className="text-muted">Track your daily nutrition and stay on target</p>
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
                  <span className="display-6 fw-bold">{dailyGoals.calories.consumed}</span>
                  <span className="text-muted"> / {dailyGoals.calories.goal}</span>
                </div>
                <div className="progress mb-2" style={{height: '8px'}}>
                  <div className="progress-bar bg-warning" style={{width: `${getPercentage(dailyGoals.calories.consumed, dailyGoals.calories.goal)}%`}}></div>
                </div>
                <p className="small text-muted mb-0">{dailyGoals.calories.goal - dailyGoals.calories.consumed} kcal remaining</p>
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
                  <span className="display-6 fw-bold">{dailyGoals.protein.consumed}g</span>
                  <span className="text-muted"> / {dailyGoals.protein.goal}g</span>
                </div>
                <div className="progress mb-2" style={{height: '8px'}}>
                  <div className="progress-bar bg-danger" style={{width: `${getPercentage(dailyGoals.protein.consumed, dailyGoals.protein.goal)}%`}}></div>
                </div>
                <p className="small text-muted mb-0">{Math.round(getPercentage(dailyGoals.protein.consumed, dailyGoals.protein.goal))}% of goal</p>
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
                  <span className="display-6 fw-bold">{dailyGoals.carbs.consumed}g</span>
                  <span className="text-muted"> / {dailyGoals.carbs.goal}g</span>
                </div>
                <div className="progress mb-2" style={{height: '8px'}}>
                  <div className="progress-bar bg-warning" style={{width: `${getPercentage(dailyGoals.carbs.consumed, dailyGoals.carbs.goal)}%`}}></div>
                </div>
                <p className="small text-muted mb-0">{dailyGoals.carbs.goal - dailyGoals.carbs.consumed}g remaining</p>
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
                  <span className="display-6 fw-bold">{dailyGoals.fat.consumed}g</span>
                  <span className="text-muted"> / {dailyGoals.fat.goal}g</span>
                </div>
                <div className="progress mb-2" style={{height: '8px'}}>
                  <div className="progress-bar bg-success" style={{width: `${getPercentage(dailyGoals.fat.consumed, dailyGoals.fat.goal)}%`}}></div>
                </div>
                <p className="small text-muted mb-0">{dailyGoals.fat.goal - dailyGoals.fat.consumed}g remaining</p>
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
                  <button className="btn btn-primary btn-sm">+ Add Meal</button>
                </div>

                <div className="vstack gap-3">
                  {todaysMeals.map((meal) => (
                    <div key={meal.id} className="border rounded p-3">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <div>
                          <h3 className="h5 fw-bold mb-0">{meal.mealType}</h3>
                          <p className="small text-muted mb-0">{meal.time}</p>
                        </div>
                        <div className="text-end">
                          <p className="h4 text-warning fw-bold mb-0">{meal.totalCalories}</p>
                          <p className="small text-muted mb-0">calories</p>
                        </div>
                      </div>

                      <div className="vstack gap-2">
                        {meal.foods.map((food, index) => (
                          <div key={index} className="d-flex justify-content-between align-items-center bg-light rounded p-2">
                            <span className="small">{food.name}</span>
                            <div className="d-flex gap-3 small text-muted">
                              <span>P: {food.protein}g</span>
                              <span>C: {food.carbs}g</span>
                              <span>F: {food.fat}g</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
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
                      <span className="display-6 fw-bold text-primary">{waterIntake.current}</span>
                      <span className="text-muted"> / {waterIntake.goal} glasses</span>
                    </div>
                    <div className="progress" style={{height: '8px'}}>
                      <div className="progress-bar bg-primary" style={{width: `${(waterIntake.current / waterIntake.goal) * 100}%`}}></div>
                    </div>
                  </div>

                  <div className="row g-2">
                    {[...Array(8)].map((_, index) => (
                      <div key={index} className="col-3">
                        <div className={`rounded d-flex align-items-center justify-content-center ${index < waterIntake.current ? 'bg-primary bg-opacity-10' : 'bg-light'}`}
                             style={{height: '48px', fontSize: '1.5rem'}}>
                          {index < waterIntake.current ? '💧' : '🫗'}
                        </div>
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
                        <button className="btn btn-outline-secondary w-100 text-start p-2">
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
    </div>
  );
}
