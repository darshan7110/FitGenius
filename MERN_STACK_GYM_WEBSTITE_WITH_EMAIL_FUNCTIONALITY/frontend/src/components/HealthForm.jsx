import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './HealthForm.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const HealthForm = () => {
  // State management
  const [state, setState] = useState({
    otp: '',
    mobile: '',
    user: null,
    notFound: false,
    showForm: false,
    loading: false,
    pdfLoading: false,
    otpSentSearch: false,
    otpVerifiedSearch: false,
    otpInputSearch: '',
    searchEmail: '',
    otpSent: false,
    otpVerified: false,
    otpInput: '',
    formData: {
      name: '', age: '', gender: '', weight: '', height: '',
      goal: '', activityLevel: '', healthConditions: '',
      foodPreferences: '', email: '', mobile: ''
    },
    planSelected: localStorage.getItem('selectedPlan') || ''
  });

  // Destructure state for easier access
  const {
    mobile, user, notFound, showForm, loading, pdfLoading,
    otpSentSearch, otpVerifiedSearch, otpInputSearch, searchEmail,
    otpSent, otpVerified, otpInput, formData, planSelected
  } = state;

  // API configuration
  const API_BASE_URL = 'https://fitgenius-production.up.railway.app/api';
  const axiosConfig = {
    timeout: 25000,
    headers: {
      'Content-Type': 'application/json'
    }
  };

  // Unified state updater
  const updateState = (updates) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  // PDF Download Handler
  const handleDownloadPDF = async () => {
    updateState({ pdfLoading: true });
    try {
      const response = await axios.get(
        `${API_BASE_URL}/pdf/generate/${mobile}`,
        { ...axiosConfig, responseType: 'blob' }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `FitGenius_Report_${mobile}.pdf`);
      document.body.appendChild(link);
      link.click();
      
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);

      toast.success('PDF downloaded successfully!');
    } catch (error) {
      console.error('Download failed:', error);
      toast.error(error.response?.data?.message || 'Failed to download PDF');
    } finally {
      updateState({ pdfLoading: false });
    }
  };

  // Reset form to initial state
  const resetToSearch = () => {
    updateState({
      showForm: false,
      user: null,
      mobile: '',
      notFound: false,
      otpSent: false,
      otpVerified: false,
      otpInput: '',
      otpSentSearch: false,
      otpVerifiedSearch: false,
      otpInputSearch: '',
      searchEmail: '',
      formData: {
        name: '', age: '', gender: '', weight: '', height: '',
        goal: '', activityLevel: '', healthConditions: '',
        foodPreferences: '', email: '', mobile: ''
      }
    });
  };

  // Form validation
  const validateForm = () => {
    const validations = [
      { test: !/^[A-Za-z\s]+$/.test(formData.name), message: 'Name should contain only letters' },
      { test: !formData.age || formData.age < 18 || formData.age > 100, message: 'Age must be between 18 and 100' },
      { test: !formData.weight || formData.weight < 20 || formData.weight > 500, message: 'Weight must be between 20 and 500 kg' },
      { test: !formData.height || formData.height < 50 || formData.height > 500, message: 'Height must be between 50 and 500 cm' },
      { test: !/^[6-9]\d{9}$/.test(formData.mobile), message: 'Mobile number must be valid' },
      { test: !['Male', 'Female', 'Other'].includes(formData.gender), message: 'Invalid gender selected' },
      { test: !['Low', 'Moderate', 'Intense', 'Extreme'].includes(formData.activityLevel), message: 'Invalid activity level' },
      { test: !['Lose Weight', 'Gain Muscle', 'Make Body'].includes(formData.goal), message: 'Invalid goal' },
      { test: !formData.email.includes('@'), message: 'Enter a valid email' }
    ];

    return validations.find(v => v.test)?.message;
  };

  // API handlers
  const handleSearchUser = async () => {
    if (!mobile.trim()) {
      toast.error('❌ Please enter mobile number');
      return;
    }

    updateState({ loading: true });
    try {
      const res = await axios.get(`${API_BASE_URL}/healthdata/${mobile}`, axiosConfig);
      const fetchedEmail = res.data.email;
      
      updateState({
        user: res.data,
        notFound: false,
        searchEmail: fetchedEmail
      });

      await axios.post(`${API_BASE_URL}/otp/send`, { email: fetchedEmail }, axiosConfig);
      toast.success(`📨 OTP sent to ${fetchedEmail}`);
      updateState({ otpSentSearch: true });
    } catch (err) {
      updateState({ user: null, notFound: true });
      toast.error(err.response?.data?.message || 'User not found');
    } finally {
      updateState({ loading: false });
    }
  };

  const handleVerifyOTP = async (type = 'search') => {
    const otpToVerify = type === 'search' ? otpInputSearch : otpInput;
    const emailToVerify = type === 'search' ? searchEmail : formData.email;

    if (!otpToVerify.trim()) {
      toast.error('❌ Please enter OTP');
      return;
    }

    updateState({ loading: true });
    try {
      await axios.post(`${API_BASE_URL}/otp/verify`, 
        { email: emailToVerify, otp: otpToVerify },
        axiosConfig
      );
      
      toast.success('✅ OTP verified!');
      updateState(type === 'search' ? { otpVerifiedSearch: true } : { otpVerified: true });
    } catch (err) {
      toast.error(err.response?.data?.message || '❌ Invalid or expired OTP');
    } finally {
      updateState({ loading: false });
    }
  };

  const handleSendOTP = async () => {
    const validationError = validateForm();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    updateState({ loading: true });
    try {
      await axios.post(`${API_BASE_URL}/otp/send`, 
        { email: formData.email },
        axiosConfig
      );
      toast.success('📨 OTP sent to your email!');
      updateState({ otpSent: true });
    } catch (err) {
      toast.error(err.response?.data?.message || '❌ Failed to send OTP');
    } finally {
      updateState({ loading: false });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otpVerified) {
      toast.error('❌ Please verify OTP before submitting');
      return;
    }

    updateState({ loading: true });
    try {
      const fullData = { ...formData, planSelected };
      await axios.post(`${API_BASE_URL}/healthdata`, fullData, axiosConfig);
      toast.success('✅ User saved and plan generated successfully!');
      resetToSearch();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving user');
    } finally {
      updateState({ loading: false });
    }
  };

  // Input handlers
  const handleInputChange = (e, key) => {
    updateState({
      formData: {
        ...formData,
        [key]: e.target.value
      }
    });
  };

  const handleMobileChange = (e) => {
    updateState({ mobile: e.target.value });
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
            onChange={handleMobileChange} 
            placeholder="Enter mobile number" 
          />
          <div className="search-actions">
            <button onClick={handleSearchUser}>🔍 Search User</button>
            <button onClick={() => updateState({ showForm: true })}>➕ Add New User</button>
            <button className="home-button" onClick={() => window.location.href = '/'}>🏠 Home Page</button>
          </div>
          {notFound && <div className="text-red-400 mt-2">❌ User not found.</div>}
        </div>
      )}

      {user && !otpVerifiedSearch && (
        <div className="health-form">
          <div>Email Found: <strong>{searchEmail}</strong></div>
          <div className="otp-section">
            <input 
              type="text" 
              placeholder="Enter OTP" 
              value={otpInputSearch} 
              onChange={(e) => updateState({ otpInputSearch: e.target.value })} 
            />
            <button onClick={() => handleVerifyOTP('search')}>✅ Verify OTP</button>
            <button onClick={() => {
              updateState({
                otpSentSearch: false,
                user: null,
                otpInputSearch: '',
                searchEmail: ''
              });
            }}>🔙 Back</button>
            <button onClick={handleSearchUser}>🔄 Resend OTP</button>
          </div>
        </div>
      )}

      {user && otpVerifiedSearch && !loading && (
        <div className="user-details-container">
          <h2>✅ Existing User Plan</h2>
          <div className="flex justify-end mb-4">
            <button 
              onClick={handleDownloadPDF}
              disabled={pdfLoading}
              className="pdf-download-button"
            >
              {pdfLoading ? 'Generating PDF...' : 'Download PDF Report'}
            </button>
          </div>
          <div className="user-details-grid">
            {user && Object.entries(user)
              .filter(([key]) => !['_id', '_v', 'planSelected', 'diet', 'workout', 'goalPlan'].includes(key))
              .map(([key, val]) => (
                <div key={key}>
                  <strong>{key.replace(/([A-Z])/g, ' $1')}:</strong> {val || 'N/A'}
                </div>
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
                  <select 
                    value={formData[key]} 
                    onChange={(e) => handleInputChange(e, key)}
                  >
                    <option value="">Select</option>
                    {options.map(option => 
                      <option key={option} value={option}>{option}</option>
                    )}
                  </select>
                ) : (
                  <input 
                    type={type} 
                    value={formData[key]} 
                    onChange={(e) => handleInputChange(e, key)} 
                  />
                )}
              </div>
            ))}
          </div>

          {!otpSent ? (
            <button type="button" className="otp-button" onClick={handleSendOTP}>
              📨 Send OTP
            </button>
          ) : !otpVerified ? (
            <div className="otp-section">
              <input 
                type="text" 
                placeholder="Enter OTP" 
                value={otpInput} 
                onChange={(e) => updateState({ otpInput: e.target.value })} 
              />
              <button 
                type="button" 
                className="verify-button" 
                onClick={() => handleVerifyOTP('form')}
              >
                ✅ Verify OTP
              </button>
              <button type="button" onClick={handleSendOTP}>🔄 Resend OTP</button>
              <button 
                type="button" 
                className="cancel-button mt-2" 
                onClick={() => updateState({ otpSent: false, otpInput: '' })}
              >
                🔙 Back
              </button>
            </div>
          ) : (
            <div className="otp-success">✅ OTP Verified</div>
          )}

          <div className="form-actions">
            <button type="submit" disabled={!otpVerified}>
              💾 Save User & Generate Plan
            </button>
            <button 
              type="button" 
              onClick={resetToSearch} 
              className="cancel-button ml-3"
            >
              ❌ Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default HealthForm;