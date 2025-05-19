// HealthForm.jsx
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
    // Reset search OTP states
    setOtpSentSearch(false);
    setOtpVerifiedSearch(false);
    setOtpInputSearch('');
    setSearchEmail('');
    // Reset new user OTP states and form
    setOtpSent(false);
    setOtpVerified(false);
    setOtpInput('');
    setFormData({
      name: '', age: '', gender: '', weight: '', height: '',
      goal: '', activityLevel: '', healthConditions: '',
      foodPreferences: '', email: '', mobile: ''
    });
  };

  // SEND OTP for Search with Resend support
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

  // VERIFY OTP for Search
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

  // SEARCH USER only if OTP verified for Search
  const handleSearchUser = async () => {
    if (!mobile.trim()) {
      toast.error('❌ Please enter mobile number');
      return;
    }
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

  // VALIDATE new user form
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

  // SEND OTP for New User (with resend support)
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

  // VERIFY OTP for New User
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

  // SUBMIT New User Data
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

      {/* SEARCH USER SECTION */}
      {!user && !showForm && !loading && (
        <div className="health-form mb-6">
          <label htmlFor="mobile">Enter Phone Number</label>
          <input
            id="mobile"
            value={mobile}
            onChange={e => setMobile(e.target.value)}
            placeholder="Enter mobile number"
            disabled={otpVerifiedSearch} // disable mobile input after OTP verified
          />

          <input
            type="email"
            placeholder="Enter email for OTP"
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
            disabled={otpVerifiedSearch} // disable email input after OTP verified
          />

          {/* Send OTP or Resend OTP */}
          {!otpSentSearch ? (
            <button type="button" onClick={handleSendSearchOTP}>📨 Send OTP</button>
          ) : !otpVerifiedSearch ? (
            <div className="otp-section">
              <input
                type="text"
                placeholder="Enter OTP"
                value={otpInputSearch}
                onChange={(e) => setOtpInputSearch(e.target.value)}
              />
              <button onClick={handleVerifySearchOTP}>✅ Verify OTP</button>
              <button onClick={handleSendSearchOTP}>🔄 Resend OTP</button> {/* Resend button added */}
              <button onClick={() => {
                // BACK button resets OTP and email/mobile inputs for search
                setOtpSentSearch(false);
                setOtpInputSearch('');
                setSearchEmail('');
                setOtpVerifiedSearch(false);
                setMobile('');
              }}>🔙 Back</button>
            </div>
          ) : (
            <div className="otp-success">✅ OTP Verified</div>
          )}

          <button onClick={handleSearchUser} disabled={!otpVerifiedSearch}>🔍 Search User</button>
          <button onClick={() => {
            resetToSearch();
            setShowForm(true);
          }}>➕ Add New User</button>

          {notFound && <div className="text-red-400 mt-2">❌ User not found.</div>}

          <button className="home-button" onClick={() => window.location.href = '/'}>🏠 Home Page</button>
        </div>
      )}

      {/* DISPLAY EXISTING USER DETAILS */}
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
          <button onClick={() => resetToSearch()}>🔙 Back</button>
        </div>
      )}

      {/* NEW USER FORM SECTION */}
      {showForm && (
        <form className="health-form" onSubmit={handleSubmit}>
          <h2>Add New User</h2>
          {/* Input fields */}
          <input
            type="text" placeholder="Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
            disabled={otpVerified}
          />
          <input
            type="number" placeholder="Age" value={formData.age} onChange={e => setFormData({ ...formData, age: e.target.value })}
            disabled={otpVerified}
          />
          <select value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value })} disabled={otpVerified}>
            <option value="">Select Gender</option>
            <option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option>
          </select>
          <input
            type="number" placeholder="Weight (kg)" value={formData.weight} onChange={e => setFormData({ ...formData, weight: e.target.value })}
            disabled={otpVerified}
          />
          <input
            type="number" placeholder="Height (cm)" value={formData.height} onChange={e => setFormData({ ...formData, height: e.target.value })}
            disabled={otpVerified}
          />
          <select value={formData.goal} onChange={e => setFormData({ ...formData, goal: e.target.value })} disabled={otpVerified}>
            <option value="">Select Goal</option>
            <option value="Lose Weight">Lose Weight</option>
            <option value="Gain Muscle">Gain Muscle</option>
            <option value="Make Body">Make Body</option>
          </select>
          <select value={formData.activityLevel} onChange={e => setFormData({ ...formData, activityLevel: e.target.value })} disabled={otpVerified}>
            <option value="">Select Activity Level</option>
            <option value="Low">Low</option><option value="Moderate">Moderate</option><option value="Intense">Intense</option><option value="Extreme">Extreme</option>
          </select>
          <input
            type="text" placeholder="Health Conditions (optional)" value={formData.healthConditions} onChange={e => setFormData({ ...formData, healthConditions: e.target.value })}
            disabled={otpVerified}
          />
          <input
            type="text" placeholder="Food Preferences (optional)" value={formData.foodPreferences} onChange={e => setFormData({ ...formData, foodPreferences: e.target.value })}
            disabled={otpVerified}
          />
          <input
            type="email" placeholder="Email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
            disabled={otpVerified}
          />
          <input
            type="text" placeholder="Mobile" value={formData.mobile} onChange={e => setFormData({ ...formData, mobile: e.target.value })}
            disabled={otpVerified}
          />

          {/* OTP Section for new user */}
          {!otpSent ? (
            <button type="button" onClick={handleSendOTP}>📨 Send OTP</button>
          ) : !otpVerified ? (
            <div className="otp-section">
              <input
                type="text"
                placeholder="Enter OTP"
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value)}
              />
              <button type="button" onClick={handleVerifyOTP}>✅ Verify OTP</button>
              <button type="button" onClick={handleSendOTP}>🔄 Resend OTP</button> {/* Resend button */}
              <button type="button" onClick={() => {
                // Back button resets OTP and allows editing form again
                setOtpSent(false);
                setOtpVerified(false);
                setOtpInput('');
              }}>🔙 Back</button>
            </div>
          ) : (
            <div className="otp-success">✅ OTP Verified</div>
          )}

          <button type="submit" disabled={!otpVerified}>Submit</button>
          <button type="button" onClick={() => {
            setShowForm(false);
            resetToSearch();
          }}>🔙 Back</button>
        </form>
      )}
    </div>
  );
};

export default HealthForm;
