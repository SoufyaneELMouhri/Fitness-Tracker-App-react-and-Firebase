import React, { useState } from 'react';
import { useWorkouts } from '../../Hooks/useWorkout';
import CardWorkout from '../../Components/componentUsers/Workout/CardWorkout';
import CreateWorkout from '../../Components/componentUsers/Workout/CreateWorkout'; 
import { X } from 'react-bootstrap-icons';

export default function Workouts() {
  const { workouts, stats, loading, updateWorkout } = useWorkouts();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFavorites, setShowFavorites] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const workoutCategories = [
    { id: 'strength', name: 'Strength', icon: '💪' },
    { id: 'cardio', name: 'Cardio', icon: '🏃' },
    { id: 'yoga', name: 'Yoga', icon: '🧘' },
    { id: 'hiit', name: 'HIIT', icon: '⚡' },
    { id: 'core', name: 'Core', icon: '🎯' },
    { id: 'flexibility', name: 'Flexibility', icon: '🤸' }
  ];

  const handleToggleFavorite = (workoutId) => {
    const workout = workouts.find(w => w.id === workoutId);
    updateWorkout(workoutId, { favorite: !workout.favorite });
  };

  const handleStartWorkout = () => {
    setShowCreateModal(true);
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
  };

  const filteredWorkouts = workouts.filter(workout => {
    if (showFavorites && !workout.favorite) return false;
    if (selectedCategory !== 'all' && workout.type !== selectedCategory) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center p-4">
        <div className="spinner-border text-primary" style={{ width: '4rem', height: '4rem' }} role="status">
          <span className="visually-hidden">Loading workouts...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-vh-100 bg-light p-4">
        <div className="container">
          <div className="text-center mb-5">
            <h1 className="display-4 fw-bold mb-4 text-primary">💪 Workouts</h1>
            <div className="d-flex flex-column flex-md-row justify-content-center align-items-center gap-4 mb-4">
              <div className="text-center">
                <div className="h2 fw-bold text-dark mb-1">{workouts.length}</div>
                <small className="text-muted">Total Sessions</small>
              </div>
              <div className="vr d-none d-md-block" style={{height: '40px'}} />
              <div className="text-center">
                <div className="h2 fw-bold text-warning mb-1">{stats?.totalCalories?.toLocaleString() || 0}</div>
                <small className="text-muted">Calories Burned</small>
              </div>
            </div>
            <button 
              className="btn btn-lg btn-success shadow px-5 py-3 fw-bold"
              onClick={handleStartWorkout}
            >
              <span className="fs-4 me-2">+</span>
              Start New Workout
            </button>
          </div>

          {stats && (
            <div className="row g-4 mb-5">
              <div className="col-lg-3 col-md-6">
                <div className="card border-0 shadow h-100 text-center p-4 bg-success-subtle">
                  <div className="display-4 mb-3">📊</div>
                  <h4 className="fw-bold mb-2">{stats.totalWorkouts}</h4>
                  <p className="text-muted mb-0">Total Workouts</p>
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="card border-0 shadow h-100 text-center p-4 bg-warning-subtle">
                  <div className="display-4 mb-3 text-warning">🔥</div>
                  <h4 className="fw-bold mb-2">{stats.totalCalories?.toLocaleString()}</h4>
                  <p className="text-muted mb-0">Calories Burned</p>
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="card border-0 shadow h-100 text-center p-4 bg-primary-subtle">
                  <div className="display-4 mb-3">⭐</div>
                  <h4 className="fw-bold mb-2">{stats.avgRating?.toFixed(1) || '0.0'}</h4>
                  <p className="text-muted mb-0">Avg Rating</p>
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="card border-0 shadow h-100 text-center p-4 bg-info-subtle">
                  <div className="display-4 mb-3">🎯</div>
                  <h4 className="fw-bold mb-2">{stats.longestStreak}</h4>
                  <p className="text-muted mb-0">Streak</p>
                </div>
              </div>
            </div>
          )}

          <div className="mb-4 text-center">
            <h3 className="h5 fw-bold mb-3">Filter by Category</h3>
            <div className="d-flex flex-wrap justify-content-center gap-2 mb-4">
              <button 
                className={`btn ${selectedCategory === 'all' ? 'btn-primary' : 'btn-outline-primary'} px-3 py-2`}
                onClick={() => setSelectedCategory('all')}
              >
                🌟 All
              </button>
              {workoutCategories.map((category) => (
                <button 
                  key={category.id}
                  className={`btn ${selectedCategory === category.id ? 'btn-primary' : 'btn-outline-primary'} px-3 py-2`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.icon} {category.name}
                </button>
              ))}
            </div>
            
            <div className="btn-group" role="group">
              <button 
                className={`btn ${!showFavorites ? 'btn-primary' : 'btn-outline-primary'} px-4 py-2`}
                onClick={() => setShowFavorites(false)}
              >
                All Workouts
              </button>
              <button 
                className={`btn ${showFavorites ? 'btn-danger' : 'btn-outline-danger'} px-4 py-2`}
                onClick={() => setShowFavorites(true)}
              >
                ❤️ Favorites ({workouts.filter(w => w.favorite).length})
              </button>
            </div>
          </div>

          <div className="row g-4">
            {filteredWorkouts.length > 0 ? (
              filteredWorkouts.map((workout) => (
                <div key={workout.id} className="col-xl-4 col-lg-6 col-md-6">
                  <CardWorkout
                    workout={workout}
                    onToggleFavorite={handleToggleFavorite}
                  />
                </div>
              ))
            ) : (
              <div className="col-12 text-center py-5">
                <div className="display-1 mb-4 opacity-25">🏋️‍♂️</div>
                <h3 className="fw-bold text-muted mb-3">
                  {showFavorites ? 'No Favorites Yet' : 'No Workouts Found'}
                </h3>
                <p className="text-muted mb-4">
                  {showFavorites 
                    ? 'Mark your best sessions as favorites'
                    : `No ${selectedCategory === 'all' ? 'workouts' : selectedCategory} workouts yet`
                  }
                </p>
                <button 
                  className="btn btn-lg btn-success px-5 py-3"
                  onClick={handleStartWorkout}
                >
                  <span className="fs-3 me-2">+</span>
                  Create First Workout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showCreateModal && (
        <div 
          className="modal fade show d-block" 
          tabIndex="-1" 
          style={{backgroundColor: 'rgba(0,0,0,0.5)'}}
        >
          <div className="modal-dialog modal-xl modal-dialog-centered">
            <div className="modal-content border-0 shadow rounded-4">
              <div className="modal-header bg-success text-white border-0 p-4">
                <div>
                  <h4 className="fw-bold mb-1">🏋️‍♂️ New Workout</h4>
                  <p className="mb-0 small">Log your training session</p>
                </div>
                <button 
                  className="btn-close btn-close-white" 
                  onClick={handleCloseModal}
                />
              </div>
              <div className="modal-body p-0" style={{maxHeight: '70vh', overflowY: 'auto'}}>
                <CreateWorkout onClose={handleCloseModal} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
