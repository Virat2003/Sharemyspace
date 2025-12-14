import React from "react";
import { useEffect, useState } from "react";
import "../styles/Register.css";
import { useNavigate } from "react-router-dom";
import axios from 'axios';


const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    profileImage: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: value,
      [name]: name === "profileImage" ? files[0] : value,
    });
  };

  console.log(formData);

  const [passwordMatch, setPasswordMatch] = useState(true);

  useEffect(() => {
    setPasswordMatch(
      formData.password === formData.confirmPassword ||
        formData.confirmPassword === ""
    );
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const register_form = new FormData();

      for (var key in formData) {
        register_form.append(key, formData[key]);
      }

      const response = await axios.post("http://localhost:3001/auth/register", register_form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.status === 200) {
        // show OTP input UI
        setStage('verify');
      }
    } catch (err) {
      console.log("Registration failed", err);
      const backendMsg = err.response?.data?.message || err.response?.data || err.message;
      setMessage(backendMsg || 'Registration failed');
    }
  };

  // OTP verification handlers
  const [otpValue, setOtpValue] = useState('');
  const [stage, setStage] = useState('register'); // 'register' or 'verify'
  const [message, setMessage] = useState('');
  const [resendDisabled, setResendDisabled] = useState(true);
  const [resendTimer, setResendTimer] = useState(60);

  // start countdown when entering verify stage
  useEffect(() => {
    let interval = null;
    if (stage === 'verify') {
      setResendDisabled(true);
      setResendTimer(60);
      interval = setInterval(() => {
        setResendTimer((s) => {
          if (s <= 1) {
            clearInterval(interval);
            setResendDisabled(false);
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [stage]);

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3001/auth/verify-otp', {
        email: formData.email,
        otp: otpValue
      });
      if (res.status === 200) {
        navigate('/login');
      }
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || 'Verification failed');
    }
  };

  const handleResend = async () => {
    try {
      setMessage('');
      const res = await axios.post('http://localhost:3001/auth/resend-otp', { email: formData.email });
      if (res.status === 200) {
        setMessage('OTP resent. Check your email.');
        // restart timer
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
      }
    } catch (err) {
      setMessage(err.response?.data?.message || 'Resend failed');
    }
  };

  return (
    <div className="register">
      <div className="register_content">
        {stage === 'register' && (
          <form className="register_content_form" onSubmit={handleSubmit}>
          <input
            placeholder="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          <input
            placeholder="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
          <input
            placeholder="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            type="password"
            required
          />
          <input
            placeholder="Confirm Password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            type="password"
            required
          />

          {!passwordMatch && (
            <p style={{ color: "red" }}>Passwords are not matched!</p>
          )}

          <input
            id="image"
            type="file"
            name="profileImage"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleChange}
            required
          />
          <label htmlFor="image">
            <img src="/assests/addImage.png" alt="add profile photo" />
            <p>Upload Your Photo</p>
          </label>

          {formData.profileImage && (
            <img
              src={URL.createObjectURL(formData.profileImage)}
              alt="profile photo"
              style={{ maxWidth: "80px" }}
            />
          )}

            {message && <p style={{ color: 'red' }}>{message}</p>}
            <button type="submit" disabled={!passwordMatch}>
              REGISTER
            </button>
          </form>
        )}

        {stage === 'verify' && (
          <form className="register_content_form" onSubmit={handleVerifyOtp}>
            <h3>Enter the 6-digit code sent to your email</h3>
            <input
              placeholder="Enter OTP"
              name="otp"
              value={otpValue}
              onChange={(e) => setOtpValue(e.target.value)}
              required
            />
            {message && <p style={{ color: 'red' }}>{message}</p>}
            <button type="submit">Verify Account</button>
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
        )}
        <a href="/login">Already have an account? Log In Here</a>
      </div>
    </div>
  );
};

export default RegisterPage;
