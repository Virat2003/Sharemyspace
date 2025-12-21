import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/Login.css';

const VerifyOtp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const emailFromState = location.state?.email || '';

  const [email, setEmail] = useState(emailFromState);
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);

  const handleVerify = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await axios.post('http://localhost:3001/auth/verify-reset-otp', { email, otp });
      const successMsg = res.data.message || 'OTP verified';
      setMessage(successMsg);
      navigate('/reset-password', { state: { email, message: 'OTP verified successfully' } });
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Verification failed';
      setMessage(errMsg);
    }
  };

  const handleResend = async () => {
    setMessage('');
    try {
      await axios.post('http://localhost:3001/auth/forgot-password', { email });
      setMessage('OTP resent. Check your email.');
      setResendDisabled(true);
      setResendTimer(60);
      const interval = setInterval(() => {
        setResendTimer((s) => {
          if (s <= 1) {
            clearInterval(interval);
            setResendDisabled(false);
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Resend failed');
    }
  };

  return (
    <div className="login">
      <div className="login_content">
        <form className="login_content_form" onSubmit={handleVerify}>
          <h3 className='enterotp'>Enter OTP</h3>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          {message && <p style={{ color: 'red' }}>{message}</p>}
          <button type="submit">Verify OTP</button>
          <div style={{ marginTop: 12 }}>
            <button
              type="button"
              className="resend-btn"
              onClick={handleResend}
              disabled={resendDisabled}
            >
              {resendDisabled ? `Resend in ${resendTimer}s` : 'Resend OTP'}
            </button>
          </div>
        </form>
        <a href="/login">Back to Login</a>
      </div>
    </div>
  );
};

export default VerifyOtp;
