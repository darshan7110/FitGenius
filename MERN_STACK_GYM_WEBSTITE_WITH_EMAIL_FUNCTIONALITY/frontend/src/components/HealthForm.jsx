import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './HealthForm.css';

const HealthForm = () => {
  const [mobile, setMobile] = useState('');
  const [user, setUser] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '', age: '', gender: '', weight: '', height: '',
    goal: '', activityLevel: '', healthConditions: '',
    foodPreferences: '', email: ''
  });
  const [planSelected, setPlanSelected] = useState('');

  useEffect(() => {
    const storedPlan = localStorage.getItem('selectedPlan');
    if (storedPlan) setPlanSelected(storedPlan);
  }, []);

  const resetToSearch = () => {
    setShowForm(false);
    setUser(null);
    setMobile('');
    setNotFound(false);
    setFormData({
      name: '', age: '', gender: '', weight: '', height: '',
      goal: '', activityLevel: '', healthConditions: '',
      foodPreferences: '', email: ''
    });
  };

  const handleSearchUser = async () => {
    if (!mobile.trim()) return;
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:4000/api/healthdata/${mobile}`);

      setUser(res.data);
      setNotFound(false);
    } catch (err) {
      setUser(null);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(formData.name)) return 'Name should contain only letters';
    const age = parseInt(formData.age);
    if (isNaN(age) || age < 18 || age > 100) return 'Age must be between 18 and 100';
    const weight = parseFloat(formData.weight);
    if (isNaN(weight) || weight < 20 || weight > 500) return 'Weight must be between 20 and 500 kg';
    const height = parseFloat(formData.height);
    if (isNaN(height) || height < 50 || height > 500) return 'Height must be between 50 and 500 cm';
    if (!['Male', 'Female', 'Other'].includes(formData.gender)) return 'Invalid gender selected';
    if (!['Low', 'Moderate', 'Intense', 'Extreme'].includes(formData.activityLevel)) return 'Invalid activity level';
    if (!['Lose Weight', 'Gain Muscle', 'Make Body'].includes(formData.goal)) return 'Invalid goal';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      alert(validationError);
      return;
    }

    setLoading(true);
    try {
      const fullData = { ...formData, mobile, planSelected };
      console.log(fullData)
      await axios.post('http://localhost:4000/api/healthdata', fullData);

      resetToSearch();
    } catch (err) {
      alert('Error saving user');
      console.log("main Problem",err);
      console.log(fullData)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="health-form-container">
      {loading && <div className="loader">Loading...</div>}

      {!user && !showForm && !loading && (
        <div className="health-form mb-6">
          <label htmlFor="mobile" className="block text-lg font-medium mb-2">Enter Phone Number</label>
          <input
            id="mobile"
            value={mobile}
            onChange={e => setMobile(e.target.value)}
            placeholder="Enter mobile number"
          />
          <button onClick={handleSearchUser} className="mt-3">🔍 Search User</button>
          <button onClick={() => setShowForm(true)} className="mt-3">➕ Add New User</button>
          {notFound && <div className="text-red-400 mt-2">❌ User not found.</div>}
           <button className="home-button" onClick={() => window.location.href = '/'}>
    🏠 Home Page
  </button>
        </div>
      )}

     {user && !loading && (
  <div className="user-details-container">
    <h2 className="user-details-title">✅ Existing User Plan</h2>
<div className="user-details-grid">
  {Object.entries(user)
    .filter(([key]) => !['_id', '_v', 'planSelected', 'diet', 'workout', 'goalPlan'].includes(key))
    .map(([key, val]) => (
      <div key={key}>
        <strong>{key.replace(/([A-Z])/g, ' $1')}:</strong>{' '}
        {val || 'N/A'}
      </div>
    ))}
</div>


    <div className="ai-plan-section">
      <h3 className="font-bold mt-4">🏋️‍♂️ Workout Plan</h3>
      <div className="plan-box-scroll">
        {user.workout?.content || 'No Workout Plan available.'}
      </div>

      <h3 className="font-bold mt-4">🥗 Diet Plan</h3>
      <div className="plan-box-scroll">
        {user.diet?.content || 'No Diet Plan available.'}
      </div>

      <h3 className="font-bold mt-4">🎯 Goal Plan</h3>
      <div className="plan-box-scroll">
        {user.goalPlan?.content || 'No Goal Plan available.'}
      </div>
    </div>

    <button onClick={resetToSearch} className="back-button mt-4">🔙 Back to Search</button>
  </div>
)}

      {showForm && !loading && (
        <form onSubmit={handleSubmit} className="health-form-formatted">
          <h2 className="form-heading">📝 New User Details</h2>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Name</label>
              <input className="form-input" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
            </div>

            <div className="form-group">
              <label className="form-label">Age</label>
              <input type="number" className="form-input" value={formData.age} onChange={e => setFormData({ ...formData, age: e.target.value })} />
            </div>

            <div className="form-group">
              <label className="form-label">Gender</label>
              <select className="form-input" value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value })}>
                <option value="">Select</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Weight (kg)</label>
              <input type="number" className="form-input" value={formData.weight} onChange={e => setFormData({ ...formData, weight: e.target.value })} />
            </div>

            <div className="form-group">
              <label className="form-label">Height (cm)</label>
              <input type="number" className="form-input" value={formData.height} onChange={e => setFormData({ ...formData, height: e.target.value })} />
            </div>

            <div className="form-group">
              <label className="form-label">Activity Level</label>
              <select className="form-input" value={formData.activityLevel} onChange={e => setFormData({ ...formData, activityLevel: e.target.value })}>
                <option value="">Select</option>
                <option>Low</option>
                <option>Moderate</option>
                <option>Intense</option>
                <option>Extreme</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Goal</label>
              <select className="form-input" value={formData.goal} onChange={e => setFormData({ ...formData, goal: e.target.value })}>
                <option value="">Select</option>
                <option>Lose Weight</option>
                <option>Gain Muscle</option>
                <option>Make Body</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Health Conditions</label>
              <input className="form-input" value={formData.healthConditions} onChange={e => setFormData({ ...formData, healthConditions: e.target.value })} />
            </div>

            <div className="form-group">
              <label className="form-label">Food Preferences</label>
              <input className="form-input" value={formData.foodPreferences} onChange={e => setFormData({ ...formData, foodPreferences: e.target.value })} />
            </div>

            <div className="form-group">
              <label className="form-label">Email (optional)</label>
              <input type="email" className="form-input" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-button">💾 Save User & Generate Plan</button>
            <button type="button" onClick={resetToSearch} className="cancel-button ml-3">❌ Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default HealthForm;
