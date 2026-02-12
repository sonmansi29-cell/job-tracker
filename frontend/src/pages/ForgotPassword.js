import React, { useState } from "react";
import { Link } from "react-router-dom";
import API from "../api";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [resetLink, setResetLink] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResetLink("");

    try {
      const res = await API.post("password-reset/", { email });
      setSuccess(true);
      // In production, this would be sent via email
      if (res.data.reset_link) {
        setResetLink(res.data.reset_link);
      }
    } catch (error) {
      console.error("Password reset request failed:", error);
      setSuccess(true); // Show success anyway to prevent email enumeration
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="login-container">
        <div className="login-box">
          <div className="login-header">
            <div className="success-icon">✓</div>
            <h1>Check Your Email</h1>
            <p>
              {resetLink
                ? "For demo purposes, here's your reset link:"
                : "If an account with that email exists, we've sent you a password reset link."}
            </p>
          </div>
          
          {resetLink && (
            <div className="reset-link-box">
              <a href={resetLink} className="reset-link-btn">
                Click here to reset password
              </a>
              <p className="reset-link-demo">
                Demo link: {resetLink}
              </p>
            </div>
          )}
          
          <div className="login-footer">
            <p>
              <Link to="/">← Back to Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h1>Forgot Password?</h1>
          <p>Enter your email and we'll send you a reset link</p>
        </div>

        {error && <div className="login-error">{error}</div>}

        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="login-input"
            required
          />
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <div className="login-footer">
          <p>
            Remember your password? <Link to="/">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;

