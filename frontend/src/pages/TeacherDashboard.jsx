import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth-context";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import API from "../api/axios";
import "../styles/Dashboard.css";

function TeacherDashboard() {
  const [activeItem, setActiveItem] = useState("Dashboard");
  const [userInfo, setUserInfo] = useState(null);
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalStudents: 0,
    pendingSubmissions: 0,
    totalTasks: 0,
  });
  const [recentProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logout, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Wait for AuthProvider to finish loading
    if (!authLoading) {
      if (!user || user.role !== "ADMIN") {
        navigate("/dashboard");
        return;
      }
      fetchDashboardData();
      setActiveItem("Dashboard");
    }
  }, [user, authLoading, navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch user info
      const userRes = await API.get("/users/me");
      setUserInfo(userRes.data);

      // Fetch all projects (teacher's projects)
      const projectsRes = await API.get("/projects");
      const projects = projectsRes.data || [];

      // Fetch all users (students)
      const usersRes = await API.get("/users");
      const students = usersRes.data.filter((u) => u.role === "STUDENT") || [];

      // Fetch all submissions
      const submissionsRes = await API.get("/submissions");
      const submissions = submissionsRes.data || [];
      const pending = submissions.filter((s) => s.status === "SUBMITTED").length;

      // Calculate total tasks
      let totalTasks = 0;
      projects.forEach((project) => {
        if (project.tasks) {
          totalTasks += project.tasks.length;
        }
      });

      setStats({
        totalProjects: projects.length,
        totalStudents: students.length,
        pendingSubmissions: pending,
        totalTasks,
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
        <Navbar title={`${activeItem} - Teacher Panel`} onLogout={handleLogout} userInfo={userInfo} />

        <main className="dashboard-main">
          <section className="dashboard-header">
            <h2>Teacher Dashboard</h2>
            <p style={{ color: "#6b7280", marginTop: "8px" }}>👨‍🏫 Manage projects, tasks, and review submissions</p>
          </section>

          <section className="summary-cards">
            <article className="summary-card">
              <div className="card-header">
                <span className="card-icon">📁</span>
                <p className="card-label">Projects Created</p>
              </div>
              <p className="card-value">{stats.totalProjects}</p>
            </article>

            <article className="summary-card">
              <div className="card-header">
                <span className="card-icon">👥</span>
                <p className="card-label">Students</p>
              </div>
              <p className="card-value">{stats.totalStudents}</p>
            </article>

            <article className="summary-card">
              <div className="card-header">
                <span className="card-icon">⏳</span>
                <p className="card-label">Pending Reviews</p>
              </div>
              <p className="card-value">{stats.pendingSubmissions}</p>
              {stats.pendingSubmissions > 0 && (
                <p className="card-meta" style={{ color: "#ef4444" }}>
                  {stats.pendingSubmissions} awaiting feedback
                </p>
              )}
            </article>

            <article className="summary-card">
              <div className="card-header">
                <span className="card-icon">✅</span>
                <p className="card-label">Total Tasks</p>
              </div>
              <p className="card-value">{stats.totalTasks}</p>
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
                  Manage All →
                </button>
              </div>

              <div className="recent-grid">
                {recentProjects.map((project) => (
                  <div key={project.id} className="recent-card">
                    <div className="card-top">
                      <h4>{project.name}</h4>
                    </div>
                    <p className="card-description">
                      {project.description || "No description"}
                    </p>
                    <div className="card-stats">
                      <span>📋 {project.tasks ? project.tasks.length : 0} tasks</span>
                      <span>👥 {project.users ? project.users.length : 0} students</span>
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
              <p>Start managing your student projects and assignments.</p>
              <button
                className="cta-button"
                onClick={() => navigate("/projects")}
              >
                Create Your First Project
              </button>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

export default TeacherDashboard;
