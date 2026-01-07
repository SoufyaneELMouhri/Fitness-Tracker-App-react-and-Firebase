import React from 'react';

export default function Workouts() {
  // Static workout data
  const workoutCategories = [
    { id: 1, name: 'Strength', icon: '💪', count: 45, color: 'danger' },
    { id: 2, name: 'Cardio', icon: '🏃', count: 32, color: 'warning' },
    { id: 3, name: 'Yoga', icon: '🧘', count: 28, color: 'purple' },
    { id: 4, name: 'HIIT', icon: '⚡', count: 24, color: 'warning' },
    { id: 5, name: 'Flexibility', icon: '🤸', count: 18, color: 'success' },
    { id: 6, name: 'Core', icon: '🎯', count: 22, color: 'primary' }
  ];

  const popularWorkouts = [
    {
      id: 1,
      title: 'Full Body Strength',
      category: 'Strength',
      duration: '45 min',
      difficulty: 'Intermediate',
      calories: 380,
      exercises: 8,
      image: '🏋️',
      description: 'Complete upper and lower body workout targeting all major muscle groups'
    },
    {
      id: 2,
      title: 'HIIT Cardio Blast',
      category: 'HIIT',
      duration: '30 min',
      difficulty: 'Advanced',
      calories: 420,
      exercises: 10,
      image: '🔥',
      description: 'High-intensity intervals to boost metabolism and burn maximum calories'
    },
    {
      id: 3,
      title: 'Morning Yoga Flow',
      category: 'Yoga',
      duration: '25 min',
      difficulty: 'Beginner',
      calories: 150,
      exercises: 12,
      image: '☀️',
      description: 'Gentle flow to energize your morning and improve flexibility'
    },
    {
      id: 4,
      title: 'Core Crusher',
      category: 'Core',
      duration: '20 min',
      difficulty: 'Intermediate',
      calories: 180,
      exercises: 6,
      image: '💥',
      description: 'Intense ab workout focusing on building a strong, defined core'
    },
    {
      id: 5,
      title: 'Upper Body Power',
      category: 'Strength',
      duration: '40 min',
      difficulty: 'Advanced',
      calories: 320,
      exercises: 7,
      image: '💪',
      description: 'Build strength in chest, back, shoulders, and arms'
    },
    {
      id: 6,
      title: 'Cardio Endurance',
      category: 'Cardio',
      duration: '35 min',
      difficulty: 'Intermediate',
      calories: 290,
      exercises: 5,
      image: '🏃',
      description: 'Improve cardiovascular fitness with steady-state cardio exercises'
    }
  ];

  const myWorkoutPlans = [
    {
      id: 1,
      name: '30-Day Transformation',
      progress: 65,
      daysCompleted: 19,
      totalDays: 30,
      nextWorkout: 'Leg Day'
    },
    {
      id: 2,
      name: 'Beginner Strength Program',
      progress: 40,
      daysCompleted: 12,
      totalDays: 30,
      nextWorkout: 'Upper Body'
    }
  ];

  const todaysPlan = {
    title: "Today's Recommended Workout",
    workout: 'Full Body Strength',
    duration: '45 min',
    exercises: [
      { name: 'Squats', sets: 3, reps: 12 },
      { name: 'Bench Press', sets: 3, reps: 10 },
      { name: 'Deadlifts', sets: 3, reps: 8 },
      { name: 'Shoulder Press', sets: 3, reps: 10 }
    ]
  };

  const getDifficultyBadge = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'success';
      case 'Intermediate': return 'warning';
      case 'Advanced': return 'danger';
      default: return 'secondary';
    }
  };

  return (
    <div className="min-vh-100 bg-light p-4">
      <div className="container-fluid">
        {/* Header */}
        <div className="mb-4">
          <h1 className="display-5 fw-bold text-dark">Workouts 🏋️</h1>
          <p className="text-muted">Browse and start your perfect workout</p>
        </div>

        {/* Today's Plan Banner */}
        <div className="card mb-4 border-0 shadow-sm" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
          <div className="card-body text-white p-4">
            <div className="d-flex justify-content-between align-items-center">
              <div className="flex-grow-1">
                <p className="small mb-1 opacity-75">{todaysPlan.title}</p>
                <h2 className="h3 fw-bold mb-2">{todaysPlan.workout}</h2>
                <div className="d-flex gap-3 small">
                  <span>⏱️ {todaysPlan.duration}</span>
                  <span>📋 {todaysPlan.exercises.length} exercises</span>
                </div>
              </div>
              <button className="btn btn-light btn-lg fw-bold text-primary px-4">
                Start Now
              </button>
            </div>
          </div>
        </div>

        {/* Workout Categories */}
        <div className="mb-4">
          <h2 className="h4 fw-bold mb-3">Categories</h2>
          <div className="row g-3">
            {workoutCategories.map((category) => (
              <div key={category.id} className="col-6 col-md-4 col-lg-2">
                <div className="card h-100 border-0 shadow-sm text-center" role="button">
                  <div className="card-body p-3">
                    <div className={`bg-${category.color} rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3`} 
                         style={{width: '64px', height: '64px', fontSize: '2rem'}}>
                      {category.icon}
                    </div>
                    <h3 className="h6 fw-bold mb-1">{category.name}</h3>
                    <p className="small text-muted mb-0">{category.count} workouts</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* My Workout Plans */}
        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="h4 fw-bold mb-0">My Programs</h2>
            <a href="#" className="text-primary text-decoration-none small fw-semibold">View All</a>
          </div>
          <div className="row g-3">
            {myWorkoutPlans.map((plan) => (
              <div key={plan.id} className="col-12 col-md-6">
                <div className="card border-0 shadow-sm">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h3 className="h6 fw-bold mb-0">{plan.name}</h3>
                      <span className="badge bg-primary">{plan.progress}%</span>
                    </div>
                    <div className="progress mb-3" style={{height: '8px'}}>
                      <div className="progress-bar" role="progressbar" 
                           style={{width: `${plan.progress}%`, background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)'}}
                           aria-valuenow={plan.progress} aria-valuemin="0" aria-valuemax="100">
                      </div>
                    </div>
                    <div className="d-flex justify-content-between small">
                      <span className="text-muted">{plan.daysCompleted} / {plan.totalDays} days completed</span>
                      <span className="fw-semibold">Next: {plan.nextWorkout}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Workouts */}
        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="h4 fw-bold mb-0">Popular Workouts</h2>
            <div className="btn-group" role="group">
              <button type="button" className="btn btn-primary btn-sm">All</button>
              <button type="button" className="btn btn-outline-secondary btn-sm">Favorites</button>
            </div>
          </div>

          <div className="row g-4">
            {popularWorkouts.map((workout) => (
              <div key={workout.id} className="col-12 col-md-6 col-lg-4">
                <div className="card h-100 border-0 shadow-sm" role="button">
                  {/* Card Header */}
                  <div className="d-flex align-items-center justify-content-center" 
                       style={{height: '128px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', fontSize: '4rem'}}>
                    {workout.image}
                  </div>

                  {/* Card Body */}
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h3 className="h5 fw-bold mb-0">{workout.title}</h3>
                      <button className="btn btn-link text-secondary p-0 border-0">
                        ❤️
                      </button>
                    </div>

                    <p className="small text-muted mb-3" style={{overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'}}>
                      {workout.description}
                    </p>

                    {/* Workout Info */}
                    <div className="row g-2 mb-3">
                      <div className="col-6">
                        <div className="bg-light rounded p-2 text-center">
                          <p className="small text-muted mb-0">Duration</p>
                          <p className="fw-semibold mb-0">{workout.duration}</p>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="bg-light rounded p-2 text-center">
                          <p className="small text-muted mb-0">Calories</p>
                          <p className="fw-semibold text-warning mb-0">{workout.calories}</p>
                        </div>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="d-flex gap-2 mb-3">
                      <span className={`badge bg-${getDifficultyBadge(workout.difficulty)}`}>
                        {workout.difficulty}
                      </span>
                      <span className="badge bg-primary bg-opacity-10 text-primary">
                        {workout.exercises} exercises
                      </span>
                    </div>

                    {/* Action Button */}
                    <button className="btn btn-primary w-100 fw-bold">
                      Start Workout
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Create Custom Workout */}
        <div className="card border-0 shadow-sm">
          <div className="card-body p-4">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h3 className="h5 fw-bold mb-1">Create Your Own Workout</h3>
                <p className="small text-muted mb-0">Design a custom routine tailored to your goals</p>
              </div>
              <button className="btn btn-success btn-lg fw-bold">
                <span className="fs-4 me-2">+</span>
                Create
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
