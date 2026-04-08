import { useState, useEffect, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthContext } from "../context/auth-context";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import API from "../api/axios";
import "../styles/Dashboard.css";

function Tasks() {
  const [activeItem, setActiveItem] = useState("Tasks");
  const [userInfo, setUserInfo] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("ALL"); // ALL, PENDING, COMPLETED
  const [actionMessage, setActionMessage] = useState("");
  const [actionType, setActionType] = useState("info");
  const [creatingTask, setCreatingTask] = useState(false);
  const [tasksError, setTasksError] = useState("");
  const [taskForm, setTaskForm] = useState({
    projectId: "",
    name: "",
    description: "",
    dueDate: "",
  });
  const { logout, isTeacher } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("projectId");
  const studentId = searchParams.get("studentId");

  useEffect(() => {
    fetchUserInfo();
    fetchTasks();
    fetchProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

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
      const endpoint = isTeacher() ? "/projects" : "/projects/my-projects";
      const response = await API.get(endpoint);
      setProjects(response.data || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setProjects([]);
    }
  };

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setTasksError("");
      if (projectId) {
        if (isTeacher()) {
          const response = await API.get(`/tasks/project/${projectId}`);
          setTasks(response.data || []);
        } else {
          const response = await API.get("/tasks/my-tasks");
          const myTasks = response.data || [];
          setTasks(myTasks.filter((task) => String(task.project?.id) === String(projectId)));
        }
      } else {
        // Students get their own tasks, teachers see all tasks
        const endpoint = isTeacher() ? "/tasks" : "/tasks/my-tasks";
        const response = await API.get(endpoint);
        setTasks(response.data || []);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setTasks([]);
      setTasksError("Could not load tasks. Please refresh.");
    } finally {
      setLoading(false);
    }
  };

  const handleTaskStatusChange = async (taskId, newStatus) => {
    try {
      setActionMessage("");
      await API.put(`/tasks/${taskId}`, { status: newStatus });
      setTasks(
        tasks.map((task) =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      );
      setActionMessage("Task status updated.");
      setActionType("success");
    } catch (error) {
      console.error("Error updating task:", error);
      setActionMessage("Could not update task status.");
      setActionType("error");
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setActionMessage("");

    const selectedProjectId = projectId || taskForm.projectId;
    if (!selectedProjectId || !taskForm.name.trim()) {
      setActionMessage("Project and task name are required.");
      setActionType("error");
      return;
    }

    try {
      setCreatingTask(true);
      await API.post("/tasks/my", {
        projectId: String(selectedProjectId),
        name: taskForm.name.trim(),
        description: taskForm.description.trim(),
        dueDate: taskForm.dueDate || null,
      });
      setTaskForm((prev) => ({ ...prev, name: "", description: "", dueDate: "" }));
      setActionMessage("Task added successfully.");
      setActionType("success");
      await fetchTasks();
      await fetchProjects();
    } catch (error) {
      const message =
        typeof error.response?.data === "string"
          ? error.response.data
          : "Could not create task.";
      setActionMessage(message);
      setActionType("error");
    } finally {
      setCreatingTask(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const filteredTasks = tasks.filter((task) => {
    if (isTeacher() && projectId && studentId && String(task.assignee?.id) !== String(studentId)) {
      return false;
    }
    if (filterStatus === "ALL") return true;
    if (filterStatus === "PENDING") {
      return task.status === "PENDING" || task.status === "TODO";
    }
    return task.status === filterStatus;
  });

  const stats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.status === "COMPLETED").length,
    pending: tasks.filter((t) => t.status !== "COMPLETED").length,
  };
  const projectProgress = (projects || []).map((project) => {
    const projectTasks = Array.isArray(project.tasks) ? project.tasks : [];
    const total = projectTasks.length;
    const completed = projectTasks.filter((task) => task.status === "COMPLETED").length;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { id: project.id, name: project.name, total, completed, percent };
  });
  const selectedProject = (projects || []).find((project) => String(project.id) === String(projectId));
  const selectedStudent =
    selectedProject && Array.isArray(selectedProject.users)
      ? selectedProject.users.find((user) => String(user.id) === String(studentId))
      : null;

  const getStatusStyle = (status) => {
    switch (status) {
      case "COMPLETED":
        return { bg: "#dcfce7", color: "#166534" };
      case "IN_PROGRESS":
        return { bg: "#fef3c7", color: "#92400e" };
      case "PENDING":
      case "TODO":
        return { bg: "#fee2e2", color: "#991b1b" };
      default:
        return { bg: "#e5e7eb", color: "#374151" };
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "COMPLETED":
        return "✅ Completed";
      case "IN_PROGRESS":
        return "⏳ In Progress";
      case "PENDING":
      case "TODO":
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
          <section className="dashboard-header">
            <h2>Tasks</h2>
            {projectId && studentId && selectedStudent ? (
              <p className="dashboard-intro">
                Detailed tasks for {selectedStudent.name || selectedStudent.email} in {selectedProject?.name || "selected project"}.
              </p>
            ) : projectId && isTeacher() ? (
              <p className="dashboard-intro">
                Select a student below to view all tasks they created in this project with status.
              </p>
            ) : projectId ? (
              <p className="dashboard-intro">Showing tasks for selected project.</p>
            ) : (
              isTeacher() && <p className="dashboard-intro">All tasks in the system with progress overview.</p>
            )}
          </section>

          {actionMessage && (
            <section className={`message-banner ${actionType === "error" ? "error" : "success"}`}>
              <p>{actionMessage}</p>
            </section>
          )}
          {tasksError && (
            <section className="error-banner">
              <p>{tasksError}</p>
            </section>
          )}

          {!isTeacher() && (
            <section className="form-section" style={{ marginBottom: "24px" }}>
              <h3>Add Task To Your Project</h3>
              <form className="project-form" onSubmit={handleCreateTask}>
                <div className="form-group">
                  <label htmlFor="taskProject">Project</label>
                  <select
                    id="taskProject"
                    className="form-input"
                    value={projectId || taskForm.projectId}
                    onChange={(e) => setTaskForm({ ...taskForm, projectId: e.target.value })}
                    disabled={Boolean(projectId)}
                    required
                  >
                    <option value="">Select project</option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="taskName">Task name</label>
                  <input
                    id="taskName"
                    className="form-input"
                    type="text"
                    value={taskForm.name}
                    onChange={(e) => setTaskForm({ ...taskForm, name: e.target.value })}
                    placeholder="Ex: Build login page"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="taskDescription">Description</label>
                  <textarea
                    id="taskDescription"
                    className="form-input"
                    value={taskForm.description}
                    onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                    placeholder="Add details for this task"
                    style={{ minHeight: "88px" }}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="taskDueDate">Due date</label>
                  <input
                    id="taskDueDate"
                    className="form-input"
                    type="date"
                    value={taskForm.dueDate}
                    onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                  />
                </div>
                <button className="submit-btn" type="submit" disabled={creatingTask}>
                  {creatingTask ? "Adding..." : "Add Task"}
                </button>
              </form>
            </section>
          )}

          {isTeacher() && !projectId && (
            <section className="projects-section">
              <h3>Project Progress</h3>
              <div className="projects-grid">
                {projectProgress.map((project) => (
                  <article
                    key={project.id}
                    className="project-card"
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate(`/tasks?projectId=${project.id}`)}
                  >
                    <div className="project-header">
                      <h4>{project.name}</h4>
                      <span className="project-status">{project.percent}% done</span>
                    </div>
                    <p className="project-description">
                      {project.completed} of {project.total} tasks completed
                    </p>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${project.percent}%` }} />
                    </div>
                    <p className="progress-text">Click to open this project's student tasks.</p>
                  </article>
                ))}
              </div>
            </section>
          )}

          {isTeacher() && projectId && selectedProject && (
            <section className="projects-section">
              <div className="section-header">
                <h3>Student Task Details</h3>
                <button className="view-all-link" onClick={() => navigate("/tasks")}>
                  Back to all projects →
                </button>
              </div>
              <div className="student-stats-list">
                {(Array.isArray(selectedProject.users) ? selectedProject.users : []).map((student, index) => {
                  const studentTasks = tasks.filter(
                    (task) => task?.assignee?.id != null && student?.id != null && task.assignee.id === student.id
                  );
                  const completed = studentTasks.filter((task) => task.status === "COMPLETED").length;
                  return (
                    <article key={student?.id ?? `${student?.email ?? "student"}-${index}`} className="student-stats-card">
                      <div>
                        <p className="student-name">{student?.name || student?.email || "Student"}</p>
                        <p className="student-email">{student?.email || "No email available"}</p>
                      </div>
                      <div className="student-task-metrics">
                        <span>Created: {studentTasks.length}</span>
                        <span>Completed: {completed}</span>
                        <span>Pending: {studentTasks.length - completed}</span>
                      </div>
                      <button
                        className="view-all-link"
                        onClick={() =>
                          navigate(
                            `/tasks?${new URLSearchParams({
                              projectId: String(projectId),
                              studentId: String(student?.id || ""),
                            }).toString()}`
                          )
                        }
                        disabled={!student?.id}
                      >
                        Open Student Tasks →
                      </button>
                    </article>
                  );
                })}
              </div>
            </section>
          )}

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
                {filteredTasks.map((task) => {
                  const statusStyle = getStatusStyle(task.status);
                  return (
                    <article key={task.id} className="task-item">
                    <div className="task-left">
                      <input
                        type="checkbox"
                        checked={task.status === "COMPLETED"}
                        onChange={(e) =>
                          handleTaskStatusChange(
                            task.id,
                            e.target.checked ? "COMPLETED" : "TODO"
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
                        {!task.projectName && task.project?.name && (
                          <p className="task-project">📁 {task.project.name}</p>
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
                        style={{ backgroundColor: statusStyle.bg, color: statusStyle.color }}
                      >
                        {getStatusLabel(task.status)}
                      </span>
                    </div>
                    </article>
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

export default Tasks;
