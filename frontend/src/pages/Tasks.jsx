import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import API from "../api/axios";
import "../styles/Dashboard.css";

function Tasks() {
  const [activeItem, setActiveItem] = useState("Tasks");
  const [userInfo, setUserInfo] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL"); // ALL, PENDING, COMPLETED
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserInfo();
    fetchTasks();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const res = await API.get("/users/me");
      setUserInfo(res.data);
    } catch (err) {
      console.error("Error fetching user info:", err);
    }
  };

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await API.get("/api/tasks");
      setTasks(response.data || []);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const handleTaskStatusChange = async (taskId, newStatus) => {
    try {
      await API.put(`/api/tasks/${taskId}`, { status: newStatus });
      setTasks(
        tasks.map((task) =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      );
    } catch (error) {
      console.error("Error updating task:", error);
      setError("Failed to update task");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const filteredTasks = tasks.filter((task) => {
    if (filterStatus === "ALL") return true;
    return task.status === filterStatus;
  });

  const stats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.status === "COMPLETED").length,
    pending: tasks.filter((t) => t.status !== "COMPLETED").length,
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "COMPLETED":
        return "#10b981";
      case "IN_PROGRESS":
        return "#f59e0b";
      case "PENDING":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "COMPLETED":
        return "✅ Completed";
      case "IN_PROGRESS":
        return "⏳ In Progress";
      case "PENDING":
        return "⭕ Pending";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="dashboard-wrapper">
        <Sidebar activeItem={activeItem} onSelect={setActiveItem} userInfo={userInfo} />
        <div className="dashboard-container">
          <Navbar title={activeItem} onLogout={handleLogout} userInfo={userInfo} />
          <div className="loading-state">
            <p>⏳ Loading tasks...</p>
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
            <h2>Tasks</h2>
          </section>

          {/* Task Stats */}
          <section className="summary-cards">
            <article className="summary-card">
              <div className="card-header">
                <span className="card-icon">📊</span>
                <p className="card-label">Total Tasks</p>
              </div>
              <p className="card-value">{stats.total}</p>
            </article>

            <article className="summary-card">
              <div className="card-header">
                <span className="card-icon">✅</span>
                <p className="card-label">Completed</p>
              </div>
              <p className="card-value">{stats.completed}</p>
              {stats.total > 0 && (
                <p className="card-meta">{Math.round((stats.completed / stats.total) * 100)}% done</p>
              )}
            </article>

            <article className="summary-card">
              <div className="card-header">
                <span className="card-icon">⏳</span>
                <p className="card-label">Pending</p>
              </div>
              <p className="card-value">{stats.pending}</p>
            </article>
          </section>

          {/* Filter Buttons */}
          <section className="filter-section">
            <button
              className={`filter-btn ${filterStatus === "ALL" ? "active" : ""}`}
              onClick={() => setFilterStatus("ALL")}
            >
              All Tasks ({tasks.length})
            </button>
            <button
              className={`filter-btn ${filterStatus === "PENDING" ? "active" : ""}`}
              onClick={() => setFilterStatus("PENDING")}
            >
              Pending ({stats.pending})
            </button>
            <button
              className={`filter-btn ${filterStatus === "COMPLETED" ? "active" : ""}`}
              onClick={() => setFilterStatus("COMPLETED")}
            >
              Completed ({stats.completed})
            </button>
          </section>

          {/* Tasks List */}
          {filteredTasks.length === 0 ? (
            <section className="empty-state">
              <div className="empty-icon">✓</div>
              <h3>
                {filterStatus === "ALL"
                  ? "No Tasks"
                  : filterStatus === "COMPLETED"
                  ? "No Completed Tasks"
                  : "No Pending Tasks"}
              </h3>
              <p>
                {filterStatus === "COMPLETED"
                  ? "Great job! All tasks are done."
                  : "All caught up!"}
              </p>
            </section>
          ) : (
            <section className="tasks-section">
              <div className="tasks-list">
                {filteredTasks.map((task) => (
                  <div key={task.id} className="task-item">
                    <div className="task-left">
                      <input
                        type="checkbox"
                        checked={task.status === "COMPLETED"}
                        onChange={(e) =>
                          handleTaskStatusChange(
                            task.id,
                            e.target.checked ? "COMPLETED" : "PENDING"
                          )
                        }
                        className="task-checkbox"
                      />
                      <div className="task-content">
                        <h4 className={task.status === "COMPLETED" ? "completed" : ""}>
                          {task.name}
                        </h4>
                        {task.description && (
                          <p className="task-description">{task.description}</p>
                        )}
                        {task.projectName && (
                          <p className="task-project">📁 {task.projectName}</p>
                        )}
                      </div>
                    </div>
                    <div className="task-right">
                      {task.dueDate && (
                        <span className="task-date">
                          📅 {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      )}
                      <span
                        className="task-status"
                        style={{ backgroundColor: getStatusColor(task.status) }}
                      >
                        {getStatusLabel(task.status)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

export default Tasks;
