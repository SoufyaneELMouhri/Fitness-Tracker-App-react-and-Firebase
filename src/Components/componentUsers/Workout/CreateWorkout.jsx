import React, { useState } from 'react';
import { useWorkouts } from '../../../Hooks/useWorkout';

export default function CreateWorkout({ onClose }) {
  const { logWorkout } = useWorkouts();
  
  const [formData, setFormData] = useState({
    name: '',
    type: 'strength',
    duration: '',
    caloriesBurned: '',
    notes: '',
    workoutDate: new Date().toISOString().split('T')[0],
    exercises: []
  });
  
  const [currentExercise, setCurrentExercise] = useState({
    name: '',
    sets: '',
    reps: '',
    weight: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const addExercise = () => {
    if (!currentExercise.name?.trim() || !currentExercise.sets || !currentExercise.reps) {
      setError('Fill exercise name, sets, reps');
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      exercises: [...prev.exercises, { 
        name: currentExercise.name.trim(),
        sets: parseInt(currentExercise.sets),
        reps: parseInt(currentExercise.reps),
        weight: currentExercise.weight ? parseFloat(currentExercise.weight) : null,
        completed: false
      }]
    }));
    setCurrentExercise({ name: '', sets: '', reps: '', weight: '' });
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
      setError('Add at least 1 exercise');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await logWorkout(formData);
      setSuccess('✅ Workout saved!');
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err) {
      setError(err.message || 'Save failed');
      console.error('Save error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleExerciseChange = (e) => {
    setCurrentExercise(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit}>
        {success && (
          <div className="alert alert-success mb-3 p-3 rounded-3">
            {success}
          </div>
        )}

        <div className="mb-4">
          <input
            name="name"
            placeholder="Workout Name *"
            className="form-control form-control-lg mb-2"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
          <div className="row g-2">
            <div className="col">
              <input
                name="workoutDate"
                type="date"
                className="form-control"
                value={formData.workoutDate}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="col">
              <select name="type" className="form-select" onChange={handleInputChange} value={formData.type}>
                <option value="strength">💪 Strength</option>
                <option value="cardio">🏃 Cardio</option>
                <option value="hiit">⚡ HIIT</option>
                <option value="yoga">🧘 Yoga</option>
                <option value="core">🎯 Core</option>
              </select>
            </div>
          </div>
          <div className="row g-2 mt-2">
            <div className="col">
              <input name="duration" placeholder="Duration (min)" type="number" min="1" className="form-control" onChange={handleInputChange} value={formData.duration} />
            </div>
            <div className="col">
              <input name="caloriesBurned" placeholder="Calories" type="number" min="0" className="form-control" onChange={handleInputChange} value={formData.caloriesBurned} />
            </div>
          </div>
        </div>

        <div className="card border-0 shadow-sm mb-4">
          <div className="card-header bg-primary text-white p-3">
            <h6 className="mb-0">Exercises ({formData.exercises.length})</h6>
          </div>
          <div className="card-body p-3">
            <div className="row g-2 mb-3 p-3 bg-light rounded">
              <div className="col-md-5">
                <input name="name" placeholder="Exercise name" className="form-control" value={currentExercise.name} onChange={handleExerciseChange} />
              </div>
              <div className="col-md-2">
                <input name="sets" placeholder="Sets" type="number" min="1" className="form-control" value={currentExercise.sets} onChange={handleExerciseChange} />
              </div>
              <div className="col-md-2">
                <input name="reps" placeholder="Reps" type="number" min="1" className="form-control" value={currentExercise.reps} onChange={handleExerciseChange} />
              </div>
              <div className="col-md-3">
                <input name="weight" placeholder="Weight kg" type="number" step="0.5" min="0" className="form-control" value={currentExercise.weight} onChange={handleExerciseChange} />
              </div>
              <div className="col-12 mt-2">
                <button type="button" className="btn btn-success me-2" onClick={addExercise}>➕ Add</button>
                <button type="button" className="btn btn-secondary" onClick={() => setCurrentExercise({ name: '', sets: '', reps: '', weight: '' })}>Clear</button>
              </div>
            </div>

            {formData.exercises.length > 0 ? (
              formData.exercises.map((ex, i) => (
                <div key={i} className="d-flex align-items-center p-2 border rounded mb-2 bg-white">
                  <div className="flex-grow-1">
                    <strong>{ex.name}</strong> {ex.sets}×{ex.reps} {ex.weight && `@${ex.weight}kg`}
                  </div>
                  <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => removeExercise(i)}>🗑️</button>
                </div>
              ))
            ) : (
              <div className="text-center py-3 text-muted">
                No exercises added yet
              </div>
            )}
          </div>
        </div>

        <textarea
          name="notes"
          placeholder="Notes (optional)..."
          rows="2"
          className="form-control mb-3"
          value={formData.notes}
          onChange={handleInputChange}
        />

        {error && <div className="alert alert-danger p-3 mb-3">{error}</div>}

        <div className="d-flex gap-2">
          <button type="button" className="btn btn-outline-secondary flex-fill py-2" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn btn-success flex-fill fw-bold py-2"
            disabled={loading || formData.exercises.length === 0}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Saving...
              </>
            ) : (
              `Save (${formData.exercises.length} exercises)`
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
