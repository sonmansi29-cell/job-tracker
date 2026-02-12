import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

function Settings() {
  const [user, setUser] = useState({ username: "", email: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState("profile");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) {
      navigate("/");
      return;
    }

    API.get("profile/")
      .then((res) => {
        setUser(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch profile:", err);
        if (err.response?.status === 401) {
          localStorage.removeItem("access");
          navigate("/");
        }
        setLoading(false);
      });
  }, [navigate]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const res = await API.put("profile/", {
        username: user.username,
        email: user.email,
      });
      setSuccess("Profile updated successfully!");
      setUser(res.data.user);
    } catch (error) {
      console.error("Profile update failed:", error);
      const errors = error.response?.data;
      if (errors) {
        const errorMessages = Object.values(errors).flat();
        setError(errorMessages.join(", "));
      } else {
        setError("Failed to update profile. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account? This action cannot be undone and all your job data will be permanently deleted.")) {
      return;
    }

    const confirmText = prompt("Please type 'DELETE' to confirm account deletion:");
    if (confirmText !== "DELETE") {
      return;
    }

    try {
      await API.delete("profile/");
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      navigate("/");
    } catch (error) {
      console.error("Account deletion failed:", error);
      setError("Failed to delete account. Please try again.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="login-container">
        <div className="login-box">
          <div className="login-header">
            <p>Loading settings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-box settings-box">
        <div className="settings-header">
          <h1>Settings</h1>
        </div>

        <div className="settings-nav">
          <button
            className={`settings-nav-btn ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            Profile
          </button>
          <button
            className={`settings-nav-btn ${activeTab === "account" ? "active" : ""}`}
            onClick={() => setActiveTab("account")}
          >
            Account
          </button>
          <button
            className={`settings-nav-btn ${activeTab === "data" ? "active" : ""}`}
            onClick={() => setActiveTab("data")}
          >
            Data
          </button>
        </div>

        {error && <div className="login-error">{error}</div>}
        {success && <div className="login-success">{success}</div>}

        {activeTab === "profile" && (
          <form className="login-form" onSubmit={handleProfileUpdate}>
            <label className="form-label">Username</label>
            <input
              type="text"
              value={user.username}
              onChange={(e) => setUser({ ...user, username: e.target.value })}
              className="login-input"
              required
              minLength={3}
            />
            <label className="form-label">Email</label>
            <input
              type="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              className="login-input"
              required
            />
            <button type="submit" className="login-btn" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        )}

        {activeTab === "account" && (
          <div className="settings-section">
            <h3>Security</h3>
            <p className="settings-info">
              Password management is handled through the forgot password flow.
              Click "Forgot Password?" on the login page to reset your password.
            </p>
            
            <h3>Sign Out</h3>
            <button onClick={handleLogout} className="logout-settings-btn">
              Sign Out of Job Tracker
            </button>
          </div>
        )}

        {activeTab === "data" && (
          <div className="settings-section">
            <h3>Delete Account</h3>
            <p className="settings-warning">
              Warning: This will permanently delete your account and all associated job applications. This action cannot be undone.
            </p>
            <button onClick={handleDeleteAccount} className="delete-account-btn">
              Delete My Account
            </button>
          </div>
        )}

        <div className="settings-footer">
          <button onClick={() => navigate("/dashboard")} className="back-btn">
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default Settings;

