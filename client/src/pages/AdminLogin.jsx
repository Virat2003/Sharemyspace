import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setLogin } from '../redux/state';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminLogin.css';

// admin panel added
const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.message || 'Login failed');

      if (data.user.role !== 'admin') return setError('Admin access only');

      dispatch(setLogin({ user: data.user, token: data.token }));
      try { localStorage.setItem('token', data.token); localStorage.setItem('user', JSON.stringify(data.user)); } catch(e) {}
      navigate('/admin/dashboard');
    } catch (err) {
      console.error(err);
      setError('Server error');
    }
  };

  return (
    <div className="admin-login-root">
      <div className="admin-login-card">
        <h2 className="admin-login-title">Admin Login</h2>
        <form className="admin-login-form" onSubmit={handleSubmit}>
          <input className="admin-input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input className="admin-input" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          {error && <p className="admin-error">{error}</p>}
          <button className="btn primary" type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
