import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import API from "../api/axios";
import "../styles/Dashboard.css";

function Submissions() {
  const [activeItem, setActiveItem] = useState("Submissions");
  const [userInfo, setUserInfo] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserInfo();
    fetchSubmissions();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const res = await API.get("/users/me");
      setUserInfo(res.data);
    } catch (err) {
      console.error("Error fetching user info:", err);
    }
  };

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      setError("");
      // If endpoint doesn't exist, show empty state gracefully
      try {
        const response = await API.get("/api/submissions");
        setSubmissions(response.data || []);
      } catch (err) {
        // Endpoint might not exist yet, show empty state
        setSubmissions([]);
      }
    } catch (error) {
      console.error("Error fetching submissions:", error);
      setError("Failed to load submissions");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "submitted":
        return { bg: "#dbeafe", color: "#1e40af", label: "📤 Submitted" };
      case "approved":
        return { bg: "#dcfce7", color: "#15803d", label: "✅ Approved" };
      case "rejected":
        return { bg: "#fee2e2", color: "#991b1b", label: "❌ Rejected" };
      case "pending":
        return { bg: "#fef3c7", color: "#92400e", label: "⏳ Pending Review" };
      default:
        return { bg: "#f3f4f6", color: "#374151", label: "📋 " + (status || "Unknown") };
    }
  };

  if (loading) {
    return (
      <div className="dashboard-wrapper">
        <Sidebar activeItem={activeItem} onSelect={setActiveItem} userInfo={userInfo} />
        <div className="dashboard-container">
          <Navbar title={activeItem} onLogout={handleLogout} userInfo={userInfo} />
          <div className="loading-state">
            <p>⏳ Loading submissions...</p>
          </div>
        </div>
      </div>
    );
  }

  const stats = {
    total: submissions.length,
    approved: submissions.filter((s) => s.status?.toLowerCase() === "approved").length,
    pending: submissions.filter((s) => s.status?.toLowerCase() === "pending").length,
    rejected: submissions.filter((s) => s.status?.toLowerCase() === "rejected").length,
  };

  return (
    <div className="dashboard-wrapper">
      <Sidebar activeItem={activeItem} onSelect={setActiveItem} userInfo={userInfo} />

      <div className="dashboard-container">
        <Navbar title={activeItem} onLogout={handleLogout} userInfo={userInfo} />

        <main className="dashboard-main">
          {error && (
            <div className="error-banner">
              <p>⚠️ {error}</p>
            </div>
          )}

          <section className="dashboard-header">
            <h2>Submissions</h2>
          </section>

          {/* Submission Stats */}
          <section className="summary-cards">
            <article className="summary-card">
              <div className="card-header">
                <span className="card-icon">📤</span>
                <p className="card-label">Total Submissions</p>
              </div>
              <p className="card-value">{stats.total}</p>
            </article>

            <article className="summary-card">
              <div className="card-header">
                <span className="card-icon">✅</span>
                <p className="card-label">Approved</p>
              </div>
              <p className="card-value">{stats.approved}</p>
            </article>

            <article className="summary-card">
              <div className="card-header">
                <span className="card-icon">⏳</span>
                <p className="card-label">Under Review</p>
              </div>
              <p className="card-value">{stats.pending}</p>
            </article>

            <article className="summary-card">
              <div className="card-header">
                <span className="card-icon">❌</span>
                <p className="card-label">Rejected</p>
              </div>
              <p className="card-value">{stats.rejected}</p>
            </article>
          </section>

          {submissions.length === 0 ? (
            <section className="empty-state">
              <div className="empty-icon">📤</div>
              <h3>No Submissions</h3>
              <p>You haven't submitted any group work yet. Complete your projects and submit them here.</p>
            </section>
          ) : (
            <section className="submissions-section">
              <div className="submissions-list">
                {submissions.map((submission) => {
                  const badgeInfo = getStatusBadge(submission.status);
                  return (
                    <div key={submission.id} className="submission-card">
                      <div className="submission-header">
                        <div>
                          <h4>{submission.projectName || "Project"}</h4>
                          <p className="submission-date">
                            📅 Submitted: {new Date(submission.submittedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span
                          className="submission-status"
                          style={{ backgroundColor: badgeInfo.bg, color: badgeInfo.color }}
                        >
                          {badgeInfo.label}
                        </span>
                      </div>

                      <div className="submission-content">
                        {submission.description && (
                          <div>
                            <p className="label">Description:</p>
                            <p>{submission.description}</p>
                          </div>
                        )}

                        {submission.submittedBy && (
                          <div>
                            <p className="label">Submitted By:</p>
                            <p>{submission.submittedBy}</p>
                          </div>
                        )}

                        {submission.feedback && (
                          <div className="feedback-box">
                            <p className="label">Feedback:</p>
                            <p>{submission.feedback}</p>
                          </div>
                        )}

                        {submission.grade && (
                          <div className="grade-box">
                            <p className="label">Grade:</p>
                            <p className="grade-value">{submission.grade}</p>
                          </div>
                        )}
                      </div>

                      <div className="submission-footer">
                        {submission.submissionUrl && (
                          <a
                            href={submission.submissionUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="view-link"
                          >
                            📎 View Submission
                          </a>
                        )}
                        {submission.dueDate && (
                          <p className="due-date">
                            Due: {new Date(submission.dueDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

export default Submissions;
