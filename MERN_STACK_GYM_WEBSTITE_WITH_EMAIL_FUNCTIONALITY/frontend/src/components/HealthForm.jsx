import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './HealthForm.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const HealthForm = () => {
  const [mobile, setMobile] = useState('');
  const [user, setUser] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '', age: '', gender: '', weight: '', height: '',
    goal: '', activityLevel: '', healthConditions: '',
    foodPreferences: '', email: '', mobile: ''
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
      foodPreferences: '', email: '', mobile: ''
    });
  };

  const handleSearchUser = async () => {
    if (!mobile.trim()) return;
    setLoading(true);
    try {
      const res = await axios.get(`https://fitgenius-production.up.railway.app/api/healthdata/${mobile}`);
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
    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobileRegex.test(formData.mobile)) return 'Mobile number must be a valid 10-digit Indian number starting with 6-9';
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
      const fullData = { ...formData, planSelected };
      await axios.post(`https://fitgenius-production.up.railway.app/api/healthdata`, fullData);
      toast.success('✅ User saved and plan generated successfully!');
      resetToSearch();
    } catch (err) {
      alert('Error saving user');
      console.log("Error:", err);
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
          <button className="home-button" onClick={() => window.location.href = '/'}>🏠 Home Page</button>
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
          <h2 className="form-heading">📝 New User Details*</h2>
          <div className="form-grid">
            {[
              ['Name', 'name'],
              ['Age', 'age', 'number'],
              ['Gender', 'gender', 'select', ['Male', 'Female', 'Other']],
              ['Weight (kg)', 'weight', 'number'],
              ['Height (cm)', 'height', 'number'],
              ['Activity Level', 'activityLevel', 'select', ['Low', 'Moderate', 'Intense', 'Extreme']],
              ['Goal', 'goal', 'select', ['Lose Weight', 'Gain Muscle', 'Make Body']],
              ['Health Conditions', 'healthConditions'],
              ['Food Preferences', 'foodPreferences'],
              ['Mobile Number', 'mobile'],
              ['Email', 'email', 'email']
            ].map(([label, key, type = 'text', options]) => (
              <div className="form-group" key={key}>
                <label className="form-label">{label} *</label>
                {type === 'select' ? (
                  <select className="form-input" value={formData[key]} onChange={e => setFormData({ ...formData, [key]: e.target.value })}>
                    <option value="">Select</option>
                    {options.map(option => <option key={option}>{option}</option>)}
                  </select>
                ) : (
                  <input type={type} className="form-input" value={formData[key]} onChange={e => setFormData({ ...formData, [key]: e.target.value })} />
                )}
              </div>
            ))}
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
