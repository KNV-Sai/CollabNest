import { useState } from "react";
import "../styles/Navbar.css";

function Navbar({ title, onLogout, userInfo }) {
  const [showUserMenu, setShowUserMenu] = useState(false);

  const getUserInitial = () => {
    return userInfo?.name ? userInfo.name.charAt(0).toUpperCase() : "U";
  };

  return (
    <header className="navbar">
      <div className="page-title">
        <h1>{title}</h1>
      </div>

      <div className="navbar-actions">
        <div className="user-menu-wrapper">
          <button
            className="user-menu-btn"
            onClick={() => setShowUserMenu(!showUserMenu)}
            title="User menu"
          >
            <div className="user-avatar-small">{getUserInitial()}</div>
            <span className="user-name-short">
              {userInfo?.name ? userInfo.name.split(" ")[0] : "User"}
            </span>
            <span className="menu-icon">▼</span>
          </button>

          {showUserMenu && (
            <div className="user-menu-dropdown">
              <div className="user-info-section">
                <div className="avatar-large">{getUserInitial()}</div>
                <p className="name">{userInfo?.name || "User"}</p>
                <p className="email">{userInfo?.email || "No email"}</p>
                <p className="role">
                  {userInfo?.role === "ADMIN" ? "👨‍🏫 Teacher" : "👨‍🎓 Student"}
                </p>
              </div>

              <div className="menu-divider"></div>

              <button className="menu-item">
                ⚙️ Settings
              </button>
              <button className="menu-item">
                ❓ Help & Support
              </button>

              <div className="menu-divider"></div>

              <button
                className="menu-item logout-item"
                onClick={() => {
                  setShowUserMenu(false);
                  onLogout();
                }}
              >
                🚪 Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {showUserMenu && (
        <div
          className="user-menu-backdrop"
          onClick={() => setShowUserMenu(false)}
        ></div>
      )}
    </header>
  );
}

export default Navbar;
