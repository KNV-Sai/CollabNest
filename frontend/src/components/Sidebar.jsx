import { useState } from "react";
import "../styles/Sidebar.css";

const navItems = [
  { name: "Dashboard", icon: "🏠" },
  { name: "Projects", icon: "📁" },
  { name: "Tasks", icon: "✅" },
  { name: "Submissions", icon: "📤" },
];

function Sidebar({ activeItem, onSelect, userInfo }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

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
            onClick={() => onSelect(item.name)}
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
