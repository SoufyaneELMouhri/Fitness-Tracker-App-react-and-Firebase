import React, { useState } from 'react';
import { UseAuth } from '../../Hooks/UseAuth';

export default function Profile() {
  const { currentUser } = UseAuth();
  const [activeTab, setActiveTab] = useState('profile');

  // Profile state
  const [profileData, setProfileData] = useState({
    displayName: currentUser?.display_name || '',
    email: currentUser?.email || '',
    age: currentUser?.age || '',
    height: currentUser?.height || '',
    weight: currentUser?.weight || '',
    goal: currentUser?.goals || '',
    activityLevel: currentUser?.activityLevel || '',
    dietPreferences: currentUser?.dietPreferences || ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    // Add your save logic here
    alert('Profile updated successfully!');
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    alert('Password change functionality coming soon!');
  };

  return (
    <div className="min-vh-100 bg-light">
      <div className="container-fluid p-4">
        <div className="row">
          {/* Sidebar */}
          <div className="col-lg-3 col-md-4 mb-4">
            <div className="card border-0 shadow-sm sticky-top" style={{top: '20px'}}>
              <div className="card-body p-0">
                {/* Profile Header */}
                <div className="text-center p-4 border-bottom">
                  <div 
                    className="bg-primary bg-opacity-10 rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" 
                    style={{width: '80px', height: '80px', fontSize: '2.5rem'}}
                  >
                    👤
                  </div>
                  <h5 className="mb-1">{currentUser?.display_name || 'User'}</h5>
                  <small className="text-muted">{currentUser?.email}</small>
                </div>

                {/* Navigation Menu */}
                <div className="list-group list-group-flush">
                  <button
                    className={`list-group-item list-group-item-action border-0 ${activeTab === 'profile' ? 'active' : ''}`}
                    onClick={() => setActiveTab('profile')}
                  >
                    <i className="bi bi-person me-2"></i> Profile Information
                  </button>
                  <button
                    className={`list-group-item list-group-item-action border-0 ${activeTab === 'fitness' ? 'active' : ''}`}
                    onClick={() => setActiveTab('fitness')}
                  >
                    <i className="bi bi-heart-pulse me-2"></i> Fitness Details
                  </button>
                  <button
                    className={`list-group-item list-group-item-action border-0 ${activeTab === 'preferences' ? 'active' : ''}`}
                    onClick={() => setActiveTab('preferences')}
                  >
                    <i className="bi bi-sliders me-2"></i> Preferences
                  </button>
                  <button
                    className={`list-group-item list-group-item-action border-0 ${activeTab === 'security' ? 'active' : ''}`}
                    onClick={() => setActiveTab('security')}
                  >
                    <i className="bi bi-shield-lock me-2"></i> Security
                  </button>
                  <button
                    className={`list-group-item list-group-item-action border-0 ${activeTab === 'notifications' ? 'active' : ''}`}
                    onClick={() => setActiveTab('notifications')}
                  >
                    <i className="bi bi-bell me-2"></i> Notifications
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-lg-9 col-md-8">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                {/* Profile Information Tab */}
                {activeTab === 'profile' && (
                  <div>
                    <h4 className="mb-4">Profile Information</h4>
                    <form onSubmit={handleSaveProfile}>
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label">Display Name</label>
                          <input
                            type="text"
                            className="form-control"
                            name="displayName"
                            value={profileData.displayName}
                            onChange={handleInputChange}
                            placeholder="Enter your name"
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Email Address</label>
                          <input
                            type="email"
                            className="form-control"
                            name="email"
                            value={profileData.email}
                            onChange={handleInputChange}
                            disabled
                          />
                          <small className="text-muted">Email cannot be changed</small>
                        </div>
                        <div className="col-md-4">
                          <label className="form-label">Age</label>
                          <input
                            type="number"
                            className="form-control"
                            name="age"
                            value={profileData.age}
                            onChange={handleInputChange}
                            placeholder="25"
                          />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label">Height (cm)</label>
                          <input
                            type="number"
                            className="form-control"
                            name="height"
                            value={profileData.height}
                            onChange={handleInputChange}
                            placeholder="175"
                          />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label">Weight (kg)</label>
                          <input
                            type="number"
                            className="form-control"
                            name="weight"
                            value={profileData.weight}
                            onChange={handleInputChange}
                            placeholder="70"
                          />
                        </div>
                        <div className="col-12">
                          <button type="submit" className="btn btn-primary">
                            Save Changes
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                )}

                {/* Fitness Details Tab */}
                {activeTab === 'fitness' && (
                  <div>
                    <h4 className="mb-4">Fitness Details</h4>
                    <form onSubmit={handleSaveProfile}>
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label">Fitness Goal</label>
                          <select
                            className="form-select"
                            name="goal"
                            value={profileData.goal}
                            onChange={handleInputChange}
                          >
                            <option value="">Select your goal</option>
                            <option value="lose-weight">Lose Weight</option>
                            <option value="build-muscle">Build Muscle</option>
                            <option value="stay-fit">Stay Fit</option>
                            <option value="improve-endurance">Improve Endurance</option>
                          </select>
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Activity Level</label>
                          <select
                            className="form-select"
                            name="activityLevel"
                            value={profileData.activityLevel}
                            onChange={handleInputChange}
                          >
                            <option value="">Select activity level</option>
                            <option value="Sedentary">Sedentary (Little or no exercise)</option>
                            <option value="Light">Light (1-3 days/week)</option>
                            <option value="Moderate">Moderate (3-5 days/week)</option>
                            <option value="Active">Active (6-7 days/week)</option>
                            <option value="Very Active">Very Active (Physical job + exercise)</option>
                          </select>
                        </div>
                        <div className="col-12">
                          <label className="form-label">Target Weight (kg)</label>
                          <input
                            type="number"
                            className="form-control"
                            placeholder="Target weight"
                          />
                        </div>
                        <div className="col-12">
                          <button type="submit" className="btn btn-primary">
                            Save Changes
                          </button>
                        </div>
                      </div>
                    </form>

                    {/* Stats Cards */}
                    <div className="row g-3 mt-4">
                      <div className="col-md-4">
                        <div className="card bg-primary bg-opacity-10 border-0">
                          <div className="card-body text-center">
                            <h3 className="mb-0">{currentUser?.totalWorkouts || 0}</h3>
                            <small className="text-muted">Total Workouts</small>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="card bg-success bg-opacity-10 border-0">
                          <div className="card-body text-center">
                            <h3 className="mb-0">{currentUser?.weight || 0} kg</h3>
                            <small className="text-muted">Current Weight</small>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="card bg-warning bg-opacity-10 border-0">
                          <div className="card-body text-center">
                            <h3 className="mb-0">{currentUser?.height || 0} cm</h3>
                            <small className="text-muted">Height</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Preferences Tab */}
                {activeTab === 'preferences' && (
                  <div>
                    <h4 className="mb-4">Preferences</h4>
                    <form onSubmit={handleSaveProfile}>
                      <div className="row g-3">
                        <div className="col-12">
                          <label className="form-label">Diet Preferences</label>
                          <select
                            className="form-select"
                            name="dietPreferences"
                            value={profileData.dietPreferences}
                            onChange={handleInputChange}
                          >
                            <option value="">Select diet preference</option>
                            <option value="balanced">Balanced</option>
                            <option value="high-protein">High Protein</option>
                            <option value="low-carb">Low Carb</option>
                            <option value="vegetarian">Vegetarian</option>
                            <option value="vegan">Vegan</option>
                            <option value="keto">Keto</option>
                          </select>
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Measurement Unit</label>
                          <select className="form-select">
                            <option value="metric">Metric (kg, cm)</option>
                            <option value="imperial">Imperial (lbs, inches)</option>
                          </select>
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Date Format</label>
                          <select className="form-select">
                            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                          </select>
                        </div>
                        <div className="col-12">
                          <label className="form-label">Language</label>
                          <select className="form-select">
                            <option value="en">English</option>
                            <option value="es">Spanish</option>
                            <option value="fr">French</option>
                            <option value="ar">Arabic</option>
                          </select>
                        </div>
                        <div className="col-12">
                          <button type="submit" className="btn btn-primary">
                            Save Preferences
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                )}

                {/* Security Tab */}
                {activeTab === 'security' && (
                  <div>
                    <h4 className="mb-4">Security Settings</h4>
                    
                    {/* Change Password */}
                    <div className="mb-5">
                      <h5 className="mb-3">Change Password</h5>
                      <form onSubmit={handleChangePassword}>
                        <div className="row g-3">
                          <div className="col-12">
                            <label className="form-label">Current Password</label>
                            <input
                              type="password"
                              className="form-control"
                              placeholder="Enter current password"
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">New Password</label>
                            <input
                              type="password"
                              className="form-control"
                              placeholder="Enter new password"
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">Confirm New Password</label>
                            <input
                              type="password"
                              className="form-control"
                              placeholder="Confirm new password"
                            />
                          </div>
                          <div className="col-12">
                            <button type="submit" className="btn btn-primary">
                              Update Password
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>

                    {/* Account Status */}
                    <div className="mb-4">
                      <h5 className="mb-3">Account Status</h5>
                      <div className="alert alert-success">
                        <i className="bi bi-check-circle me-2"></i>
                        Email Verified: <strong>{currentUser?.emailVerified ? 'Yes' : 'No'}</strong>
                      </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="border-top pt-4">
                      <h5 className="text-danger mb-3">Danger Zone</h5>
                      <button className="btn btn-outline-danger">
                        Delete Account
                      </button>
                      <p className="text-muted small mt-2">
                        Once you delete your account, there is no going back. Please be certain.
                      </p>
                    </div>
                  </div>
                )}

                {/* Notifications Tab */}
                {activeTab === 'notifications' && (
                  <div>
                    <h4 className="mb-4">Notification Settings</h4>
                    <form>
                      <div className="mb-4">
                        <h5 className="mb-3">Email Notifications</h5>
                        <div className="form-check mb-3">
                          <input className="form-check-input" type="checkbox" id="workoutReminders" defaultChecked />
                          <label className="form-check-label" htmlFor="workoutReminders">
                            <strong>Workout Reminders</strong>
                            <p className="text-muted small mb-0">Receive reminders for scheduled workouts</p>
                          </label>
                        </div>
                        <div className="form-check mb-3">
                          <input className="form-check-input" type="checkbox" id="progressUpdates" defaultChecked />
                          <label className="form-check-label" htmlFor="progressUpdates">
                            <strong>Progress Updates</strong>
                            <p className="text-muted small mb-0">Weekly summary of your fitness progress</p>
                          </label>
                        </div>
                        <div className="form-check mb-3">
                          <input className="form-check-input" type="checkbox" id="nutritionTips" />
                          <label className="form-check-label" htmlFor="nutritionTips">
                            <strong>Nutrition Tips</strong>
                            <p className="text-muted small mb-0">Daily nutrition and diet recommendations</p>
                          </label>
                        </div>
                      </div>

                      <div className="mb-4">
                        <h5 className="mb-3">Push Notifications</h5>
                        <div className="form-check mb-3">
                          <input className="form-check-input" type="checkbox" id="pushWorkout" defaultChecked />
                          <label className="form-check-label" htmlFor="pushWorkout">
                            <strong>Workout Notifications</strong>
                            <p className="text-muted small mb-0">Get notified about workout schedules</p>
                          </label>
                        </div>
                        <div className="form-check mb-3">
                          <input className="form-check-input" type="checkbox" id="pushAchievements" defaultChecked />
                          <label className="form-check-label" htmlFor="pushAchievements">
                            <strong>Achievement Alerts</strong>
                            <p className="text-muted small mb-0">Celebrate your milestones and achievements</p>
                          </label>
                        </div>
                      </div>

                      <button type="submit" className="btn btn-primary">
                        Save Notification Settings
                      </button>
                    </form>
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
