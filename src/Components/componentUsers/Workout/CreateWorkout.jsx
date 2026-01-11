import React, { useState, useEffect } from 'react';
import { useWorkouts } from '../../../Hooks/useWorkout'; // Adjust path from modal context
import { useNavigate } from 'react-router-dom';

export default function CreateWorkout({ onClose, afterSave }) {
  const navigate = useNavigate();
  const { logWorkout } = useWorkouts();
  
  const [formData, setFormData] = useState({
    name: '',
    type: 'strength',
    duration: '',
    caloriesBurned: '',
    rating: 0,
    notes: '',
    workoutDate: new Date().toISOString().split('T')[0],
    exercises: []
  });
  
  const [currentExercise, setCurrentExercise] = useState({
    name: '',
    sets: '',
    reps: '',
    weight: '',
    restTime: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const addExercise = () => {
    if (!currentExercise.name || !currentExercise.sets || !currentExercise.reps) {
      setError('Please fill exercise name, sets, and reps');
      return;
    }
    setFormData(prev => ({
      ...prev,
      exercises: [...prev.exercises, { 
        exerciseId: Date.now().toString(),
        ...currentExercise,
        completed: false
      }]
    }));
    setCurrentExercise({ name: '', sets: '', reps: '', weight: '', restTime: '' });
    setError('');
  };

  const removeExercise = (index) => {
    setFormData(prev => ({
      ...prev,
      exercises: prev.exercises.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.exercises.length === 0) {
      setError('Add at least one exercise');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await logWorkout(formData);
      
      // SUCCESS: Close modal + optional callback
      if (afterSave) {
        afterSave();
      } else if (onClose) {
        onClose();
      }
      
      // Optional: Show success message or redirect
      alert('✅ Workout saved successfully!');
      
    } catch (err) {
      setError(err.message || 'Failed to save workout');
      console.error('Workout save error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleExerciseChange = (e) => {
    const { name, value } = e.target;
    setCurrentExercise(prev => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    if (onClose) onClose();
  };

  return (
    <div className="p-6 p-md-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Quick Info Row */}
        <div className="row g-4 mb-6">
          <div className="col-md-6">
            <label className="form-label fw-bold fs-5 mb-3">🏷️ Workout Name</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="form-control form-control-lg rounded-3 shadow-sm border-2 border-light"
              placeholder="Chest Day Crusher"
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label fw-bold fs-5 mb-3">📅 Date</label>
            <input
              name="workoutDate"
              type="date"
              value={formData.workoutDate}
              onChange={handleInputChange}
              className="form-control form-control-lg rounded-3 shadow-sm border-2 border-light"
              required
            />
          </div>
        </div>

        {/* Type & Metrics */}
        <div className="row g-4">
          <div className="col-md-4">
            <label className="form-label fw-bold fs-6 mb-3">🎯 Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="form-select form-select-lg rounded-3 shadow-sm border-2 border-light"
            >
              <option value="strength">💪 Strength</option>
              <option value="cardio">🏃 Cardio</option>
              <option value="hiit">⚡ HIIT</option>
              <option value="yoga">🧘 Yoga</option>
              <option value="core">🎯 Core</option>
              <option value="flexibility">🤸 Flexibility</option>
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label fw-bold fs-6 mb-3">⏱️ Duration (min)</label>
            <input
              name="duration"
              type="number"
              min="1"
              value={formData.duration}
              onChange={handleInputChange}
              className="form-control form-control-lg rounded-3 shadow-sm border-2 border-light"
              placeholder="45"
            />
          </div>
          <div className="col-md-4">
            <label className="form-label fw-bold fs-6 mb-3">🔥 Calories</label>
            <input
              name="caloriesBurned"
              type="number"
              min="0"
              value={formData.caloriesBurned}
              onChange={handleInputChange}
              className="form-control form-control-lg rounded-3 shadow-sm border-2 border-light"
              placeholder="350"
            />
          </div>
        </div>

        {/* Exercises Section */}
        <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
          <div className="card-header bg-gradient-to-r from-info to-primary text-white p-4">
            <h4 className="mb-0 fw-bold">
              💥 Exercises <span className="badge bg-light text-dark ms-2">{formData.exercises.length}</span>
            </h4>
          </div>
          <div className="card-body p-4">
            {/* Add Exercise Form */}
            <div className="row g-3 mb-5 p-4 bg-light rounded-3">
              <h6 className="fw-bold mb-4 pb-2 border-bottom">➕ Add New Exercise</h6>
              <div className="col-md-5">
                <input
                  name="name"
                  value={currentExercise.name}
                  onChange={handleExerciseChange}
                  className="form-control form-control-lg rounded-3"
                  placeholder="Bench Press"
                />
              </div>
              <div className="col-md-2">
                <input
                  name="sets"
                  type="number"
                  value={currentExercise.sets}
                  onChange={handleExerciseChange}
                  className="form-control form-control-lg rounded-3"
                  placeholder="4"
                />
              </div>
              <div className="col-md-2">
                <input
                  name="reps"
                  type="number"
                  value={currentExercise.reps}
                  onChange={handleExerciseChange}
                  className="form-control form-control-lg rounded-3"
                  placeholder="12"
                />
              </div>
              <div className="col-md-2">
                <input
                  name="weight"
                  type="number"
                  value={currentExercise.weight}
                  onChange={handleExerciseChange}
                  className="form-control form-control-lg rounded-3"
                  placeholder="80"
                />
              </div>
              <div className="col-md-1 d-grid">
                <button
                  type="button"
                  className="btn btn-success btn-lg rounded-3 h-100"
                  onClick={addExercise}
                >
                  ➕
                </button>
              </div>
            </div>

            {/* Exercises List */}
            {formData.exercises.length > 0 && (
              <div className="row g-3">
                {formData.exercises.map((ex, index) => (
                  <div key={index} className="col-12">
                    <div className="d-flex align-items-center p-3 bg-white border rounded-3 shadow-sm">
                      <div className="flex-grow-1">
                        <div className="fw-bold fs-6">{ex.name}</div>
                        <small className="text-muted">
                          {ex.sets} × {ex.reps} {ex.weight && `@${ex.weight}kg`} 
                          {ex.restTime && ` | Rest: ${ex.restTime}`}
                        </small>
                      </div>
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm rounded-pill px-3"
                        onClick={() => removeExercise(index)}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="form-label fw-bold fs-5 mb-3">📝 Notes (Optional)</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            rows="3"
            className="form-control form-control-lg rounded-3 shadow-sm border-2 border-light"
            placeholder="How did it feel? PRs? Notes for next time..."
          />
        </div>

        {/* Error Display */}
        {error && (
          <div className="alert alert-danger rounded-3 shadow-sm" role="alert">
            ⚠️ {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="d-flex gap-3 pt-4">
          <button
            type="button"
            className="btn btn-outline-secondary btn-lg flex-fill rounded-3 shadow-sm"
            onClick={handleCancel}
            disabled={loading}
          >
            ❌ Cancel
          </button>
          <button
            type="submit"
            className="btn btn-success btn-lg flex-fill rounded-3 shadow-lg fw-bold fs-5"
            disabled={loading || formData.exercises.length === 0}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Saving...
              </>
            ) : (
              `🚀 Save Workout (${formData.exercises.length} exercises)`
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
