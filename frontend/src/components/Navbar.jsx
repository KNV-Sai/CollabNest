import "../styles/Navbar.css";

function Navbar({ title, onLogout }) {
  return (
    <header className="navbar">
      <div className="page-title">
        <p>Current page</p>
        <h1>{title}</h1>
      </div>

      <button className="logout-button" onClick={onLogout}>
        Logout
      </button>
    </header>
  );
}

export default Navbar;
