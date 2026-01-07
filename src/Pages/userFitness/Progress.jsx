import React from 'react';

export default function Progress() {
  const weeklyStats = [
    { day: 'Mon', workouts: 1, calories: 450, duration: 45 },
    { day: 'Tue', workouts: 1, calories: 380, duration: 35 },
    { day: 'Wed', workouts: 0, calories: 0, duration: 0 },
    { day: 'Thu', workouts: 1, calories: 520, duration: 55 },
    { day: 'Fri', workouts: 1, calories: 410, duration: 40 },
    { day: 'Sat', workouts: 2, calories: 680, duration: 75 },
    { day: 'Sun', workouts: 1, calories: 390, duration: 38 }
  ];

  const monthlyProgress = {
    workoutsCompleted: 23,
    totalCalories: 9850,
    totalMinutes: 1140,
    avgHeartRate: 142,
    currentStreak: 5,
    longestStreak: 12
  };

  const bodyMeasurements = [
    { metric: 'Weight', current: '78.5 kg', previous: '82.0 kg', change: '-3.5', trend: 'down' },
    { metric: 'Body Fat', current: '18.2%', previous: '21.5%', change: '-3.3', trend: 'down' },
    { metric: 'Muscle Mass', current: '64.2 kg', previous: '61.8 kg', change: '+2.4', trend: 'up' },
    { metric: 'BMI', current: '23.1', previous: '24.6', change: '-1.5', trend: 'down' }
  ];

  const achievements = [
    { id: 1, title: '7-Day Streak', icon: '🔥', earned: true, date: 'Dec 20' },
    { id: 2, title: '1000 Calories Burned', icon: '💪', earned: true, date: 'Dec 18' },
    { id: 3, title: '50 Workouts', icon: '🏆', earned: true, date: 'Dec 15' },
    { id: 4, title: 'Early Bird', icon: '🌅', earned: true, date: 'Dec 10' },
    { id: 5, title: '30-Day Streak', icon: '⭐', earned: false, date: 'Locked' },
    { id: 6, title: '100 Workouts', icon: '👑', earned: false, date: 'Locked' }
  ];

  const personalRecords = [
    { exercise: 'Bench Press', record: '85 kg', date: 'Dec 22, 2025' },
    { exercise: 'Squat', record: '120 kg', date: 'Dec 20, 2025' },
    { exercise: 'Deadlift', record: '140 kg', date: 'Dec 18, 2025' },
    { exercise: '5K Run', record: '24:15', date: 'Dec 15, 2025' }
  ];

  const maxCalories = Math.max(...weeklyStats.map(s => s.calories));

  return (
    <div className="min-vh-100 bg-light p-4">
      <div className="container-fluid">
        {/* Header */}
        <div className="mb-4">
          <h1 className="display-5 fw-bold">Your Progress 📈</h1>
          <p className="text-muted">Track your fitness journey and celebrate your achievements</p>
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
                        >
                          <div className="position-absolute top-0 start-50 translate-middle bg-dark text-white px-2 py-1 rounded small opacity-0 hover-opacity-100" 
                               style={{fontSize: '0.7rem', whiteSpace: 'nowrap'}}>
                            {stat.calories} cal
                          </div>
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
                    <span className="small text-muted">Total: {weeklyStats.reduce((sum, s) => sum + s.calories, 0)} cal</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Body Measurements */}
          <div className="col-12 col-lg-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <h2 className="h4 fw-bold mb-4">Body Measurements</h2>
                
                <div className="vstack gap-3">
                  {bodyMeasurements.map((measurement, index) => (
                    <div key={index} className="pb-3 border-bottom">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="small text-muted">{measurement.metric}</span>
                        <span className={`badge ${measurement.trend === 'down' ? 'bg-success' : 'bg-primary'}`}>
                          {measurement.change}
                        </span>
                      </div>
                      <div className="d-flex align-items-baseline gap-2">
                        <span className="h4 fw-bold mb-0">{measurement.current}</span>
                        <span className="small text-muted text-decoration-line-through">{measurement.previous}</span>
                      </div>
                    </div>
                  ))}
                </div>
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
                        <p className="small mb-0" style={{fontSize: '0.7rem', opacity: 0.75}}>{achievement.date}</p>
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
                
                <div className="vstack gap-3">
                  {personalRecords.map((record, index) => (
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
                        <p className="h4 fw-bold text-purple mb-0" style={{color: '#9333ea'}}>{record.record}</p>
                        <span className="small text-muted">PR</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
