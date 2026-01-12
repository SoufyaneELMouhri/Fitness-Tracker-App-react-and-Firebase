import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useWorkouts } from '../../../Hooks/useWorkout';
import { ChevronLeft } from 'react-bootstrap-icons';
import Spinner from '../../componentGuests/Spinner';

export default function EditWorkout() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getWorkout, updateWorkout } = useWorkouts();
  
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
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const loadWorkout = async () => {
      setLoading(true);
      try {
        const workout = await getWorkout(id);
        if (workout) {
          setFormData({
            name: workout.name || '',
            type: workout.type || 'strength',
            duration: workout.duration || '',
            caloriesBurned: workout.caloriesBurned || '',
            notes: workout.notes || '',
            workoutDate: workout.workoutDate || new Date().toISOString().split('T')[0],
            exercises: workout.exercises || []
          });
        } else {
          setError('Workout not found');
        }
      } catch (err) {
        setError('Failed to load workout');
        console.error('Load error:', err);
      } finally {
        setLoading(false);
      }
    };
    loadWorkout();
  }, [id, getWorkout]);

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
    
    setSaving(true);
    setError('');
    
    try {
      await updateWorkout(id, formData);
      setSuccess('✅ Workout updated!');
      setTimeout(() => {
        navigate(`/app/workouts/${id}`);
      }, 1200);
    } catch (err) {
      setError(err.message || 'Update failed');
      console.error('Update error:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleExerciseChange = (e) => {
    setCurrentExercise(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  if (loading) {
    return <Spinner />;
  }

  if (error && !formData.name) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="text-center p-5">
          <h2 className="text-muted mb-4">{error}</h2>
          <Link to="/app/workouts" className="btn btn-primary">
            <ChevronLeft className="me-2" /> Back to Workouts
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 py-4 bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10 col-xl-8">
            <div className="card border-0 shadow-xl rounded-4 overflow-hidden">
              <div className="card-header bg-warning text-dark p-4">
                <Link to={`/app/workouts/${id}`} className="btn btn-light btn-sm rounded-pill px-3 mb-2">
                  <ChevronLeft className="me-1" /> Back
                </Link>
                <div className="text-center">
                  <h1 className="h2 fw-bold mb-0">Edit Workout</h1>
                </div>
              </div>

              <div className="card-body p-4">
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
                    <div className="card-header bg-warning text-dark p-3">
                      <h6 className="mb-0 fw-bold">Exercises ({formData.exercises.length})</h6>
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
                    <Link to={`/app/workouts/${id}`} className="btn btn-outline-secondary flex-fill py-2">
                      Cancel
                    </Link>
                    <button 
                      type="submit" 
                      className="btn btn-warning flex-fill fw-bold py-2 text-dark"
                      disabled={saving || formData.exercises.length === 0}
                    >
                      {saving ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Updating...
                        </>
                      ) : (
                        `Update Workout`
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
