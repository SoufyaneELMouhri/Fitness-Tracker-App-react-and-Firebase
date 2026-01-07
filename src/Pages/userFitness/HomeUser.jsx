import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { UseAuth } from '../../Hooks/UseAuth';

export default function HomeUser() {
  const stats = [
    { id: 1, label: 'Workouts This Week', value: '5', icon: '🏋️', color: 'primary' },
    { id: 2, label: 'Calories Burned', value: '2,450', icon: '🔥', color: 'warning' },
    { id: 3, label: 'Active Minutes', value: '340', icon: '⏱️', color: 'success' },
    { id: 4, label: 'Goal Progress', value: '78%', icon: '🎯', color: 'purple' }
  ];

  const recentWorkouts = [
    { id: 1, name: 'Upper Body Strength', duration: '45 min', calories: 320, date: 'Today' },
    { id: 2, name: 'Cardio HIIT', duration: '30 min', calories: 280, date: 'Yesterday' },
    { id: 3, name: 'Leg Day', duration: '60 min', calories: 450, date: '2 days ago' }
  ];

  const upcomingGoals = [
    { id: 1, goal: 'Run 5K in under 25 minutes', progress: 65 },
    { id: 2, goal: 'Lose 5kg by March', progress: 40 },
    { id: 3, goal: 'Complete 20 workouts this month', progress: 85 }
  ];
  const {currentUser} = UseAuth();

  return (
    <div className="min-vh-100 bg-light p-4">
      <div className="container-fluid">
        {/* Header */}
        <div className="mb-4">
          <h1 className="display-5 fw-bold">Welcome back, {console.log(currentUser)}! 💪</h1>
          <p className="text-muted">Here's your fitness overview for today</p>
        </div>

        {/* Stats Grid */}
        <div className="row g-4 mb-4">
          {stats.map((stat) => (
            <div key={stat.id} className="col-12 col-md-6 col-lg-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <p className="text-muted small mb-1">{stat.label}</p>
                      <h3 className="display-6 fw-bold mb-0">{stat.value}</h3>
                    </div>
                    <div className={`bg-${stat.color} rounded-circle d-flex align-items-center justify-content-center`}
                         style={{width: '56px', height: '56px', fontSize: '1.5rem'}}>
                      {stat.icon}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="row g-4 mb-4">
          {/* Recent Workouts */}
          <div className="col-12 col-lg-8">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h2 className="h4 fw-bold mb-0">Recent Workouts</h2>
                  <a href="#" className="text-primary text-decoration-none small fw-semibold">View All</a>
                </div>
                
                <div className="vstack gap-3">
                  {recentWorkouts.map((workout) => (
                    <div key={workout.id} className="d-flex justify-content-between align-items-center bg-light rounded p-3">
                      <div className="d-flex align-items-center gap-3">
                        <div className="bg-primary bg-opacity-10 rounded d-flex align-items-center justify-content-center"
                             style={{width: '48px', height: '48px', fontSize: '1.5rem'}}>
                          💪
                        </div>
                        <div>
                          <h3 className="h6 fw-semibold mb-0">{workout.name}</h3>
                          <p className="small text-muted mb-0">{workout.date}</p>
                        </div>
                      </div>
                      <div className="text-end">
                        <p className="fw-semibold mb-0">{workout.duration}</p>
                        <p className="small text-warning mb-0">{workout.calories} cal</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Goals Section */}
          <div className="col-12 col-lg-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <h2 className="h4 fw-bold mb-4">Your Goals</h2>
                
                <div className="vstack gap-4">
                  {upcomingGoals.map((item) => (
                    <div key={item.id}>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <p className="small fw-medium mb-0">{item.goal}</p>
                        <span className="badge bg-primary">{item.progress}%</span>
                      </div>
                      <div className="progress" style={{height: '8px'}}>
                        <div className="progress-bar" role="progressbar" 
                             style={{width: `${item.progress}%`, background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)'}}
                             aria-valuenow={item.progress} aria-valuemin="0" aria-valuemax="100">
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button className="btn btn-primary w-100 fw-medium mt-4">
                  Add New Goal
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="row g-4">
          <div className="col-12 col-md-4">
            <div className="card border-0 text-white h-100" style={{background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)'}}>
              <div className="card-body text-center p-4">
                <span className="d-block fs-1 mb-3">🏃</span>
                <h3 className="h5 fw-bold">Start Workout</h3>
                <p className="small opacity-75 mb-0">Begin your training session</p>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-4">
            <div className="card border-0 text-white h-100" style={{background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)'}}>
              <div className="card-body text-center p-4">
                <span className="d-block fs-1 mb-3">🍎</span>
                <h3 className="h5 fw-bold">Track Nutrition</h3>
                <p className="small opacity-75 mb-0">Log your meals & calories</p>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-4">
            <div className="card border-0 text-white h-100" style={{background: 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)'}}>
              <div className="card-body text-center p-4">
                <span className="d-block fs-1 mb-3">📊</span>
                <h3 className="h5 fw-bold">View Progress</h3>
                <p className="small opacity-75 mb-0">Check your achievements</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
