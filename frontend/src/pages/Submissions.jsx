import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth-context";
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
  const [projects, setProjects] = useState([]);
  const [submitForm, setSubmitForm] = useState({
    projectId: "",
    title: "",
    description: "",
    submissionUrl: "",
  });
  const [reviewForms, setReviewForms] = useState({});
  const [actionMessage, setActionMessage] = useState("");
  const [actionType, setActionType] = useState("info");
  const { logout, isTeacher } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserInfo();
    fetchSubmissions();
    if (!isTeacher()) {
      fetchMyProjects();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      const endpoint = isTeacher() ? "/submissions" : "/submissions/user/me";
      const response = await API.get(endpoint);
      setSubmissions(response.data || []);
    } catch (error) {
      console.error("Error fetching submissions:", error);
      setSubmissions([]);
      setError("Could not load submissions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchMyProjects = async () => {
    try {
      const response = await API.get("/projects/my-projects");
      setProjects(response.data || []);
    } catch (err) {
      console.error("Error loading projects for submission:", err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const normalizeSubmissionForReview = (submission) => ({
    status: submission.status || "PENDING",
    feedback: submission.feedback || "",
    grade: submission.grade ?? "",
  });

  const getReviewForm = (submission) => {
    return reviewForms[submission.id] || normalizeSubmissionForReview(submission);
  };

  const updateReviewForm = (submissionId, field, value) => {
    setReviewForms((prev) => ({
      ...prev,
      [submissionId]: {
        ...(prev[submissionId] || {}),
        [field]: value,
      },
    }));
  };

  const handleCreateSubmission = async (e) => {
    e.preventDefault();
    setActionMessage("");
    setActionType("info");
    try {
      await API.post("/submissions/my", {
        ...submitForm,
        projectId: String(submitForm.projectId),
      });
      setActionMessage("Submission sent successfully.");
      setActionType("success");
      setSubmitForm({ projectId: "", title: "", description: "", submissionUrl: "" });
      await fetchSubmissions();
    } catch (err) {
      const msg =
        typeof err.response?.data === "string"
          ? err.response.data
          : "Could not submit your work.";
      setActionMessage(msg);
      setActionType("error");
    }
  };

  const handleReviewSubmission = async (submissionId) => {
    const form = reviewForms[submissionId];
    if (!form) return;
    setActionMessage("");
    setActionType("info");
    try {
      await API.put(`/submissions/${submissionId}/review`, form);
      setActionMessage("Submission reviewed successfully.");
      setActionType("success");
      await fetchSubmissions();
    } catch (err) {
      const msg =
        typeof err.response?.data === "string"
          ? err.response.data
          : "Could not review this submission.";
      setActionMessage(msg);
      setActionType("error");
    }
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

  const gradedSubmissions = submissions.filter((s) => typeof s.grade === "number");
  const averageGrade = gradedSubmissions.length
    ? (gradedSubmissions.reduce((sum, s) => sum + s.grade, 0) / gradedSubmissions.length).toFixed(1)
    : null;

  return (
    <div className="dashboard-wrapper">
      <Sidebar activeItem={activeItem} onSelect={setActiveItem} userInfo={userInfo} />

      <div className="dashboard-container">
        <Navbar title={activeItem} onLogout={handleLogout} userInfo={userInfo} />

        <main className="dashboard-main">
          <section className="dashboard-header">
            <h2>Submissions</h2>
            {isTeacher() && <p className="dashboard-intro">Review, grade, and guide student project submissions.</p>}
            {!isTeacher() && <p className="dashboard-intro">Submit milestones and track feedback from your teacher.</p>}
          </section>

          {actionMessage && (
            <section className={`message-banner ${actionType === "error" ? "error" : "success"}`}>
              <p>{actionMessage}</p>
            </section>
          )}

          {!isTeacher() && (
            <section className="form-section" style={{ marginBottom: "24px" }}>
              <h3>Submit Project Work</h3>
              <form className="project-form" onSubmit={handleCreateSubmission}>
                <div className="form-group">
                  <label htmlFor="submissionProject">Project</label>
                <select
                  id="submissionProject"
                  className="form-input"
                  value={submitForm.projectId}
                  onChange={(e) => setSubmitForm({ ...submitForm, projectId: e.target.value })}
                  required
                >
                  <option value="">Select Project</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
                </div>
                <div className="form-group">
                  <label htmlFor="submissionTitle">Title</label>
                <input
                  id="submissionTitle"
                  className="form-input"
                  type="text"
                  placeholder="Submission title"
                  value={submitForm.title}
                  onChange={(e) => setSubmitForm({ ...submitForm, title: e.target.value })}
                  required
                />
                </div>
                <div className="form-group">
                  <label htmlFor="submissionDescription">Description</label>
                <textarea
                  id="submissionDescription"
                  className="form-input"
                  placeholder="What did your team complete?"
                  value={submitForm.description}
                  onChange={(e) => setSubmitForm({ ...submitForm, description: e.target.value })}
                  style={{ minHeight: "90px" }}
                />
                </div>
                <div className="form-group">
                  <label htmlFor="submissionUrl">Submission URL</label>
                <input
                  id="submissionUrl"
                  className="form-input"
                  type="url"
                  placeholder="Submission link (Drive/GitHub/etc)"
                  value={submitForm.submissionUrl}
                  onChange={(e) => setSubmitForm({ ...submitForm, submissionUrl: e.target.value })}
                />
                </div>
                <button type="submit" className="submit-btn">Submit Work</button>
              </form>
            </section>
          )}

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

            <article className="summary-card">
              <div className="card-header">
                <span className="card-icon">📈</span>
                <p className="card-label">Average Grade</p>
              </div>
              <p className="card-value">{averageGrade ? `${averageGrade}%` : "-"}</p>
            </article>
          </section>

          {error ? (
            <section className="empty-state">
              <div className="empty-icon">⚠️</div>
              <h3>Unable to Load Submissions</h3>
              <p>{error}</p>
            </section>
          ) : submissions.length === 0 ? (
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
                    <div key={submission.id} className="submission-card" style={{ border: "1px solid #e5e9f2", borderRadius: "16px", padding: "20px", background: "#fff", boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)", marginBottom: "16px" }}>
                      <div className="submission-header">
                        <div>
                          <h4>{submission.project?.name || submission.projectName || "Project"}</h4>
                          <p className="submission-date">
                            📅 Submitted: {submission.submittedAt ? new Date(submission.submittedAt).toLocaleDateString() : "-"}
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
                            <p>{submission.submittedBy.name || submission.submittedBy.email || "-"}</p>
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

                      {isTeacher() && (
                        <div className="form-section" style={{ marginTop: "14px", marginBottom: 0, padding: "16px", borderRadius: "12px" }}>
                          <p style={{ marginBottom: "8px", fontWeight: 600 }}>Review & Grade</p>
                          <div className="project-form" style={{ gap: "12px" }}>
                            <select
                              className="form-input"
                              value={getReviewForm(submission).status}
                              onChange={(e) => updateReviewForm(submission.id, "status", e.target.value)}
                            >
                              <option value="PENDING">Pending</option>
                              <option value="APPROVED">Approved</option>
                              <option value="REJECTED">Rejected</option>
                            </select>
                            <textarea
                              className="form-input"
                              value={getReviewForm(submission).feedback}
                              onChange={(e) => updateReviewForm(submission.id, "feedback", e.target.value)}
                              placeholder="Feedback for student"
                              style={{ minHeight: "80px" }}
                            />
                            <input
                              className="form-input"
                              type="number"
                              min="0"
                              max="100"
                              step="0.5"
                              value={getReviewForm(submission).grade}
                              onChange={(e) => updateReviewForm(submission.id, "grade", e.target.value)}
                              placeholder="Grade (0-100)"
                            />
                            <button
                              className="submit-btn"
                              onClick={() => handleReviewSubmission(submission.id)}
                            >
                              Save Review
                            </button>
                          </div>
                        </div>
                      )}
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
