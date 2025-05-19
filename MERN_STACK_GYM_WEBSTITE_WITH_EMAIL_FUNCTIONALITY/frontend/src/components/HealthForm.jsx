import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './HealthForm.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const HealthForm = () => {
  const [mobile, setMobile] = useState('');
  const [user, setUser] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [userEmail, setUserEmail] = useState('');

  const handleSearchAndSendOTP = async () => {
    if (!mobile.trim()) {
      toast.error('📱 Enter mobile number');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(`https://fitgenius-production.up.railway.app/api/healthdata/${mobile}`);
      setUser(res.data);
      setUserEmail(res.data.email);
      setNotFound(false);

      await axios.post('https://fitgenius-production.up.railway.app/api/otp/send', {
        email: res.data.email,
      });

      setOtpSent(true);
      toast.success('📨 OTP sent to your email!');
    } catch (err) {
      setUser(null);
      setUserEmail('');
      setOtpSent(false);
      setOtpVerified(false);
      setNotFound(true);
      toast.error('❌ User not found or failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otpInput.trim()) {
      toast.error('❗ Enter OTP');
      return;
    }

    setLoading(true);
    try {
      await axios.post('https://fitgenius-production.up.railway.app/api/otp/verify', {
        email: userEmail,
        otp: otpInput,
      });
      toast.success('✅ OTP Verified');
      setOtpVerified(true);
    } catch (err) {
      toast.error('❌ Invalid or expired OTP');
    } finally {
      setLoading(false);
    }
  };

  const resetToSearch = () => {
    setMobile('');
    setUser(null);
    setUserEmail('');
    setOtpSent(false);
    setOtpVerified(false);
    setOtpInput('');
    setNotFound(false);
  };

  return (
    <div className="health-form-container">
      <ToastContainer />
      {loading && <div className="loader">Loading...</div>}

      {!user && (
        <div className="health-form mb-6">
          <label htmlFor="mobile">Enter Phone Number</label>
          <input
            id="mobile"
            value={mobile}
            onChange={e => setMobile(e.target.value)}
            placeholder="Enter mobile number"
          />
          <button onClick={handleSearchAndSendOTP}>🔍 Search & Send OTP</button>

          {notFound && (
            <>
              <div className="text-red-400 mt-2">❌ User not found.</div>
              <button className="add-user-button" onClick={() => window.location.href = '/add-user'}>
                ➕ Add New User
              </button>
            </>
          )}

          <button className="home-button" onClick={() => window.location.href = '/'}>
            🏠 Home Page
          </button>
        </div>
      )}

      {user && otpSent && !otpVerified && (
        <div className="otp-section">
          <h3>📧 OTP sent to: {userEmail}</h3>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otpInput}
            onChange={e => setOtpInput(e.target.value)}
          />
          <button type="button" className="verify-button" onClick={handleVerifyOTP}>✅ Verify OTP</button>
        </div>
      )}

      {user && otpVerified && (
        <div className="user-details-container">
          <h2>✅ Verified User Plan</h2>
          <div className="user-details-grid">
            {Object.entries(user)
              .filter(([key]) => !['_id', '__v', 'planSelected', 'diet', 'workout', 'goalPlan'].includes(key))
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

          <button onClick={resetToSearch} className="back-button">🔙 Back</button>
        </div>
      )}
    </div>
  );
};

export default HealthForm;
