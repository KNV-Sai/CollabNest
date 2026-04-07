import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import API from "../api/axios";
import "../styles/Dashboard.css";

function Projects() {
  const [activeItem, setActiveItem] = useState("Projects");
  const [userInfo, setUserInfo] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const { user, logout, isTeacher } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserInfo();
    fetchProjects();
    if (isTeacher()) {
      fetchStudents();
    }
  }, []);

  const fetchUserInfo = async () => {
    try {
      const res = await API.get("/users/me");
      setUserInfo(res.data);
    } catch (err) {
      console.error("Error fetching user info:", err);
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await API.get("/users");
      const studentList = res.data.filter((u) => u.role === "STUDENT");
      setStudents(studentList);
    } catch (err) {
      console.error("Error fetching students:", err);
    }
  };

  const fetchProjects = async () => {
    try {
      setLoading(true);
      let endpoint = isTeacher() ? "/projects" : "/projects/my-projects";
      const response = await API.get(endpoint);
      setProjects(response.data || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert("Project name is required");
      return;
    }

    setSubmitting(true);
    try {
      const newProject = {
        name: formData.name,
        description: formData.description,
      };

      const res = await API.post("/projects", newProject);
      setProjects([...projects, res.data]);
      setFormData({ name: "", description: "" });
      setShowCreateForm(false);
      alert("Project created successfully!");
    } catch (error) {
      console.error("Error creating project:", error);
      alert("Failed to create project");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="dashboard-wrapper">
        <Sidebar activeItem={activeItem} onSelect={setActiveItem} userInfo={userInfo} />
        <div className="dashboard-container">
          <Navbar title={activeItem} onLogout={handleLogout} userInfo={userInfo} />
          <div className="loading-state">
            <p>⏳ Loading projects...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-wrapper">
      <Sidebar activeItem={activeItem} onSelect={setActiveItem} userInfo={userInfo} />

      <div className="dashboard-container">
        <Navbar title={activeItem} onLogout={handleLogout} userInfo={userInfo} />

        <main className="dashboard-main">
          <section className="dashboard-header">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
              <h2>Projects</h2>
              {isTeacher() && (
                <button
                  onClick={() => setShowCreateForm(!showCreateForm)}
                  className="cta-button"
                  style={{ marginBottom: 0 }}
                >
                  {showCreateForm ? "Cancel" : "+ Create Project"}
                </button>
              )}
            </div>
          </section>

          {showCreateForm && (
            <section style={{ background: "#f9fafb", padding: "24px", borderRadius: "8px", marginBottom: "24px" }}>
              <h3 style={{ marginBottom: "16px" }}>Create New Project</h3>
              <form onSubmit={handleCreateProject}>
                <input
                  type="text"
                  placeholder="Project Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "12px",
                    marginBottom: "12px",
                    border: "1px solid #e5e7eb",
                    borderRadius: "6px",
                    fontSize: "1rem",
                  }}
                  required
                />
                <textarea
                  placeholder="Project Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "12px",
                    marginBottom: "12px",
                    border: "1px solid #e5e7eb",
                    borderRadius: "6px",
                    fontSize: "1rem",
                    minHeight: "100px",
                    fontFamily: "inherit",
                  }}
                />
                <button type="submit" className="auth-button" disabled={submitting}>
                  {submitting ? "Creating..." : "Create Project"}
                </button>
              </form>
            </section>
          )}

          {projects.length === 0 ? (
            <section className="empty-state">
              <div className="empty-icon">📁</div>
              <h3>{isTeacher() ? "No Projects Yet" : "No Assigned Projects"}</h3>
              <p>
                {isTeacher()
                  ? "Create your first project to get started!"
                  : "You haven't been assigned to any projects yet."}
              </p>
              {isTeacher() && (
                <button className="cta-button" onClick={() => setShowCreateForm(true)}>
                  Create Your First Project
                </button>
              )}
            </section>
          ) : (
            <section className="projects-section">
              <div className="projects-grid">
                {projects.map((project) => {
                  const totalTasks = project.tasks ? project.tasks.length : 0;
                  const completedTasks = project.tasks
                    ? project.tasks.filter((t) => t.status === "COMPLETED").length
                    : 0;
                  const completionPercentage =
                    totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

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
