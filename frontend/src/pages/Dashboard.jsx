import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth-context";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import API from "../api/axios";
import "../styles/Dashboard.css";

function Dashboard() {
  const [activeItem, setActiveItem] = useState("Dashboard");
  const [userInfo, setUserInfo] = useState(null);
  const [stats, setStats] = useState({
    totalProjects: 0,
    tasksAssigned: 0,
    completedTasks: 0,
    ongoingTasks: 0,
  });
  const [recentProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { logout, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Wait for AuthProvider to finish loading
    if (!authLoading) {
      fetchDashboardData();
    }
  }, [authLoading]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch user info
      const userRes = await API.get("/users/me");
      setUserInfo(userRes.data);

      // Fetch projects - filtered by user
      const projectsRes = await API.get("/projects/my-projects");
      const projects = projectsRes.data || [];

      // Calculate stats
      let totalTasks = 0;
      let completedTasks = 0;

      projects.forEach((project) => {
        if (project.tasks) {
          totalTasks += project.tasks.length;
          completedTasks += project.tasks.filter(
            (task) => task.status === "COMPLETED"
          ).length;
        }
      });

      setStats({
        totalProjects: projects.length,
        tasksAssigned: totalTasks,
        completedTasks: completedTasks,
        ongoingTasks: totalTasks - completedTasks,
      });

      setRecentProjects(projects.slice(0, 3));
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getCompletionPercentage = () => {
    if (stats.tasksAssigned === 0) return 0;
    return Math.round((stats.completedTasks / stats.tasksAssigned) * 100);
  };

  if (authLoading || loading) {
    return (
      <div className="dashboard-wrapper">
        <Sidebar activeItem={activeItem} onSelect={setActiveItem} userInfo={userInfo} />
        <div className="dashboard-container">
          <Navbar title={activeItem} onLogout={handleLogout} userInfo={userInfo} />
          <div className="loading-state">
            <p>⏳ Loading your dashboard...</p>
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
            <h2>Dashboard</h2>
          </section>

          <section className="summary-cards">
            <article className="summary-card">
              <div className="card-header">
                <span className="card-icon">📁</span>
                <p className="card-label">Active Projects</p>
              </div>
              <p className="card-value">{stats.totalProjects}</p>
              {stats.totalProjects > 0 && (
                <p className="card-meta">{stats.totalProjects} project{stats.totalProjects !== 1 ? "s" : ""} in progress</p>
              )}
            </article>

            <article className="summary-card">
              <div className="card-header">
                <span className="card-icon">✅</span>
                <p className="card-label">Completed Tasks</p>
              </div>
              <p className="card-value">{stats.completedTasks}</p>
              {stats.tasksAssigned > 0 && (
                <p className="card-meta">{getCompletionPercentage()}% completion</p>
              )}
            </article>

            <article className="summary-card">
              <div className="card-header">
                <span className="card-icon">⏳</span>
                <p className="card-label">In Progress</p>
              </div>
              <p className="card-value">{stats.ongoingTasks}</p>
              {stats.ongoingTasks > 0 && (
                <p className="card-meta">{stats.ongoingTasks} task{stats.ongoingTasks !== 1 ? "s" : ""} remaining</p>
              )}
            </article>

            <article className="summary-card">
              <div className="card-header">
                <span className="card-icon">🎯</span>
                <p className="card-label">Total Tasks</p>
              </div>
              <p className="card-value">{stats.tasksAssigned}</p>
              {stats.tasksAssigned > 0 && (
                <p className="card-meta">across all projects</p>
              )}
            </article>
          </section>

          {recentProjects.length > 0 && (
            <section className="recent-section">
              <div className="section-header">
                <h3>Recent Projects</h3>
                <button
                  className="view-all-link"
                  onClick={() => navigate("/projects")}
                >
                  View All →
                </button>
              </div>

              <div className="recent-grid">
                {recentProjects.map((project) => (
                  <div key={project.id} className="recent-card">
                    <div className="card-top">
                      <h4>{project.name}</h4>
                      <span className="status-badge">Active</span>
                    </div>
                    <p className="card-description">
                      {project.description || "No description provided"}
                    </p>
                    <div className="card-stats">
                      <span>📋 {project.tasks ? project.tasks.length : 0} tasks</span>
                      <span>✅ {project.tasks ? project.tasks.filter(t => t.status === "COMPLETED").length : 0} done</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {stats.totalProjects === 0 && (
            <section className="empty-state">
              <div className="empty-icon">📋</div>
              <h3>No Projects Yet</h3>
              <button
                className="cta-button"
                onClick={() => navigate("/projects")}
              >
                View Projects
              </button>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
