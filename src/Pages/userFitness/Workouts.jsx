import React, { useState } from 'react';
import { useWorkouts } from '../../Hooks/useWorkout';
// import { UseAuth } from '../../Hooks/UseAuth';

export default function Workouts() {
  const { workouts, stats, loading, deleteWorkout, updateWorkout, startWorkout } = useWorkouts();
  // const { currentUser } = UseAuth();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFavorites, setShowFavorites] = useState(false);

  const workoutCategories = [
    { id: 'strength', name: 'Strength', icon: '💪', color: 'danger' },
    { id: 'cardio', name: 'Cardio', icon: '🏃', color: 'warning' },
    { id: 'yoga', name: 'Yoga', icon: '🧘', color: 'info' },
    { id: 'hiit', name: 'HIIT', icon: '⚡', color: 'danger' },
    { id: 'core', name: 'Core', icon: '🎯', color: 'primary' },
    { id: 'flexibility', name: 'Flexibility', icon: '🤸', color: 'success' }
  ];

  const getDifficultyBadge = (difficulty) => {
    const badges = {
      'beginner': 'success',
      'intermediate': 'warning',
      'advanced': 'danger'
    };
    return badges[difficulty?.toLowerCase()] || 'secondary';
  };

  const getWorkoutEmoji = (type) => {
    const emojis = {
      strength: '🏋️',
      cardio: '🏃',
      yoga: '🧘',
      hiit: '⚡',
      core: '💥',
      flexibility: '🤸'
    };
    return emojis[type?.toLowerCase()] || '💪';
  };

  const handleDeleteWorkout = async (workoutId) => {
    if (window.confirm('Are you sure you want to delete this workout?')) {
      try {
        await deleteWorkout(workoutId);
      } catch (error) {
        alert('Failed to delete workout',error);
      }
    }
  };

  const handleToggleFavorite = async (workoutId, currentFavorite) => {
    try {
      await updateWorkout(workoutId, { favorite: !currentFavorite });
    } catch (error) {
      alert('Failed to update workout',error);
    }
  };

  const filteredWorkouts = workouts.filter(workout => {
    if (showFavorites && !workout.favorite) return false;
    if (selectedCategory !== 'all' && workout.workoutType !== selectedCategory) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center">
        <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-light p-2 p-md-4">
      <div className="container-fluid">
        
        <div className="mb-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
            <div>
              <h1 className="display-6 display-md-5 fw-bold text-dark mb-1">Workouts 🏋️</h1>
              <p className="text-muted mb-0">
                {workouts.length} workouts • {stats?.totalCalories || 0} calories burned
              </p>
            </div>
            <button 
              className="btn btn-success fw-bold px-4 py-2"
              onClick={() => startWorkout()}
            >
              <span className="fs-5 me-2">+</span>
              New Workout
            </button>
          </div>
        </div>

        {stats && (
          <div className="row g-3 mb-4">
            <div className="col-6 col-lg-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body text-center p-3">
                  <div className="text-success mb-2">📊</div>
                  <h3 className="h4 fw-bold mb-0">{stats.totalWorkouts}</h3>
                  <p className="small text-muted mb-0">Total Workouts</p>
                </div>
              </div>
            </div>
            <div className="col-6 col-lg-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body text-center p-3">
                  <div className="text-warning mb-2">🔥</div>
                  <h3 className="h4 fw-bold mb-0">{stats.totalCalories}</h3>
                  <p className="small text-muted mb-0">Calories Burned</p>
                </div>
              </div>
            </div>
            <div className="col-6 col-lg-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body text-center p-3">
                  <div className="text-primary mb-2">⭐</div>
                  <h3 className="h4 fw-bold mb-0">{stats.avgRating?.toFixed(1) || 0}</h3>
                  <p className="small text-muted mb-0">Avg Rating</p>
                </div>
              </div>
            </div>
            <div className="col-6 col-lg-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body text-center p-3">
                  <div className="text-info mb-2">🎯</div>
                  <h3 className="h4 fw-bold mb-0">{stats.longestStreak}</h3>
                  <p className="small text-muted mb-0">Day Streak</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mb-4">
          <h2 className="h5 fw-bold mb-3">Categories</h2>
          <div className="row g-2 g-md-3">
            <div className="col-4 col-md-3 col-lg-2">
              <div 
                className={`card h-100 border-0 shadow-sm text-center ${selectedCategory === 'all' ? 'border-primary' : ''}`}
                role="button"
                onClick={() => setSelectedCategory('all')}
              >
                <div className="card-body p-2 p-md-3">
                  <div className="bg-secondary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2" 
                       style={{width: '48px', height: '48px', fontSize: '1.5rem'}}>
                    🌟
                  </div>
                  <h3 className="h6 small fw-bold mb-0">All</h3>
                </div>
              </div>
            </div>
            {workoutCategories.map((category) => (
              <div key={category.id} className="col-4 col-md-3 col-lg-2">
                <div 
                  className={`card h-100 border-0 shadow-sm text-center ${selectedCategory === category.id ? 'border-primary' : ''}`}
                  role="button"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <div className="card-body p-2 p-md-3">
                    <div className={`bg-${category.color} bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2`} 
                         style={{width: '48px', height: '48px', fontSize: '1.5rem'}}>
                      {category.icon}
                    </div>
                    <h3 className="h6 small fw-bold mb-0">{category.name}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="h5 fw-bold mb-0">
              {showFavorites ? 'Favorite Workouts' : 'My Workouts'}
            </h2>
            <div className="btn-group btn-group-sm" role="group">
              <button 
                type="button" 
                className={`btn ${!showFavorites ? 'btn-primary' : 'btn-outline-secondary'}`}
                onClick={() => setShowFavorites(false)}
              >
                All
              </button>
              <button 
                type="button" 
                className={`btn ${showFavorites ? 'btn-primary' : 'btn-outline-secondary'}`}
                onClick={() => setShowFavorites(true)}
              >
                ❤️ Favorites
              </button>
            </div>
          </div>

          {filteredWorkouts.length > 0 ? (
            <div className="row g-3 g-md-4">
              {filteredWorkouts.map((workout) => (
                <div key={workout.id} className="col-12 col-md-6 col-lg-4">
                  <div className="card h-100 border-0 shadow-sm position-relative">
                    <div className="d-flex align-items-center justify-content-center" 
                         style={{height: '120px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', fontSize: '3rem'}}>
                      {getWorkoutEmoji(workout.workoutType)}
                    </div>

                    <div className="card-body p-3">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h3 className="h6 fw-bold mb-0">{workout.title || 'Workout Session'}</h3>
                        <button 
                          className="btn btn-link p-0 border-0 text-decoration-none"
                          onClick={() => handleToggleFavorite(workout.id, workout.favorite)}
                        >
                          {workout.favorite ? '❤️' : '🤍'}
                        </button>
                      </div>

                      <p className="small text-muted mb-3" style={{
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis', 
                        display: '-webkit-box', 
                        WebkitLineClamp: 2, 
                        WebkitBoxOrient: 'vertical'
                      }}>
                        {workout.notes || 'No description available'}
                      </p>

                      <div className="row g-2 mb-3">
                        <div className="col-6">
                          <div className="bg-light rounded p-2 text-center">
                            <p className="small text-muted mb-0">Duration</p>
                            <p className="fw-semibold mb-0 small">{workout.duration || 45} min</p>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="bg-light rounded p-2 text-center">
                            <p className="small text-muted mb-0">Calories</p>
                            <p className="fw-semibold text-warning mb-0 small">{workout.caloriesBurned || 0}</p>
                          </div>
                        </div>
                      </div>

                      <div className="d-flex gap-2 mb-3 flex-wrap">
                        {workout.difficulty && (
                          <span className={`badge bg-${getDifficultyBadge(workout.difficulty)}`}>
                            {workout.difficulty}
                          </span>
                        )}
                        {workout.exercises?.length > 0 && (
                          <span className="badge bg-primary bg-opacity-10 text-primary">
                            {workout.exercises.length} exercises
                          </span>
                        )}
                        {workout.rating && (
                          <span className="badge bg-warning bg-opacity-10 text-warning">
                            ⭐ {workout.rating}
                          </span>
                        )}
                      </div>

                      <div className="d-flex gap-2">
                        <button 
                          className="btn btn-sm btn-outline-danger flex-fill"
                          onClick={() => handleDeleteWorkout(workout.id)}
                        >
                          Delete
                        </button>
                        <button className="btn btn-sm btn-primary flex-fill">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-5">
              <div className="mb-3" style={{fontSize: '4rem'}}>🏋️</div>
              <h5 className="text-muted mb-2">No workouts found</h5>
              <p className="text-muted small mb-4">
                {showFavorites ? 'You haven\'t favorited any workouts yet' : 'Start your fitness journey today'}
              </p>
              <button 
                className="btn btn-primary"
                onClick={() => startWorkout()}
              >
                Create Your First Workout
              </button>
            </div>
          )}
        </div>

        <div className="card border-0 shadow-sm">
          <div className="card-body p-3 p-md-4">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
              <div>
                <h3 className="h6 fw-bold mb-1">Create Your Own Workout</h3>
                <p className="small text-muted mb-0">Design a custom routine tailored to your goals</p>
              </div>
              <button 
                className="btn btn-success fw-bold px-4"
                onClick={() => startWorkout()}
              >
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
