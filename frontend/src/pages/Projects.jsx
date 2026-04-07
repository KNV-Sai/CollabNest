import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import API from "../api/axios";
import "../styles/Dashboard.css";

function Projects() {
  const [activeItem, setActiveItem] = useState("Projects");
  const [userInfo, setUserInfo] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserInfo();
    fetchProjects();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const res = await API.get("/users/me");
      setUserInfo(res.data);
    } catch (err) {
      console.error("Error fetching user info:", err);
    }
  };

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await API.get("/api/projects");
      setProjects(response.data || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setMessage("Failed to load projects");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Project name is required";
    } else if (formData.name.length < 3) {
      newErrors.name = "Project name must be at least 3 characters";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await API.post("/api/projects", {
        name: formData.name,
        description: formData.description,
      });

      setMessage("✅ Project created successfully!");
      setMessageType("success");
      setFormData({ name: "", description: "" });
      setShowForm(false);
      
      setTimeout(() => setMessage(""), 3000);
      fetchProjects();
    } catch (error) {
      console.error("Error creating project:", error);
      setMessage("❌ Failed to create project. Please try again.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="dashboard-wrapper">
      <Sidebar activeItem={activeItem} onSelect={setActiveItem} userInfo={userInfo} />

      <div className="dashboard-container">
        <Navbar title={activeItem} onLogout={handleLogout} userInfo={userInfo} />

        <main className="dashboard-main">
          <section className="dashboard-header">
            <h2>Projects</h2>
            <button
              className="new-project-btn"
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? "✕ Cancel" : "+ New Project"}
            </button>
          </section>

          {message && (
            <div className={`message-banner ${messageType}`}>
              <p>{message}</p>
            </div>
          )}

          {showForm && (
            <section className="form-section">
              <h3>Create New Project</h3>
              <form onSubmit={handleSubmit} className="project-form" noValidate>
                <div className="form-group">
                  <label htmlFor="name">Project Name</label>
                  <input
                    id="name"
                    className={`form-input ${errors.name ? "input-error" : ""}`}
                    type="text"
                    name="name"
                    placeholder="e.g., Website Redesign"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                  {errors.name && <span className="error-message">{errors.name}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    className={`form-input ${errors.description ? "input-error" : ""}`}
                    name="description"
                    placeholder="Describe your project..."
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="4"
                  />
                  {errors.description && <span className="error-message">{errors.description}</span>}
                </div>

                <div className="form-actions">
                  <button
                    type="submit"
                    className="submit-btn"
                    disabled={loading}
                  >
                    {loading ? "Creating..." : "Create Project"}
                  </button>
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </section>
          )}

          {loading && projects.length === 0 ? (
            <div className="loading-state">
              <p>⏳ Loading projects...</p>
            </div>
          ) : projects.length === 0 ? (
            <section className="empty-state">
              <div className="empty-icon">📁</div>
              <h3>No Projects Yet</h3>
              <p>Create your first project to get started with collaboration</p>
              <button
                className="cta-button"
                onClick={() => setShowForm(true)}
              >
                Create Your First Project
              </button>
            </section>
          ) : (
            <section className="projects-section">
              <h3>Your Projects ({projects.length})</h3>
              <div className="projects-grid">
                {projects.map((project) => {
                  const totalTasks = project.tasks ? project.tasks.length : 0;
                  const completedTasks = project.tasks
                    ? project.tasks.filter((t) => t.status === "COMPLETED").length
                    : 0;
                  const completionPercentage = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

                  return (
                    <div key={project.id} className="project-card">
                      <div className="project-header">
                        <h4>{project.name}</h4>
                        <span className="project-status">Active</span>
                      </div>
                      <p className="project-description">{project.description}</p>

                      <div className="project-stats">
                        <span>📋 {totalTasks} tasks</span>
                        <span>✅ {completedTasks} completed</span>
                      </div>

                      {totalTasks > 0 && (
                        <div className="progress-bar">
                          <div className="progress-fill" style={{ width: `${completionPercentage}%` }}></div>
                        </div>
                      )}
                      <p className="progress-text">{completionPercentage}% complete</p>
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

export default Projects;
