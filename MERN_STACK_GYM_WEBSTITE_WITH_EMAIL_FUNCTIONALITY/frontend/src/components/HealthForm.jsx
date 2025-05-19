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
  const [showForm, setShowForm] = useState(false); // Re-added state

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
    setShowForm(false); // Reset form toggle
  };

  return (
    <div className="health-form-container">
      <ToastContainer />
      {loading && <div className="loader">Loading...</div>}

      {!user && !showForm && (
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
            <div className="text-red-400 mt-2">❌ User not found.</div>
          )}

          <button className="add-user-button" onClick={() => setShowForm(true)}>
            ➕ Add New User
          </button>

          <button className="home-button" onClick={() => window.location.href = '/'}>
            🏠 Home Page
          </button>
        </div>
      )}

      {user && !loading && (
        <div className="user-details-container">
          <h2>✅ Existing User Found</h2>
          <div className="user-details-grid">
            {Object.entries(user)
              .filter(([key]) => !['_id', '__v', 'diet', 'workout', 'goalPlan'].includes(key))
              .map(([key, val]) => (
                <div key={key}><strong>{key.replace(/([A-Z])/g, ' $1')}:</strong> {val || 'N/A'}</div>
              ))}
          </div>

          {otpSent && !otpVerified && (
            <div className="otp-section">
              <input
                type="text"
                placeholder="Enter OTP"
                value={otpInput}
                onChange={e => setOtpInput(e.target.value)}
              />
              <button className="verify-button" onClick={handleVerifyOTP}>✅ Verify OTP</button>
            </div>
          )}

          {otpVerified && (
            <div className="otp-success">✅ OTP Verified</div>
          )}

          <button className="back-button" onClick={resetToSearch}>🔙 Back</button>
        </div>
      )}

      {showForm && (
        <div className="user-add-form">
          <h2>📝 Add New User</h2>
          {/* You can render your full form component here or navigate to another route */}
          <button className="go-form" onClick={() => window.location.href = '/add-user'}>
            👉 Go to Full Form
          </button>
          <button className="cancel-button" onClick={resetToSearch}>❌ Cancel</button>
        </div>
      )}
    </div>
  );
};

export default HealthForm;
