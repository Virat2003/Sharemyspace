import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/Login.css';

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const emailFromState = location.state?.email || '';
  const successFromNav = location.state?.message || '';
  const [transientMessage, setTransientMessage] = useState(successFromNav || '');

  useEffect(() => {
    setTransientMessage(successFromNav || '');
    if (successFromNav) {
      const t = setTimeout(() => setTransientMessage(''), 2500);
      return () => clearTimeout(t);
    }
  }, [successFromNav]);

  const [email, setEmail] = useState(emailFromState);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:3001/auth/reset-password', { email, newPassword });
      setMessage(res.data.message || 'Password updated');
      navigate('/login');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login">
      <div className="login_content">
        <form className="login_content_form" onSubmit={handleSubmit}>
          <h3>Reset Password</h3>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {transientMessage && <p style={{ color: 'green' }}>{transientMessage}</p>}
          {message && <p style={{ color: 'red' }}>{message}</p>}
          <button type="submit" disabled={loading}>{loading ? 'Updating...' : 'Reset Password'}</button>
        </form>
        <a href="/login">Back to Login</a>
      </div>
    </div>
  );
};

export default ResetPassword;
