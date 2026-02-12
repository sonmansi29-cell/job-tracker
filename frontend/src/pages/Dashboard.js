import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";
import AddJob from "./AddJob";
import EditJob from "./EditJob";
import StatusDonut from "../components/StatusDonut";
import NotesPanel from "../components/NotesPanel";
import { FiEdit3, FiTrash2, FiSettings } from "react-icons/fi";

function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingJob, setEditingJob] = useState(null);
  const [notesOpen, setNotesOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // D-Day State
  const [dDayTitle, setDDayTitle] = useState("");
  const [dDayDate, setDDayDate] = useState("");
  const [dDays, setDDays] = useState([]);

  // Load D-Days from localStorage on mount
  useEffect(() => {
    const savedDDays = localStorage.getItem("dDays");
    if (savedDDays) {
      try {
        setDDays(JSON.parse(savedDDays));
      } catch (e) {
        console.error("Failed to parse D-Days:", e);
      }
    }
  }, []);

  // Fetch user profile
  useEffect(() => {
    API.get("profile/")
      .then((res) => setUser(res.data))
      .catch((err) => console.error("Failed to fetch profile:", err));
  }, []);

  // Calculate days remaining from today
  const calculateDaysLeft = (date) => {
    const today = new Date();
    const target = new Date(date);
    today.setHours(0, 0, 0, 0);
    target.setHours(0, 0, 0, 0);
    const diffTime = target - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Handle add D-Day
  const handleAddDDay = () => {
    if (!dDayTitle || !dDayDate) return;
    
    const days = calculateDaysLeft(dDayDate);
    const newDDay = {
      id: Date.now(),
      title: dDayTitle,
      date: dDayDate,
      daysLeft: days
    };
    
    const updatedDDays = [...dDays, newDDay];
    setDDays(updatedDDays);
    localStorage.setItem("dDays", JSON.stringify(updatedDDays));
    
    // Reset inputs
    setDDayTitle("");
    setDDayDate("");
  };

  // Handle delete D-Day
  const handleDeleteDDay = (id) => {
    const updatedDDays = dDays.filter(d => d.id !== id);
    setDDays(updatedDDays);
    localStorage.setItem("dDays", JSON.stringify(updatedDDays));
  };

  // Get urgency class based on days left
  const getUrgencyClass = (daysLeft) => {
    if (daysLeft < 0) return "expired";
    if (daysLeft < 3) return "urgent";
    if (daysLeft < 7) return "warning";
    return "normal";
  };

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) {
      navigate("/");
      return;
    }
    
    API.get("job-apps/")
      .then((res) => {
        setJobs(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch jobs:", err);
        if (err.response && err.response.status === 401) {
          localStorage.removeItem("access");
          localStorage.removeItem("refresh");
          navigate("/");
        } else {
          setError("Failed to load job applications");
        }
        setLoading(false);
      });
  }, [navigate]);

  const handleJobAdded = (job) => {
    setJobs([job, ...jobs]);
  };

  const handleDelete = async (id) => {
    await API.delete(`job-apps/${id}/`);
    setJobs(jobs.filter((job) => job.id !== id));
  };

  const handleUpdated = (updatedJob) => {
    setJobs(jobs.map((j) => (j.id === updatedJob.id ? updatedJob : j)));
    setEditingJob(null);
  };

  const handleLogout = () => {
    setShowLogoutModal(false);
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/");
  };

  // helper: compute counts
  const computeCounts = (jobsList) => {
    const base = { Applied: 0, Interview: 0, Offer: 0, Rejected: 0 };
    jobsList.forEach((j) => {
      // normalize status variants
      const st = (j.status || "").toString().toLowerCase();
      if (st.startsWith("apply") || st === "applied") base.Applied += 1;
      else if (st.startsWith("inter")) base.Interview += 1;
      else if (st.startsWith("offer") || st === "offered") base.Offer += 1;
      else if (st.startsWith("reject")) base.Rejected += 1;
      else base.Applied += 1;
    });
    return base;
  };

  const counts = computeCounts(jobs);

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading your job applications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error-state">
          <h3>⚠️ Oops!</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const getStatusClass = (status) => {
    switch (status) {
      case "Applied": return "status-applied";
      case "Interview": return "status-interview";
      case "Offer": return "status-offer";
      case "Rejected": return "status-rejected";
      default: return "status-applied";
    }
  };

  return (
    <div className="container">
      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Sign Out</h3>
            <p>Are you sure you want to sign out?</p>
            <div className="modal-actions">
              <button onClick={() => setShowLogoutModal(false)} className="btn-cancel">
                Cancel
              </button>
              <button onClick={handleLogout} className="btn-delete">
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      <header className="dashboard-header">
        <div className="header-left">
          <span className="header-icon">📋</span>
          <h1>Job Applications</h1>
        </div>

        <div className="header-center">
          <div className="stat">
            <strong>{jobs.length}</strong>
            <span>TOTAL</span>
          </div>
          <div className="stat">
            <strong>{counts.Applied}</strong>
            <span>APPLIED ({jobs.length > 0 ? ((counts.Applied / jobs.length) * 100).toFixed(0) : 0}%)</span>
          </div>
          <div className="stat">
            <strong>{counts.Interview}</strong>
            <span>INTERVIEW ({jobs.length > 0 ? ((counts.Interview / jobs.length) * 100).toFixed(0) : 0}%)</span>
          </div>
          <div className="stat">
            <strong>{counts.Offer}</strong>
            <span>OFFERS ({jobs.length > 0 ? ((counts.Offer / jobs.length) * 100).toFixed(0) : 0}%)</span>
          </div>
          <div className="stat">
            <strong>{counts.Rejected}</strong>
            <span>REJECTED ({jobs.length > 0 ? ((counts.Rejected / jobs.length) * 100).toFixed(0) : 0}%)</span>
          </div>
        </div>

        <div className="header-right">
          <Link to="/settings" className="settings-btn">
            <FiSettings size={18} />
            <span>Settings</span>
          </Link>
          <button className="notes-btn" onClick={() => setNotesOpen(true)}>✏️ Notes</button>
          <button className="logout-btn" onClick={() => setShowLogoutModal(true)}>Logout</button>
        </div>
      </header>

      <NotesPanel open={notesOpen} onClose={() => setNotesOpen(false)} />

      <div className="content">
        {/* D-Day Section */}
        <div className="dday-section">
          <div className="dday-input-card">
            <h3>📅 Add D-Day</h3>
            <div className="dday-input-row">
              <input
                type="text"
                placeholder="Title (e.g. Interview Day)"
                value={dDayTitle}
                onChange={(e) => setDDayTitle(e.target.value)}
                className="form-input"
              />
              <input
                type="date"
                value={dDayDate}
                onChange={(e) => setDDayDate(e.target.value)}
                className="form-input"
              />
              <button onClick={handleAddDDay} className="btn-primary">
                Add D-Day
              </button>
            </div>
          </div>

          {dDays.length > 0 && (
            <div className="dday-tiles">
              {dDays.map((dday) => (
                <div key={dday.id} className={`dday-tile ${getUrgencyClass(dday.daysLeft)}`}>
                  <div className="dday-left">
                    <h4>{dday.title}</h4>
                    <span>📅 {dday.date}</span>
                  </div>
                  <div className="dday-right">
                    {dday.daysLeft >= 0 ? `D-${dday.daysLeft}` : "Expired"}
                  </div>
                  <button 
                    className="dday-delete"
                    onClick={() => handleDeleteDDay(dday.id)}
                    title="Delete D-Day"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="form-section">
          <h3>➕ Add New Job</h3>
          <AddJob onJobAdded={handleJobAdded} />
        </div>

        {editingJob && (
          <div className="form-section">
            <h3>✏️ Edit Job</h3>
            <EditJob
              job={editingJob}
              onCancel={() => setEditingJob(null)}
              onUpdated={handleUpdated}
            />
          </div>
        )}

        <div className="jobs-and-chart-container">
          <div className="jobs-column">
            <h3 style={{ marginBottom: "20px", color: "#1e293b", fontSize: "20px", lineHeight: "1.4" }}>
              📝 Your Jobs
            </h3>

            {jobs.length === 0 ? (
              <div className="empty-state">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3>No jobs yet</h3>
                <p>Start by adding your first job application above!</p>
              </div>
            ) : (
              <div className="job-list">
                {jobs.map((job) => (
                  <div key={job.id} className="job-card">
                    <div className="job-info">
                      <div className="job-company">{job.company}</div>
                      <div className="job-position">{job.position}</div>
                      <span className={`job-status ${getStatusClass(job.status)}`}>
                        {job.status}
                      </span>
                    </div>
                    <div className="job-actions">
                      <button className="btn-edit" onClick={() => setEditingJob(job)}>
                        Edit
                      </button>
                      <button className="btn-delete" onClick={() => handleDelete(job.id)}>
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Donut Chart - Right Column */}
          {jobs.length > 0 && (
            <div className="chart-column">
              <div className="chart-sidebar">
                <h4 style={{ marginBottom: "20px", color: "#1e293b", fontSize: "16px", textAlign: "center", lineHeight: "1.4" }}>
                  📊 Status
                </h4>
                <StatusDonut counts={counts} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

