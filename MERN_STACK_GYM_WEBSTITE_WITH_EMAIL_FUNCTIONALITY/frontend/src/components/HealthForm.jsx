import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './HealthForm.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const HealthForm = () => {
  const [otp, setOtp] = useState("");
  const [mobile, setMobile] = useState('');
  const [user, setUser] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [otpSentSearch, setOtpSentSearch] = useState(false);
  const [otpVerifiedSearch, setOtpVerifiedSearch] = useState(false);
  const [otpInputSearch, setOtpInputSearch] = useState('');
  const [searchEmail, setSearchEmail] = useState('');

  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpInput, setOtpInput] = useState('');

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
    setOtpSent(false);
    setOtpVerified(false);
    setOtpInput('');
    setOtpSentSearch(false);
    setOtpVerifiedSearch(false);
    setOtpInputSearch('');
    setSearchEmail('');
    setFormData({
      name: '', age: '', gender: '', weight: '', height: '',
      goal: '', activityLevel: '', healthConditions: '',
      foodPreferences: '', email: '', mobile: ''
    });
  };

  const handleGetEmailFromMobile = async () => {
    if (!mobile.trim()) {
      toast.error('❌ Please enter mobile number');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(`https://fitgenius-production.up.railway.app/api/healthdata/email/${mobile}`);
      if (res.data?.email) {
        setSearchEmail(res.data.email);
        toast.success('📩 Email found and pre-filled');
      } else {
        toast.error('❌ No user found with this mobile');
      }
    } catch (err) {
      console.error(err);
      toast.error('❌ Error fetching email');
    } finally {
      setLoading(false);
    }
  };

  const handleSendSearchOTP = async () => {
    if (!searchEmail.includes('@')) {
      toast.error('❌ Please enter a valid email to receive OTP');
      return;
    }
    setLoading(true);
    try {
      await axios.post('https://fitgenius-production.up.railway.app/api/otp/send', {
        email: searchEmail
      });
      toast.success('📨 OTP sent to your email!');
      setOtpSentSearch(true);
    } catch (err) {
      console.error(err);
      toast.error('❌ Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifySearchOTP = async () => {
    if (!otpInputSearch.trim()) {
      toast.error('❌ Please enter OTP');
      return;
    }
    setLoading(true);
    try {
      await axios.post('https://fitgenius-production.up.railway.app/api/otp/verify', {
        email: searchEmail,
        otp: otpInputSearch
      });
      toast.success('✅ OTP verified!');
      setOtpVerifiedSearch(true);
    } catch (err) {
      console.error(err);
      toast.error('❌ Invalid or expired OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchUser = async () => {
    if (!mobile.trim()) return;
    if (!otpVerifiedSearch) {
      toast.error('❌ Please verify OTP before searching');
      return;
    }

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
    if (!formData.email || !formData.email.includes('@')) return 'Enter a valid email';
    return null;
  };

  const handleSendOTP = async () => {
    const validationError = validateForm();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setLoading(true);
    try {
      await axios.post('https://fitgenius-production.up.railway.app/api/otp/send', {
        email: formData.email
      });
      toast.success('📨 OTP sent to your email!');
      setOtpSent(true);
    } catch (err) {
      console.error(err);
      toast.error('❌ Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otpInput.trim()) {
      toast.error('Please enter OTP');
      return;
    }

    setLoading(true);
    try {
      await axios.post('https://fitgenius-production.up.railway.app/api/otp/verify', {
        email: formData.email,
        otp: otpInput
      });
      toast.success('✅ OTP verified!');
      setOtpVerified(true);
    } catch (err) {
      console.error(err);
      toast.error('❌ Invalid or expired OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otpVerified) {
      toast.error('❌ Please verify OTP before submitting');
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
      <ToastContainer />
      {loading && <div className="loader">Loading...</div>}

      {!user && !showForm && !loading && (
        <div className="health-form mb-6">
          <label htmlFor="mobile">Enter Phone Number</label>
          <input id="mobile" value={mobile} onChange={e => setMobile(e.target.value)} placeholder="Enter mobile number" />

          <button onClick={handleGetEmailFromMobile}>📩 Get Email from Mobile</button>

          {searchEmail && (
            <>
              <input type="email" value={searchEmail} readOnly />
              {!otpSentSearch ? (
                <button onClick={handleSendSearchOTP}>📨 Send OTP</button>
              ) : !otpVerifiedSearch ? (
                <div className="otp-section">
                  <input type="text" placeholder="Enter OTP" value={otpInputSearch} onChange={(e) => setOtpInputSearch(e.target.value)} />
                  <button onClick={handleVerifySearchOTP}>✅ Verify OTP</button>
                  <button onClick={() => setOtpSentSearch(false)}>🔄 Resend OTP</button>
                  <button onClick={() => {
                    setSearchEmail('');
                    setOtpInputSearch('');
                    setOtpSentSearch(false);
                  }}>🔙 Back</button>
                </div>
              ) : (
                <div className="otp-success">✅ OTP Verified</div>
              )}
            </>
          )}

          <button onClick={handleSearchUser}>🔍 Search User</button>
          <button onClick={() => setShowForm(true)}>➕ Add New User</button>
          {notFound && <div className="text-red-400 mt-2">❌ User not found.</div>}
          <button className="home-button" onClick={() => window.location.href = '/'}>🏠 Home Page</button>
        </div>
      )}

      {user && !loading && (
        <div className="user-details-container">
          <h2>✅ Existing User Plan</h2>
          <div className="user-details-grid">
            {Object.entries(user)
              .filter(([key]) => !['_id', '_v', 'planSelected', 'diet', 'workout', 'goalPlan'].includes(key))
              .map(([key, val]) => (
                <div key={key}><strong>{key.replace(/([A-Z])/g, ' $1')}:</strong> {val || 'N/A'}</div>
              ))}
          </div>
          <h3>🏋️‍♂️ Workout Plan</h3>
          <div className="plan-box-scroll">{user.workout?.content || 'No Workout Plan available.'}</div>
          <h3>🥗 Diet Plan</h3>
          <div className="plan-box-scroll">{user.diet?.content || 'No Diet Plan available.'}</div>
          <h3>🎯 Goal Plan</h3>
          <div className="plan-box-scroll">{user.goalPlan?.content || 'No Goal Plan available.'}</div>
          <button onClick={resetToSearch} className="back-button">🔙 Back to Search</button>
        </div>
      )}

      {showForm && !loading && (
        <form onSubmit={handleSubmit} className="health-form-formatted">
          <h2>📝 New User Details*</h2>
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
                <label>{label} *</label>
                {type === 'select' ? (
                  <select value={formData[key]} onChange={e => setFormData({ ...formData, [key]: e.target.value })}>
                    <option value="">Select</option>
                    {options.map(option => <option key={option}>{option}</option>)}
                  </select>
                ) : (
                  <input type={type} value={formData[key]} onChange={e => setFormData({ ...formData, [key]: e.target.value })} />
                )}
              </div>
            ))}
          </div>

          {!otpSent ? (
            <button type="button" className="otp-button" onClick={handleSendOTP}>📨 Send OTP</button>
          ) : !otpVerified ? (
            <div className="otp-section">
              <input type="text" placeholder="Enter OTP" value={otpInput} onChange={e => setOtpInput(e.target.value)} />
              <button type="button" className="verify-button" onClick={handleVerifyOTP}>✅ Verify OTP</button>
              <button type="button" onClick={handleSendOTP}>🔄 Resend OTP</button>
              <button type="button" className="cancel-button mt-2" onClick={() => {
                setOtpSent(false);
                setOtpInput('');
              }}>🔙 Back</button>
            </div>
          ) : (
            <div className="otp-success">✅ OTP Verified</div>
          )}

          <div className="form-actions">
            <button type="submit" disabled={!otpVerified}>💾 Save User & Generate Plan</button>
            <button type="button" onClick={resetToSearch} className="cancel-button ml-3">❌ Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default HealthForm;
