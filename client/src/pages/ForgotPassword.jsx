import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Login.css';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:3001/auth/forgot-password', { email });
      setMessage(res.data.message || 'OTP sent to email');
      // navigate to verify OTP page
      navigate('/verify-reset-otp', { state: { email } });
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login">
      <div className="login_content">
        <form className="login_content_form" onSubmit={handleSubmit}>
          <h3>Forgot Password</h3>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {message && <p style={{ color: 'red' }}>{message}</p>}
          <button type="submit" disabled={loading}>{loading ? 'Sending...' : 'Send OTP'}</button>
        </form>
        <a href="/login">Back to Login</a>
      </div>
    </div>
  );
};

export default ForgotPassword;
