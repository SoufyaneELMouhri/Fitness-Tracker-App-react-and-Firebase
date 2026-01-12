import React from 'react';
import { useWorkouts } from '../../../Hooks/useWorkout';
import { Link } from 'react-router-dom';
import { HeartFill, Heart, Clock, Fire, ChevronRight } from 'react-bootstrap-icons';

export default function CardWorkout({ workout, onSelect, onToggleFavorite }) {
  const { updateWorkout } = useWorkouts();
  
  const handleFavoriteToggle = async () => {
    await updateWorkout(workout.id, { favorite: !workout.favorite });
    if (onToggleFavorite) onToggleFavorite(workout.id);
  };

  const getTypeIcon = (type) => {
    const icons = { strength: '💪', cardio: '🏃', hiit: '⚡', yoga: '🧘', core: '🎯' };
    return icons[type] || '⚽';
  };

  const formatDuration = (duration) => {
    if (!duration) return '';
    const mins = Math.floor(duration);
    return `${mins}m`;
  };

  return (
    <div className="card border-0 shadow-sm rounded-3 p-4 h-100">
      <div className="d-flex justify-content-between align-items-start mb-3">
        <span className="badge bg-primary fs-6 px-3 py-2">
          {getTypeIcon(workout.type)} {workout.type}
        </span>
        
        <button 
          className="btn btn-sm p-2" 
          onClick={handleFavoriteToggle}
        >
          {workout.favorite ? (
            <HeartFill className="text-danger fs-4" />
          ) : (
            <Heart className="text-muted fs-4" />
          )}
        </button>
      </div>

      <h5 className="fw-bold mb-3 lh-sm">{workout.name}</h5>
      
      <div className="row g-2 mb-3 text-center">
        <div className="col">
          <Clock className="mb-1" />
          <div className="small fw-bold">{formatDuration(workout.duration)}</div>
          <small className="text-muted">Duration</small>
        </div>
        {workout.caloriesBurned && (
          <div className="col">
            <Fire className="mb-1 text-warning" />
            <div className="small fw-bold">{workout.caloriesBurned}</div>
            <small className="text-muted">Calories</small>
          </div>
        )}
        <div className="col">
          <div className="small fw-bold">{workout.exercises?.length || 0}</div>
          <small className="text-muted">Exercises</small>
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center mt-auto">
        <small className="text-muted">
          {new Date(workout.workoutDate).toLocaleDateString()}
        </small>
        <Link to={`/app/workouts/${workout.id}`} className="btn btn-outline-primary btn-sm px-3">
          View <ChevronRight className="ms-1" />
        </Link>
      </div>
    </div>
  );
}
