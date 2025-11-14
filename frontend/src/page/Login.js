import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useNotification } from "../components/NotificationContainer";
import api from "../api";
import "../style/login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await api.login({ email, password });
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        window.dispatchEvent(new Event('authChanged'));
        window.dispatchEvent(new Event('cartUpdated'));
        showNotification('Login successful!', 'success');
        // Redirect admin to dashboard, regular users to home
        if (data.user.isAdmin) {
          navigate('/admin/dashboard');
        } else {
          navigate('/');
        }
      } else {
        showNotification(data.message || 'Login failed', 'error');
      }
    } catch (err) {
      showNotification('Login failed. Please try again.', 'error');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input 
            type="email" 
            id="email" 
            placeholder="Enter your email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input 
            type="password" 
            id="password" 
            placeholder="Enter your password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit">Login</button>

        <div className="forgot-link">
          <Link to="/forgot-password">Forgot Password?</Link>
        </div>

        <div className="auth-links">
          <span>Don't have an account?</span>
          <Link to="/signup">Sign Up</Link>
        </div>
      </form>
    </div>
  );
}

export default Login;
