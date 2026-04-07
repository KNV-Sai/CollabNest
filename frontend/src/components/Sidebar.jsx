import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Sidebar.css";

const navItems = [
  { name: "Dashboard", icon: "🏠", path: "/dashboard" },
  { name: "Projects", icon: "📁", path: "/projects" },
  { name: "Tasks", icon: "✅", path: "/tasks" },
  { name: "Submissions", icon: "📤", path: "/submissions" },
];

function Sidebar({ activeItem, onSelect, userInfo }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleNavigation = (item) => {
    onSelect(item.name);
    navigate(item.path);
  };

  return (
    <aside className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <span className="logo-icon">🚀</span>
          {!isCollapsed && (
            <div>
              <h2>CollabNest</h2>
              <p>Team workspace</p>
            </div>
          )}
        </div>
        <button
          className="toggle-btn"
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={isCollapsed ? "Expand" : "Collapse"}
        >
          {isCollapsed ? "→" : "←"}
        </button>
      </div>

      <nav className="nav-list">
        {navItems.map((item) => (
          <button
            key={item.name}
            className={`sidebar-item ${activeItem === item.name ? "active" : ""}`}
            onClick={() => handleNavigation(item)}
            title={item.name}
          >
            <span className="item-icon">{item.icon}</span>
            {!isCollapsed && <span className="item-label">{item.name}</span>}
          </button>
        ))}
      </nav>

      {userInfo && (
        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              {userInfo.name ? userInfo.name.charAt(0).toUpperCase() : "U"}
            </div>
            {!isCollapsed && (
              <div className="user-details">
                <p className="user-name">{userInfo.name}</p>
                <p className="user-role">
                  {userInfo.role === "ADMIN" ? "👨‍🏫 Teacher" : "👨‍🎓 Student"}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </aside>
  );
}

export default Sidebar;
