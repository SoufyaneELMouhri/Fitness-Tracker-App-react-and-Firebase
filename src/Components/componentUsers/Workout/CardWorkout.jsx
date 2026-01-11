import React from 'react';
import { useWorkouts } from '../../../Hooks/useWorkout'; // Adjust path
import { Link } from 'react-router-dom';
import { 
  Fire, 
  HeartFill, 
  Heart, 
  Clock, 
  StarFill, 
  Star,
  ChevronRight 
} from 'react-bootstrap-icons';

export default function CardWorkout({ workout, onSelect, isFavorite = false, onToggleFavorite }) {
  const { updateWorkout, deleteWorkout } = useWorkouts();
  
  const handleFavoriteToggle = async () => {
    try {
      await updateWorkout(workout.id, { 
        favorite: !workout.favorite 
      });
      if (onToggleFavorite) onToggleFavorite(workout.id);
    } catch (error) {
      console.error('Failed to toggle favorite',error);
    }
  };

  const handleDelete = async () => {
    if (confirm('Delete this workout?')) {
      await deleteWorkout(workout.id);
    }
  };

  const getTypeIcon = (type) => {
    const icons = {
      strength: '💪',
      cardio: '🏃',
      hiit: '⚡',
      yoga: '🧘',
      core: '🎯'
    };
    return icons[type] || '⚽';
  };

  const formatDuration = (duration) => {
    if (!duration) return '';
    const hours = Math.floor(duration / 60);
    const mins = duration % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="group relative bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl hover:shadow-2xl border border-white/50 hover:border-blue-200/50 overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] max-w-sm mx-auto">
      
      {/* Badge */}
      <div className={`absolute top-4 left-4 z-10 px-4 py-2 rounded-full text-xs font-bold text-white shadow-lg ${
        workout.favorite 
          ? 'bg-gradient-to-r from-yellow-400 to-orange-500' 
          : 'bg-gradient-to-r from-blue-500 to-indigo-600'
      }`}>
        {getTypeIcon(workout.type)} {workout.type?.charAt(0).toUpperCase() + workout.type?.slice(1)}
      </div>

      {/* Favorite Button */}
      <button
        onClick={handleFavoriteToggle}
        className="absolute top-4 right-4 z-10 p-3 rounded-2xl bg-white/90 hover:bg-white shadow-lg transition-all duration-300 hover:scale-110"
      >
        {workout.favorite ? (
          <HeartFill className="w-6 h-6 text-red-500" />
        ) : (
          <Heart className="w-6 h-6 text-gray-400 group-hover:text-red-400" />
        )}
      </button>

      {/* Delete Button */}
      <button
        onClick={handleDelete}
        className="absolute top-4 right-20 z-10 p-2 rounded-xl bg-red-100 hover:bg-red-200 text-red-600 hover:text-red-700 transition-all duration-300 opacity-0 group-hover:opacity-100"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>

      {/* Content */}
      <div className="p-8 relative h-64 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-2xl font-black bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2 line-clamp-2">
              {workout.name}
            </h3>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span className="flex items-center">
                <Clock className="mr-1 w-4 h-4" />
                {formatDuration(workout.duration)}
              </span>
              {workout.caloriesBurned && (
                <span className="flex items-center">
                  <Fire className="mr-1 w-4 h-4 text-red-500" />
                  {workout.caloriesBurned.toLocaleString()}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Rating */}
        {workout.rating > 0 && (
          <div className="flex items-center mb-6">
            {[1,2,3,4,5].map((star) => (
              star <= Math.floor(workout.rating) ? (
                <StarFill key={star} className="w-6 h-6 text-yellow-400 fill-current" />
              ) : (
                <Star key={star} className="w-6 h-6 text-yellow-200" />
              )
            ))}
            <span className="ml-2 text-lg font-semibold text-gray-700">
              {workout.rating}/5
            </span>
          </div>
        )}

        {/* Stats */}
        <div className="flex-1 grid grid-cols-2 gap-4 mb-8">
          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl">
            <div className="text-2xl font-bold text-blue-600">{workout.exercises?.length || 0}</div>
            <div className="text-xs text-gray-600 uppercase tracking-wide">Exercises</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-teal-100 rounded-2xl">
            <div className="text-2xl font-bold text-emerald-600">
              {workout.exercises?.reduce((sum, ex) => sum + (parseInt(ex.sets) || 0), 0) || 0}
            </div>
            <div className="text-xs text-gray-600 uppercase tracking-wide">Total Sets</div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="text-xs text-gray-500">
            {new Date(workout.workoutDate?.seconds 
              ? workout.workoutDate.toDate() 
              : workout.workoutDate
            ).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric' 
            })}
          </div>
          <Link
            to={`/workouts/${workout.id}`}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-semibold group-hover:translate-x-2 transition-all duration-300"
          >
            <span>View Details</span>
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Overlay for click */}
      {onSelect && (
        <div 
          className="absolute inset-0 z-0 bg-gradient-to-t from-black/0 via-black/0 to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          onClick={() => onSelect(workout)}
        />
      )}
    </div>
  );
}
