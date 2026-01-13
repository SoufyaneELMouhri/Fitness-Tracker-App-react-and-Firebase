import React, { useEffect } from 'react';
import { UseAuth } from '../../Hooks/UseAuth';
import { useProgress } from '../../Hooks/UseProgress';
import { useNavigate } from 'react-router-dom';

export default function HomeUser() {
  const { currentUser } = UseAuth();
  const navigate = useNavigate();
  
  const {
    workoutSessions,
    workoutStats,
    workoutStreak,
    weightStats,
    activeGoals,
    loading,
    loadAllProgressData,
    getGoalProgress
  } = useProgress();

  useEffect(() => {
    if (currentUser) {
      loadAllProgressData();
    }
  }, [currentUser, loadAllProgressData]);

  // Calculate this week's workouts
  const getThisWeekWorkouts = () => {
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    weekStart.setHours(0, 0, 0, 0);
    
    return workoutSessions.filter(workout => {
      const workoutDate = new Date(workout.date);
      return workoutDate >= weekStart;
    }).length;
  };

  // Get recent 3 workouts
  const recentWorkouts = workoutSessions.slice(0, 3).map(workout => {
    const workoutDate = new Date(workout.date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    
    let dateLabel = 'Today';
    if (workout.date === today.toISOString().split('T')[0]) {
      dateLabel = 'Today';
    } else if (workout.date === yesterday.toISOString().split('T')[0]) {
      dateLabel = 'Yesterday';
    } else {
      const daysAgo = Math.floor((today - workoutDate) / (1000 * 60 * 60 * 24));
      dateLabel = `${daysAgo} days ago`;
    }
    
    return {
      id: workout.id,
      name: workout.workoutName || workout.name || 'Workout',
      duration: `${workout.duration || 0} min`,
      calories: workout.caloriesBurned || 0,
      date: dateLabel
    };
  });

  // Stats for cards
  const stats = [
    { 
      id: 1, 
      label: 'Workouts This Week', 
      value: getThisWeekWorkouts().toString(), 
      icon: '🏋️', 
      bg: 'primary' 
    },
    { 
      id: 2, 
      label: 'Calories Burned', 
      value: workoutStats.totalCalories.toLocaleString(), 
      icon: '🔥', 
      bg: 'warning' 
    },
    { 
      id: 3, 
      label: 'Active Minutes', 
      value: workoutStats.totalDuration.toString(), 
      icon: '⏱️', 
      bg: 'success' 
    },
    { 
      id: 4, 
      label: 'Current Streak', 
      value: `${workoutStreak.currentStreak}`, 
      icon: '🔥', 
      bg: 'danger' 
    }
  ];

  // Format goals
  const upcomingGoals = activeGoals.slice(0, 3).map(goal => ({
    id: goal.id,
    goal: `${goal.goalType?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Goal'} - ${goal.targetValue}${goal.unit || ''}`,
    progress: getGoalProgress(goal)
  }));

  if (upcomingGoals.length === 0) {
    upcomingGoals.push(
      { id: 1, goal: 'Set your first fitness goal', progress: 0 }
    );
  }

  // Loading state
  if (loading && workoutSessions.length === 0) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-light p-4">
      <div className="container-fluid">
        {/* Header */}
        <div className="mb-4">
          <h1 className="h2 fw-bold">
            Welcome back, {currentUser?.display_name || currentUser?.email?.split('@')[0] || 'User'}! 💪
          </h1>
          <p className="text-muted">Here's your fitness overview for today</p>
        </div>

        {/* Stats Grid */}
        <div className="row g-3 mb-4">
          {stats.map((stat) => (
            <div key={stat.id} className="col-12 col-md-6 col-lg-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <p className="text-muted small mb-1">{stat.label}</p>
                      <h3 className="h2 mb-0">{stat.value}</h3>
                    </div>
                    <div className={`bg-${stat.bg} bg-opacity-10 rounded p-3`}>
                      <span style={{fontSize: '2rem'}}>{stat.icon}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="row g-4 mb-4">
          {/* Recent Workouts */}
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h2 className="h4 mb-0">Recent Workouts</h2>
                  <button 
                    onClick={() => navigate('/app/progress')} 
                    className="btn btn-link btn-sm text-decoration-none"
                  >
                    View All →
                  </button>
                </div>
                
                {recentWorkouts.length > 0 ? (
                  <div className="vstack gap-3">
                    {recentWorkouts.map((workout) => (
                      <div key={workout.id} className="d-flex justify-content-between align-items-center bg-light rounded p-3">
                        <div className="d-flex align-items-center gap-3">
                          <div className="bg-primary bg-opacity-10 rounded p-2">
                            <span style={{fontSize: '2rem'}}>💪</span>
                          </div>
                          <div>
                            <h5 className="mb-0">{workout.name}</h5>
                            <small className="text-muted">{workout.date}</small>
                          </div>
                        </div>
                        <div className="text-end">
                          <div className="fw-bold">{workout.duration}</div>
                          <small className="text-warning">{workout.calories} cal</small>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-5">
                    <div style={{fontSize: '4rem'}} className="mb-3">🏋️</div>
                    <p className="text-muted mb-3">No workouts yet. Start your first workout!</p>
                    <button 
                      onClick={() => navigate('/app/workouts')} 
                      className="btn btn-primary"
                    >
                      Browse Workouts
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Goals Section */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <h2 className="h4 mb-4">Your Goals</h2>
                
                <div className="vstack gap-3 mb-4">
                  {upcomingGoals.map((item) => (
                    <div key={item.id}>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <small className="fw-medium">{item.goal}</small>
                        <span className="badge bg-primary">{item.progress}%</span>
                      </div>
                      <div className="progress" style={{height: '6px'}}>
                        <div 
                          className="progress-bar bg-primary" 
                          role="progressbar" 
                          style={{width: `${item.progress}%`}}
                          aria-valuenow={item.progress} 
                          aria-valuemin="0" 
                          aria-valuemax="100"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => navigate('/app/progress')} 
                  className="btn btn-primary w-100"
                >
                  {activeGoals.length > 0 ? 'Manage Goals' : 'Add New Goal'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <div 
              className="card border-0 text-white bg-success shadow-sm" 
              role="button"
              onClick={() => navigate('/app/workouts')}
            >
              <div className="card-body text-center py-4">
                <div style={{fontSize: '3rem'}} className="mb-3">🏃</div>
                <h5 className="card-title">Start Workout</h5>
                <p className="card-text small opacity-75">Begin your training session</p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div 
              className="card border-0 text-white bg-warning shadow-sm" 
              role="button"
              onClick={() => navigate('/app/nutrition')}
            >
              <div className="card-body text-center py-4">
                <div style={{fontSize: '3rem'}} className="mb-3">🍎</div>
                <h5 className="card-title">Track Nutrition</h5>
                <p className="card-text small opacity-75">Log your meals & calories</p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div 
              className="card border-0 text-white bg-info shadow-sm" 
              role="button"
              onClick={() => navigate('/app/progress')}
            >
              <div className="card-body text-center py-4">
                <div style={{fontSize: '3rem'}} className="mb-3">📊</div>
                <h5 className="card-title">View Progress</h5>
                <p className="card-text small opacity-75">Check your achievements</p>
              </div>
            </div>
          </div>
        </div>

        {/* Weight Progress */}
        {weightStats.currentWeight > 0 && (
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-4">Weight Progress</h5>
              <div className="row g-3 text-center">
                <div className="col-6 col-md-3">
                  <small className="text-muted d-block mb-1">Current Weight</small>
                  <h4 className="mb-0">{weightStats.currentWeight} kg</h4>
                </div>
                <div className="col-6 col-md-3">
                  <small className="text-muted d-block mb-1">Change</small>
                  <h4 className={`mb-0 ${parseFloat(weightStats.change) < 0 ? 'text-success' : 'text-danger'}`}>
                    {weightStats.change > 0 ? '+' : ''}{weightStats.change} kg
                  </h4>
                </div>
                <div className="col-6 col-md-3">
                  <small className="text-muted d-block mb-1">Progress</small>
                  <h4 className="mb-0">{weightStats.percentage}%</h4>
                </div>
                <div className="col-6 col-md-3">
                  <small className="text-muted d-block mb-1">Streak</small>
                  <h4 className="mb-0">{workoutStreak.currentStreak} 🔥</h4>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
