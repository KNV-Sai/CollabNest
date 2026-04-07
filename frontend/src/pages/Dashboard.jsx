import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import "../styles/Dashboard.css";

const summaryItems = [
  { label: "Total Projects", value: 14 },
  { label: "Tasks Assigned", value: 54 },
  { label: "Completed Tasks", value: 28 },
];

function Dashboard() {
  const [activeItem, setActiveItem] = useState("Dashboard");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="dashboard-wrapper">
      <Sidebar activeItem={activeItem} onSelect={setActiveItem} />

      <div className="dashboard-container">
        <Navbar title={activeItem} onLogout={handleLogout} />

        <main className="dashboard-main">
          <section className="dashboard-header">
            <div>
              <p className="dashboard-greeting">Welcome back to CollabNest</p>
              <h2>Good to see you, team member.</h2>
            </div>
            <p className="dashboard-intro">
              A quick overview of your current workspace and progress.
            </p>
          </section>

          <section className="summary-cards">
            {summaryItems.map((item) => (
              <article key={item.label} className="summary-card">
                <p className="card-label">{item.label}</p>
                <p className="card-value">{item.value}</p>
              </article>
            ))}
          </section>

          <section className="dashboard-note">
            <h3>{activeItem}</h3>
            <p>
              This section is styled for a clean, modern dashboard experience.
              Use the sidebar to move between sections.
            </p>
          </section>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
