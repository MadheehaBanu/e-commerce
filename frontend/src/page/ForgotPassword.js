import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../style/forgotPassword.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    try {
      // Add your forgot password API call here
      // const data = await api.forgotPassword({ email });
      
      // Simulated success for now
      setSuccess("Password reset link has been sent to your email!");
      setEmail("");
    } catch (err) {
      setError("Failed to send reset link. Please try again.");
    }
  };

  return (
    <div className="forgot-password-container">
      <h2>Forgot Password?</h2>
      <p>Enter your email to receive a password reset link</p>
      
      {error && <p className="error-msg">{error}</p>}
      {success && <p className="success-msg">{success}</p>}
      
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

        <button type="submit">Send Reset Link</button>

        <div className="auth-links">
          <Link to="/login">Back to Login</Link>
          <span>|</span>
          <Link to="/signup">Sign Up</Link>
        </div>
      </form>
    </div>
  );
}

export default ForgotPassword;
