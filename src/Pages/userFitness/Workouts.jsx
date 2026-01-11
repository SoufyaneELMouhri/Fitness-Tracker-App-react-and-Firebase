import React, { useState } from 'react';
import { useWorkouts } from '../../Hooks/useWorkout';
import CardWorkout from '../../Components/componentUsers/Workout/CardWorkout';
import CreateWorkout from '../../Components/componentUsers/Workout/CreateWorkout'; 
import { Link } from 'react-router-dom';
import { X } from 'react-bootstrap-icons';

export default function Workouts() {
  const { workouts, stats, loading, deleteWorkout, updateWorkout, startWorkout } = useWorkouts();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFavorites, setShowFavorites] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const workoutCategories = [
    { id: 'strength', name: 'Strength', icon: '💪', color: 'from-purple-500 to-pink-500' },
    { id: 'cardio', name: 'Cardio', icon: '🏃', color: 'from-orange-500 to-red-500' },
    { id: 'yoga', name: 'Yoga', icon: '🧘', color: 'from-emerald-500 to-teal-500' },
    { id: 'hiit', name: 'HIIT', icon: '⚡', color: 'from-yellow-500 to-orange-500' },
    { id: 'core', name: 'Core', icon: '🎯', color: 'from-blue-500 to-indigo-500' },
    { id: 'flexibility', name: 'Flexibility', icon: '🤸', color: 'from-green-500 to-blue-500' }
  ];

  const handleWorkoutSelect = (workout) => {
    window.location.href = `/workouts/${workout.id}`;
  };

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
      <div className="min-vh-100 bg-gradient-to-br from-blue-50 to-indigo-100 d-flex align-items-center justify-content-center">
        <div className="spinner-border text-primary" role="status" style={{ width: '4rem', height: '4rem' }}>
          <span className="visually-hidden">Loading workouts...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-vh-100 bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
        <div className="container">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="display-4 fw-black mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 bg-clip-text text-transparent animate-pulse">
              💪 Workouts
            </h1>
            <div className="d-flex flex-column flex-md-row justify-content-center align-items-center gap-4 mb-4">
              <div className="text-center">
                <div className="h2 fw-bold text-gray-800 mb-1">{workouts.length}</div>
                <small className="text-muted">Total Sessions</small>
              </div>
              <div className="vr d-none d-md-block" style={{height: '40px'}}></div>
              <div className="text-center">
                <div className="h2 fw-bold text-orange-500 mb-1">{stats?.totalCalories?.toLocaleString() || 0}</div>
                <small className="text-muted">Calories Burned</small>
              </div>
            </div>
            <button 
              className="btn btn-lg btn-success shadow-lg px-6 py-3 fw-bold fs-5"
              onClick={handleStartWorkout}
            >
              <span className="fs-4 me-3">+</span>
              Start New Workout
            </button>
          </div>

          {/* Stats Cards */}
          {stats && (
            <div className="row g-4 mb-10">
              <div className="col-lg-3 col-md-6">
                <div className="card border-0 shadow-xl h-100 text-center p-6 bg-gradient-to-br from-emerald-50 to-teal-50 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                  <div className="display-6 mb-3">📊</div>
                  <h3 className="h3 fw-black mb-2">{stats.totalWorkouts}</h3>
                  <p className="text-muted mb-0 fw-semibold">Total Workouts</p>
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="card border-0 shadow-xl h-100 text-center p-6 bg-gradient-to-br from-orange-50 to-red-50 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                  <div className="display-6 mb-3 text-orange-500">🔥</div>
                  <h3 className="h3 fw-black mb-2">{stats.totalCalories?.toLocaleString()}</h3>
                  <p className="text-muted mb-0 fw-semibold">Calories Burned</p>
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="card border-0 shadow-xl h-100 text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                  <div className="display-6 mb-3">⭐</div>
                  <h3 className="h3 fw-black mb-2">{stats.avgRating?.toFixed(1) || '0.0'}</h3>
                  <p className="text-muted mb-0 fw-semibold">Avg Rating</p>
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="card border-0 shadow-xl h-100 text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                  <div className="display-6 mb-3">🎯</div>
                  <h3 className="h3 fw-black mb-2">{stats.longestStreak}</h3>
                  <p className="text-muted mb-0 fw-semibold">Streak</p>
                </div>
              </div>
            </div>
          )}

          {/* Categories */}
          <div className="mb-10">
            <h2 className="h3 fw-bold mb-6 text-center text-gray-800">Filter by Category</h2>
            <div className="row g-3 justify-content-center">
              <div className="col-auto">
                <div 
                  className={`card shadow-lg border-0 p-4 rounded-3xl cursor-pointer transition-all duration-300 ${
                    selectedCategory === 'all' 
                      ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-2xl scale-105' 
                      : 'bg-white hover:shadow-xl hover:-translate-y-1 hover:bg-blue-50'
                  }`}
                  onClick={() => setSelectedCategory('all')}
                >
                  <div className="fs-1 mb-2">🌟</div>
                  <h6 className="fw-bold mb-0">All</h6>
                </div>
              </div>
              {workoutCategories.map((category) => (
                <div key={category.id} className="col-auto">
                  <div 
                    className={`card shadow-lg border-0 p-4 rounded-3xl cursor-pointer transition-all duration-300 ${
                      selectedCategory === category.id
                        ? `bg-gradient-to-br ${category.color} text-white shadow-2xl scale-105`
                        : 'bg-white hover:shadow-xl hover:-translate-y-1 hover:bg-gradient-to-br hover:from-gray-50'
                    }`}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <div className="fs-2 mb-2">{category.icon}</div>
                    <h6 className="fw-bold mb-0 small">{category.name}</h6>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Toggle Favorites */}
          <div className="mb-6">
            <div className="btn-group btn-group-lg w-100 w-md-auto mx-auto d-table" role="group">
              <button 
                type="button" 
                className={`btn rounded-start-pill fw-bold fs-6 px-6 py-3 shadow-lg ${
                  !showFavorites ? 'btn-primary shadow-primary-lg' : 'btn-outline-primary'
                }`}
                onClick={() => setShowFavorites(false)}
              >
                All Workouts
              </button>
              <button 
                type="button" 
                className={`btn rounded-end-pill fw-bold fs-6 px-6 py-3 shadow-lg ${
                  showFavorites ? 'btn-danger shadow-danger-lg' : 'btn-outline-danger'
                }`}
                onClick={() => setShowFavorites(true)}
              >
                ❤️ Favorites ({workouts.filter(w => w.favorite).length})
              </button>
            </div>
          </div>

          {/* Workouts Grid */}
          <div className="row g-5">
            {filteredWorkouts.length > 0 ? (
              filteredWorkouts.map((workout) => (
                <div key={workout.id} className="col-xl-4 col-lg-6 col-md-6">
                  <CardWorkout
                    workout={{
                      ...workout,
                      type: workout.type || workout.workoutType || 'strength'
                    }}
                    onSelect={handleWorkoutSelect}
                    onToggleFavorite={handleToggleFavorite}
                  />
                </div>
              ))
            ) : (
              <div className="col-12 text-center py-12">
                <div className="display-1 mb-5 opacity-25">🏋️‍♂️</div>
                <h2 className="h2 fw-bold text-muted mb-4">
                  {showFavorites ? 'No Favorites Yet' : 'No Workouts Found'}
                </h2>
                <p className="lead text-muted mb-6">
                  {showFavorites 
                    ? 'Mark your best sessions as favorites to see them here'
                    : `No ${selectedCategory === 'all' ? 'workouts' : selectedCategory} workouts yet`
                  }
                </p>
                <button 
                  className="btn btn-lg btn-success shadow-lg px-8 py-4 fw-bold fs-5"
                  onClick={handleStartWorkout}
                >
                  <span className="fs-3 me-3">+</span>
                  Create First Workout
                </button>
              </div>
            )}
          </div>

          {/* CTA Bottom */}
          <div className="text-center mt-12 pt-10 border-t border-gray-200">
            <div className="card border-0 shadow-2xl mx-auto" style={{maxWidth: '500px'}}>
              <div className="card-body text-center p-8">
                <h3 className="h4 fw-bold mb-3 text-gray-800">Ready for More?</h3>
                <p className="text-muted mb-5">Create a custom workout routine tailored to your goals</p>
                <button 
                  className="btn btn-success btn-lg shadow-xl px-8 py-4 fw-bold fs-5"
                  onClick={handleStartWorkout}
                >
                  <span className="fs-3 me-3">+</span>
                  Create Workout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Workout Modal */}
      {showCreateModal && (
        <>
          {/* Backdrop */}
          <div 
            className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-75 d-flex align-items-center justify-content-center z-1050 p-4"
            onClick={handleCloseModal}
          >
            {/* Modal Content */}
            <div 
              className="bg-white rounded-4 shadow-5xl border-0 max-w-6xl max-h-[95vh] overflow-hidden position-relative animate__animated animate__zoomIn"
              style={{ maxWidth: '1400px', width: '95%' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-emerald-600 to-green-600 text-white p-6 position-relative">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <h2 className="h3 fw-bold mb-1">🏋️‍♂️ New Workout</h2>
                    <p className="mb-0 opacity-90">Log your training session details</p>
                  </div>
                  <button 
                    className="btn btn-sm btn-outline-light border-0 p-2 rounded-circle shadow-none hover:bg-white hover:bg-opacity-20 transition-all"
                    onClick={handleCloseModal}
                  >
                    <X className="fs-4" />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="p-0" style={{ height: '70vh', overflowY: 'auto' }}>
                <CreateWorkout />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
