import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import API from "../api/axios";
import "../styles/Dashboard.css";

function Projects() {
  const [activeItem, setActiveItem] = useState("Projects");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    emails: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const fetchProjects = async () => {
    try {
      const response = await API.get("/api/projects");
      setProjects(response.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // Create project
      const projectResponse = await API.post("/api/projects", {
        name: formData.name,
        description: formData.description,
      });

      // Assign students (log for now)
      const emails = formData.emails.split(",").map((email) => email.trim());
      console.log("Assigning students:", emails, "to project:", projectResponse.data.id);

      // Clear form
      setFormData({ name: "", description: "", emails: "" });

      // Show success
      setMessage("Project created");

      // Refresh list
      fetchProjects();
    } catch (error) {
      console.error("Error creating project:", error);
      setMessage("Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-wrapper">
      <Sidebar activeItem={activeItem} onSelect={setActiveItem} />

      <div className="dashboard-container">
        <Navbar title={activeItem} onLogout={handleLogout} />

        <main className="dashboard-main">
          <section className="dashboard-header">
            <div>
              <p className="dashboard-greeting">Manage Your Projects</p>
              <h2>Projects Overview</h2>
            </div>
            <p className="dashboard-intro">
              Create new projects and assign students to collaborate.
            </p>
          </section>

          {/* Form at the top */}
          <section className="project-form">
            <h3>Create New Project</h3>
            <form onSubmit={handleSubmit} className="auth-form" style={{ maxWidth: "600px" }}>
              <div>
                <input
                  className="auth-input"
                  type="text"
                  name="name"
                  placeholder="Project Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <textarea
                  className="auth-input"
                  name="description"
                  placeholder="Description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  required
                />
              </div>
              <div>
                <input
                  className="auth-input"
                  type="text"
                  name="emails"
                  placeholder="Student Emails (comma separated)"
                  value={formData.emails}
                  onChange={handleInputChange}
                />
              </div>
              <button type="submit" className="auth-button" disabled={loading}>
                {loading ? "Creating..." : "Create Project"}
              </button>
              {message && (
                <p style={{ color: message === "Project created" ? "#10b981" : "#dc2626", marginTop: "12px", textAlign: "center" }}>
                  {message}
                </p>
              )}
            </form>
          </section>

          {/* Project list */}
          <section className="projects-list">
            <h3>Your Projects</h3>
            <div className="projects-grid">
              {projects.length === 0 ? (
                <p>No projects yet. Create your first project above!</p>
              ) : (
                projects.map((project) => (
                  <div key={project.id} className="project-card">
                    <h4>{project.name}</h4>
                    <p>{project.description}</p>
                    <p><strong>Tasks:</strong> {project.tasks ? project.tasks.length : 0}</p>
                  </div>
                ))
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default Projects;</content>
<parameter name="filePath">c:\Users\knvsa\Desktop\CollabNest\frontend\src\pages\Projects.jsx