import React, { useState, useEffect } from "react";
import "../styles/Login.css";
import { setLogin } from "../redux/state";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";


const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // For error message display

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const successFromNav = location.state?.message || "";
  const [transientMessage, setTransientMessage] = useState(successFromNav || '');

  useEffect(() => {
    setTransientMessage(successFromNav || '');
    if (successFromNav) {
      const t = setTimeout(() => setTransientMessage(''), 2500);
      return () => clearTimeout(t);
    }
  }, [successFromNav]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear old errors

    try {
      const response = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        // Show backend error message (coerce to string to avoid rendering issues)
        setError(String(data?.message || "Login failed"));
        return;
      }

      // Successful login
      dispatch(
        setLogin({
          user: data.user,
          token: data.token
        })
      );
      try {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      } catch (e) {}
      navigate("/");

    } catch (err) {
      setError(String(err?.message || "Server error, please try again."));
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="login">
      <div className="login_content">
        <form className="login_content_form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {transientMessage && <p style={{ color: "green" }}>{transientMessage}</p>}
          {error && <p style={{ color: "red" }}>{typeof error === 'string' ? error : JSON.stringify(error)}</p>}

          <button type="submit">LOG IN</button>
        </form>
        <div style={{ marginTop: 12 }}>
          <a href="/register">Don't have an account? Sign In Here</a>
        </div>
        <div style={{ marginTop: 6 }}>
          <a href="/forgot-password">Forgot Password?</a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
