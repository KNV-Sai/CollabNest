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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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
      setError("");
      const response = await API.get("/api/projects");
      setProjects(response.data || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setError("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
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
          {error && (
            <div className="error-banner">
              <p>⚠️ {error}</p>
            </div>
          )}

          <section className="dashboard-header">
            <h2>Projects</h2>
          </section>

          {loading ? (
            <div className="loading-state">
              <p>⏳ Loading projects...</p>
            </div>
          ) : projects.length === 0 ? (
            <section className="empty-state">
              <div className="empty-icon">📁</div>
              <h3>No Projects</h3>
              <p>You haven't been assigned to any projects yet. Check back later!</p>
            </section>
          ) : (
            <section className="projects-section">
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
