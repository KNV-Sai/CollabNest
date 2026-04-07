import "../styles/Sidebar.css";

const navItems = ["Dashboard", "Projects", "Tasks", "Submissions"];

function Sidebar({ activeItem, onSelect }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span className="logo-dot">C</span>
        <div>
          <h2>CollabNest</h2>
          <p>Team workspace</p>
        </div>
      </div>

      <nav className="nav-list">
        {navItems.map((item) => (
          <button
            key={item}
            className={`sidebar-item ${activeItem === item ? "active" : ""}`}
            onClick={() => onSelect(item)}
          >
            {item}
          </button>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
