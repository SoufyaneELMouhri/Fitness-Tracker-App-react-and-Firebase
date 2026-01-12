import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useWorkouts } from '../../../Hooks/useWorkout';
import { Clock, Fire, ChevronLeft, Trash } from 'react-bootstrap-icons';
import Spinner from '../../componentGuests/Spinner';

export default function ShowWorkout() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getWorkout, updateWorkout, deleteWorkout } = useWorkouts();
  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    const loadWorkout = async () => {
      setLoading(true);
      try {
        const data = await getWorkout(id);
        if (data) {
          setWorkout(data);
          setFavorite(data.favorite || false);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    loadWorkout();
  }, [id, getWorkout]);

  const toggleFavorite = async () => {
    const newFavorite = !favorite;
    setFavorite(newFavorite);
    try {
      await updateWorkout(id, { favorite: newFavorite });
    } catch (error) {
      console.error('Favorite error:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Delete this workout?')) {
      try {
        await deleteWorkout(id);
        navigate('/app/workouts');
      } catch (error) {
        console.error('Delete error:', error);
      }
    }
  };

  const formatDuration = (duration) => duration ? `${Math.floor(duration)}m` : '0m';

  if (loading) {
    return <Spinner />;
  }

  if (!workout) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="text-center p-5">
          <h2 className="text-muted mb-4">Workout not found</h2>
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
              <div className="card-header bg-primary text-white p-4">
                <Link to="/app/workouts" className="btn btn-light btn-sm rounded-pill px-3 mb-2">
                  <ChevronLeft className="me-1" /> Workouts
                </Link>
                <div className="text-center">
                  <h1 className="h2 fw-bold mb-2">{workout.name}</h1>
                  <span className="badge bg-light text-dark px-3 py-2 fs-6">
                    {workout.type?.toUpperCase() || 'Workout'}
                  </span>
                </div>
                <div className="d-flex justify-content-end mt-3 gap-2">
                  <button className="btn btn-outline-light btn-sm px-3" onClick={toggleFavorite}>
                    {favorite ? '❤️' : '🤍'}
                  </button>
                  <Link to={`/app/workouts/${id}/edit`} className="btn btn-light btn-sm px-3">
                    Edit
                  </Link>
                  <button className="btn btn-outline-light btn-sm px-3" onClick={handleDelete}>
                    <Trash className="me-1" /> Delete
                  </button>
                </div>
              </div>

              <div className="card-body p-5">
                <div className="row g-4 mb-5 text-center">
                  <div className="col-md-4">
                    <Clock className="display-4 text-primary mb-3" />
                    <h3 className="fw-bold text-dark">{formatDuration(workout.duration)}</h3>
                    <small className="text-muted">Duration</small>
                  </div>
                  {workout.caloriesBurned && (
                    <div className="col-md-4">
                      <Fire className="display-4 text-warning mb-3" />
                      <h3 className="fw-bold text-warning">{workout.caloriesBurned.toLocaleString()}</h3>
                      <small className="text-muted">Calories</small>
                    </div>
                  )}
                  <div className="col-md-4">
                    <div className="display-4 mb-3">📅</div>
                    <h3 className="fw-bold text-dark">{new Date(workout.workoutDate).toLocaleDateString()}</h3>
                    <small className="text-muted">Date</small>
                  </div>
                </div>

                <div className="mb-5">
                  <h3 className="fw-bold mb-4">📋 Exercises ({workout.exercises?.length || 0})</h3>
                  <div className="row g-4">
                    {workout.exercises?.length > 0 ? (
                      workout.exercises.map((ex, index) => (
                        <div key={index} className="col-lg-6">
                          <div className="card border-0 shadow-sm h-100">
                            <div className="card-body p-4">
                              <h5 className="fw-bold mb-2">{ex.name}</h5>
                              <div className="row text-center">
                                <div className="col">
                                  <div className="h6 fw-bold text-primary">{ex.sets}</div>
                                  <small>Sets</small>
                                </div>
                                <div className="col">
                                  <div className="h6 fw-bold text-success">{ex.reps}</div>
                                  <small>Reps</small>
                                </div>
                                {ex.weight && (
                                  <div className="col">
                                    <div className="h6 fw-bold text-warning">{ex.weight}kg</div>
                                    <small>Weight</small>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-12 text-center py-5">
                        <p className="text-muted fs-4">No exercises</p>
                      </div>
                    )}
                  </div>
                </div>

                {workout.notes && (
                  <div className="mb-5">
                    <h3 className="fw-bold mb-3">📝 Notes</h3>
                    <div className="bg-light p-4 rounded-4">
                      <p className="lead mb-0">{workout.notes}</p>
                    </div>
                  </div>
                )}

                <div className="d-grid gap-3">
                  <Link to={`/app/workouts/${id}/edit`} className="btn btn-primary btn-lg py-3 fs-5">
                    Edit Workout
                  </Link>
                  <Link to="/app/workouts" className="btn btn-outline-secondary btn-lg py-3 fs-5">
                    ← Back to Workouts
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
