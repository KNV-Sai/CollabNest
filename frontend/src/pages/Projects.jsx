import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth-context";
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
  const [submitting, setSubmitting] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isProjectOpen, setIsProjectOpen] = useState(false);
  const [studentEmail, setStudentEmail] = useState("");
  const [assigningStudent, setAssigningStudent] = useState(false);
  const [assignMessage, setAssignMessage] = useState("");
  const [assignMessageType, setAssignMessageType] = useState("info");
  const { logout, isTeacher } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserInfo();
    fetchProjects();
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

  const fetchProjects = async () => {
    try {
      setLoading(true);
      let endpoint = isTeacher() ? "/projects" : "/projects/my-projects";
      const response = await API.get(endpoint);
      const projectList = response.data || [];
      setProjects(projectList);
      return projectList;
    } catch (error) {
      console.error("Error fetching projects:", error);
      return [];
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

  const handleOpenProject = (project) => {
    setSelectedProject(project);
    setIsProjectOpen(true);
    setAssignMessage("");
    setStudentEmail("");
  };

  const handleCloseProject = () => {
    setIsProjectOpen(false);
    setSelectedProject(null);
    setAssignMessage("");
    setAssignMessageType("info");
    setStudentEmail("");
  };

  const handleViewProjectTasks = (projectId) => {
    navigate(`/tasks?projectId=${projectId}`);
  };

  const handleAssignStudentByEmail = async (e) => {
    e.preventDefault();
    const email = studentEmail.trim();
    if (!email || !selectedProject) return;

    setAssigningStudent(true);
    setAssignMessage("");
    setAssignMessageType("info");
    try {
      await API.post(`/projects/${selectedProject.id}/assign-student-by-email`, { email });
      setAssignMessage("Student assigned successfully.");
      setAssignMessageType("success");
      setStudentEmail("");

      const updatedProjects = await fetchProjects();
      const refreshed = updatedProjects.find((p) => p.id === selectedProject.id);
      if (refreshed) {
        setSelectedProject(refreshed);
      }
    } catch (error) {
      const message =
        typeof error.response?.data === "string"
          ? error.response.data
          : "Could not assign student. Check email and try again.";
      setAssignMessage(message);
      setAssignMessageType("error");
    } finally {
      setAssigningStudent(false);
    }
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
          ) : !isProjectOpen ? (
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
                    <div
                      key={project.id}
                      className="project-card"
                      onClick={() => handleOpenProject(project)}
                      style={{ cursor: "pointer" }}
                    >
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
                      <p className="card-meta" style={{ marginTop: "8px" }}>
                        Click to open project
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>
          ) : (
            selectedProject && (
              <section className="projects-section">
                <div
                  style={{
                    marginTop: "12px",
                    background: "#ffffff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "10px",
                    padding: "20px",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                    <h3 style={{ marginBottom: "8px" }}>{selectedProject.name}</h3>
                    <button className="cta-button" onClick={handleCloseProject}>← Back to all projects</button>
                  </div>
                  <p style={{ color: "#4b5563", marginBottom: "12px" }}>
                    {selectedProject.description || "No description provided."}
                  </p>
                  <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
                    <span>📋 Tasks: {selectedProject.tasks?.length || 0}</span>
                    <span>👥 Students: {selectedProject.users?.length || 0}</span>
                  </div>

                  {selectedProject.users?.length > 0 && (
                    <div style={{ marginTop: "14px" }}>
                      <p style={{ marginBottom: "6px", color: "#374151" }}>Assigned Students:</p>
                      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                        {selectedProject.users.map((u) => (
                          <span key={u.id} style={{ background: "#f3f4f6", borderRadius: "999px", padding: "6px 10px", fontSize: "0.9rem" }}>
                            {u.email}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div style={{ marginTop: "16px" }}>
                    <button
                      className="cta-button"
                      onClick={() => handleViewProjectTasks(selectedProject.id)}
                    >
                      Open Project Tasks
                    </button>
                  </div>

                  {isTeacher() && (
                    <form onSubmit={handleAssignStudentByEmail} style={{ marginTop: "20px" }}>
                      <h4 style={{ marginBottom: "8px" }}>Assign Student by Email</h4>
                      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                        <input
                          type="email"
                          placeholder="student@example.com"
                          value={studentEmail}
                          onChange={(e) => setStudentEmail(e.target.value)}
                          required
                          style={{
                            flex: "1 1 260px",
                            padding: "10px",
                            border: "1px solid #d1d5db",
                            borderRadius: "6px",
                          }}
                        />
                        <button type="submit" className="cta-button" disabled={assigningStudent}>
                          {assigningStudent ? "Assigning..." : "Assign Student"}
                        </button>
                      </div>
                      {assignMessage && (
                        <p
                          style={{
                            marginTop: "10px",
                            color: assignMessageType === "error" ? "#b91c1c" : "#166534",
                            background: assignMessageType === "error" ? "#fee2e2" : "#dcfce7",
                            padding: "8px 10px",
                            borderRadius: "6px",
                          }}
                        >
                          {assignMessage}
                        </p>
                      )}
                    </form>
                  )}
                </div>
              </section>
            )
          )}
        </main>
      </div>
    </div>
  );
}

export default Projects;
