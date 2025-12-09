import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setLogin } from '../redux/state';
import { useNavigate } from 'react-router-dom';

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
    <div style={{ padding: 40 }}>
      <h2>Admin Login</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: 420 }}>
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default AdminLogin;
