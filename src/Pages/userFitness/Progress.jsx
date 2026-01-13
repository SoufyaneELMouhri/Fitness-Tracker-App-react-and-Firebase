import React, { useState } from 'react';
import { useProgress } from '../../Hooks/UseProgress';

export default function Progress() {
  const {
    // State
    weightLogs,
    weightStats,
    measurements,
    measurementChanges,
    workoutSessions,
    workoutStats,
    workoutStreak,
    personalRecords,
    activeGoals,
    progressSummary,
    loading,
    
    // Functions
    loadAllProgressData
  } = useProgress();

  const [showAddModal, setShowAddModal] = useState(false);

  // Calculate weekly stats from workout sessions
  const getWeeklyStats = () => {
    const today = new Date();
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const stats = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      const dayWorkouts = workoutSessions.filter(w => w.date === dateString);
      
      stats.push({
        day: weekDays[date.getDay()],
        workouts: dayWorkouts.length,
        calories: dayWorkouts.reduce((sum, w) => sum + (w.caloriesBurned || 0), 0),
        duration: dayWorkouts.reduce((sum, w) => sum + (w.duration || 0), 0)
      });
    }

    return stats;
  };

  const weeklyStats = getWeeklyStats();
  const maxCalories = Math.max(...weeklyStats.map(s => s.calories), 1);

  // Calculate monthly progress
  const monthlyProgress = {
    workoutsCompleted: workoutStats.totalWorkouts || 0,
    totalCalories: workoutStats.totalCalories || 0,
    totalMinutes: workoutStats.totalDuration || 0,
    avgHeartRate: 142, // You can add this to workout data
    currentStreak: workoutStreak.currentStreak || 0,
    longestStreak: workoutStreak.longestStreak || 0
  };

  // Body measurements comparison
  const bodyMeasurements = [
    {
      metric: 'Weight',
      current: weightStats.currentWeight ? `${weightStats.currentWeight} kg` : 'N/A',
      previous: weightStats.startWeight ? `${weightStats.startWeight} kg` : 'N/A',
      change: weightStats.change ? weightStats.change.toString() : '0',
      trend: parseFloat(weightStats.change || 0) < 0 ? 'down' : 'up'
    }
  ];

  // Add measurement changes if available
  if (measurementChanges) {
    if (measurementChanges.chest) {
      bodyMeasurements.push({
        metric: 'Chest',
        current: `${measurementChanges.chest.current} cm`,
        previous: `${measurementChanges.chest.start} cm`,
        change: measurementChanges.chest.change,
        trend: parseFloat(measurementChanges.chest.change) > 0 ? 'up' : 'down'
      });
    }
    if (measurementChanges.waist) {
      bodyMeasurements.push({
        metric: 'Waist',
        current: `${measurementChanges.waist.current} cm`,
        previous: `${measurementChanges.waist.start} cm`,
        change: measurementChanges.waist.change,
        trend: parseFloat(measurementChanges.waist.change) < 0 ? 'down' : 'up'
      });
    }
  }

  // Achievements (you can make these dynamic based on actual progress)
  const achievements = [
    { 
      id: 1, 
      title: '7-Day Streak', 
      icon: '🔥', 
      earned: workoutStreak.currentStreak >= 7,
      date: workoutStreak.currentStreak >= 7 ? 'Achieved' : 'Locked'
    },
    { 
      id: 2, 
      title: '1000 Calories Burned', 
      icon: '💪', 
      earned: monthlyProgress.totalCalories >= 1000,
      date: monthlyProgress.totalCalories >= 1000 ? 'Achieved' : 'Locked'
    },
    { 
      id: 3, 
      title: '50 Workouts', 
      icon: '🏆', 
      earned: monthlyProgress.workoutsCompleted >= 50,
      date: monthlyProgress.workoutsCompleted >= 50 ? 'Achieved' : 'Locked'
    },
    { 
      id: 4, 
      title: 'Early Bird', 
      icon: '🌅', 
      earned: false,
      date: 'Locked'
    },
    { 
      id: 5, 
      title: '30-Day Streak', 
      icon: '⭐', 
      earned: workoutStreak.longestStreak >= 30,
      date: workoutStreak.longestStreak >= 30 ? 'Achieved' : 'Locked'
    },
    { 
      id: 6, 
      title: '100 Workouts', 
      icon: '👑', 
      earned: monthlyProgress.workoutsCompleted >= 100,
      date: monthlyProgress.workoutsCompleted >= 100 ? 'Achieved' : 'Locked'
    }
  ];

  // Format personal records
  const formattedPRs = personalRecords.slice(0, 4).map(pr => ({
    exercise: pr.exerciseName,
    record: `${pr.weight} ${pr.unit}${pr.reps ? ` x ${pr.reps}` : ''}`,
    date: new Date(pr.date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    })
  }));

  if (loading && workoutSessions.length === 0) {
    return (
      <div className="min-vh-100 bg-light d-flex justify-content-center align-items-center">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status"></div>
          <p>Loading your progress...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-light p-4">
      <div className="container-fluid">
        {/* Header */}
        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="display-5 fw-bold">Your Progress 📈</h1>
              <p className="text-muted">Track your fitness journey and celebrate your achievements</p>
            </div>
            <button 
              className="btn btn-primary"
              onClick={() => loadAllProgressData()}
            >
              🔄 Refresh
            </button>
          </div>
        </div>

        {/* Monthly Overview Cards */}
        <div className="row g-3 mb-4">
          <div className="col-6 col-md-4 col-lg-2">
            <div className="card border-0 text-white h-100" style={{background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'}}>
              <div className="card-body p-3">
                <p className="small mb-1 opacity-75">Workouts</p>
                <p className="display-6 fw-bold mb-0">{monthlyProgress.workoutsCompleted}</p>
                <p className="small opacity-75 mb-0">This month</p>
              </div>
            </div>
          </div>

          <div className="col-6 col-md-4 col-lg-2">
            <div className="card border-0 text-white h-100" style={{background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)'}}>
              <div className="card-body p-3">
                <p className="small mb-1 opacity-75">Calories</p>
                <p className="display-6 fw-bold mb-0">{monthlyProgress.totalCalories.toLocaleString()}</p>
                <p className="small opacity-75 mb-0">Burned</p>
              </div>
            </div>
          </div>

          <div className="col-6 col-md-4 col-lg-2">
            <div className="card border-0 text-white h-100" style={{background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)'}}>
              <div className="card-body p-3">
                <p className="small mb-1 opacity-75">Minutes</p>
                <p className="display-6 fw-bold mb-0">{monthlyProgress.totalMinutes}</p>
                <p className="small opacity-75 mb-0">Active time</p>
              </div>
            </div>
          </div>

          <div className="col-6 col-md-4 col-lg-2">
            <div className="card border-0 text-white h-100" style={{background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'}}>
              <div className="card-body p-3">
                <p className="small mb-1 opacity-75">Avg Heart Rate</p>
                <p className="display-6 fw-bold mb-0">{monthlyProgress.avgHeartRate}</p>
                <p className="small opacity-75 mb-0">BPM</p>
              </div>
            </div>
          </div>

          <div className="col-6 col-md-4 col-lg-2">
            <div className="card border-0 text-white h-100" style={{background: 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)'}}>
              <div className="card-body p-3">
                <p className="small mb-1 opacity-75">Current Streak</p>
                <p className="display-6 fw-bold mb-0">{monthlyProgress.currentStreak} 🔥</p>
                <p className="small opacity-75 mb-0">Days</p>
              </div>
            </div>
          </div>

          <div className="col-6 col-md-4 col-lg-2">
            <div className="card border-0 text-white h-100" style={{background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)'}}>
              <div className="card-body p-3">
                <p className="small mb-1 opacity-75">Best Streak</p>
                <p className="display-6 fw-bold mb-0">{monthlyProgress.longestStreak} ⭐</p>
                <p className="small opacity-75 mb-0">Days</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="row g-4 mb-4">
          {/* Weekly Activity Chart */}
          <div className="col-12 col-lg-8">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <h2 className="h4 fw-bold mb-4">Weekly Activity</h2>
                
                {weeklyStats.every(s => s.calories === 0) ? (
                  <div className="text-center py-5 text-muted">
                    <span style={{fontSize: '3rem'}}>📊</span>
                    <p className="mt-3">No workout data yet. Start exercising to see your progress!</p>
                  </div>
                ) : (
                  <>
                    {/* Bar Chart */}
                    <div className="d-flex align-items-end justify-content-between gap-2" style={{height: '260px'}}>
                      {weeklyStats.map((stat, index) => (
                        <div key={index} className="flex-fill d-flex flex-column align-items-center gap-2">
                          <div className="w-100 d-flex flex-column justify-content-end" style={{height: '200px'}}>
                            <div 
                              className="w-100 rounded-top position-relative"
                              style={{
                                height: `${(stat.calories / maxCalories) * 100}%`,
                                background: 'linear-gradient(to top, #3b82f6, #60a5fa)',
                                minHeight: stat.calories > 0 ? '10px' : '0'
                              }}
                              title={`${stat.calories} calories`}
                            >
                              {stat.calories > 0 && (
                                <div className="position-absolute top-0 start-50 translate-middle-x bg-dark text-white px-2 py-1 rounded small" 
                                     style={{fontSize: '0.7rem', whiteSpace: 'nowrap'}}>
                                  {stat.calories}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="text-center">
                            <p className="small fw-semibold mb-0">{stat.day}</p>
                            <p className="small text-muted mb-0">{stat.workouts > 0 ? `${stat.workouts}x` : '-'}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Legend */}
                    <div className="d-flex justify-content-center gap-4 pt-3 mt-3 border-top">
                      <div className="d-flex align-items-center gap-2">
                        <div style={{width: '16px', height: '16px', background: '#3b82f6'}} className="rounded"></div>
                        <span className="small text-muted">Calories Burned</span>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <span className="small text-muted">
                          Total: {weeklyStats.reduce((sum, s) => sum + s.calories, 0)} cal
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Body Measurements */}
          <div className="col-12 col-lg-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <h2 className="h4 fw-bold mb-4">Body Measurements</h2>
                
                {bodyMeasurements.length === 0 || bodyMeasurements[0].current === 'N/A' ? (
                  <div className="text-center py-5 text-muted">
                    <span style={{fontSize: '3rem'}}>📏</span>
                    <p className="mt-3">No measurements yet. Start tracking your body metrics!</p>
                  </div>
                ) : (
                  <div className="vstack gap-3">
                    {bodyMeasurements.map((measurement, index) => (
                      <div key={index} className="pb-3 border-bottom">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="small text-muted">{measurement.metric}</span>
                          <span className={`badge ${measurement.trend === 'down' ? 'bg-success' : 'bg-primary'}`}>
                            {measurement.change > 0 ? '+' : ''}{measurement.change}
                          </span>
                        </div>
                        <div className="d-flex align-items-baseline gap-2">
                          <span className="h4 fw-bold mb-0">{measurement.current}</span>
                          {measurement.previous !== measurement.current && (
                            <span className="small text-muted text-decoration-line-through">
                              {measurement.previous}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Achievements & Personal Records */}
        <div className="row g-4">
          {/* Achievements */}
          <div className="col-12 col-lg-6">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <h2 className="h4 fw-bold mb-4">Achievements 🏆</h2>
                
                <div className="row g-3">
                  {achievements.map((achievement) => (
                    <div key={achievement.id} className="col-4">
                      <div 
                        className={`card border-0 text-center p-3 position-relative ${
                          achievement.earned 
                            ? 'text-white' 
                            : 'bg-light text-muted'
                        }`}
                        style={achievement.earned ? {background: 'linear-gradient(135deg, #fbbf24 0%, #f97316 100%)'} : {}}
                      >
                        <div style={{fontSize: '2.5rem'}} className="mb-2">{achievement.icon}</div>
                        <p className="small fw-semibold mb-1">{achievement.title}</p>
                        <p className="small mb-0" style={{fontSize: '0.7rem', opacity: 0.75}}>
                          {achievement.date}
                        </p>
                        {achievement.earned && (
                          <div className="position-absolute top-0 end-0 m-1 bg-white rounded-circle d-flex align-items-center justify-content-center"
                               style={{width: '20px', height: '20px'}}>
                            <span className="small">✓</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Personal Records */}
          <div className="col-12 col-lg-6">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <h2 className="h4 fw-bold mb-4">Personal Records 💪</h2>
                
                {formattedPRs.length === 0 ? (
                  <div className="text-center py-5 text-muted">
                    <span style={{fontSize: '3rem'}}>🏋️</span>
                    <p className="mt-3">No personal records yet. Push yourself to new limits!</p>
                  </div>
                ) : (
                  <div className="vstack gap-3">
                    {formattedPRs.map((record, index) => (
                      <div 
                        key={index}
                        className="d-flex justify-content-between align-items-center p-3 rounded"
                        style={{background: 'linear-gradient(90deg, #faf5ff 0%, #eff6ff 100%)'}}
                      >
                        <div>
                          <h3 className="h6 fw-bold mb-0">{record.exercise}</h3>
                          <p className="small text-muted mb-0">{record.date}</p>
                        </div>
                        <div className="text-end">
                          <p className="h4 fw-bold mb-0" style={{color: '#9333ea'}}>{record.record}</p>
                          <span className="small text-muted">PR</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
