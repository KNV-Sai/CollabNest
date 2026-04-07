import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";

function Home() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const features = [
    {
      icon: "📋",
      title: "Project Management",
      description: "Create and manage group projects with ease. Assign tasks and track progress in real-time.",
    },
    {
      icon: "✅",
      title: "Task Tracking",
      description: "Keep track of project milestones and task assignments. Never miss a deadline.",
    },
    {
      icon: "👥",
      title: "Collaboration",
      description: "Coordinate with your team members seamlessly. Share updates and monitor group progress.",
    },
    {
      icon: "📊",
      title: "Progress Monitoring",
      description: "Get insights into project completion rates and team performance with detailed analytics.",
    },
  ];

  const stats = [
    { number: "500+", label: "Active Users" },
    { number: "1000+", label: "Projects Created" },
    { number: "10K+", label: "Tasks Completed" },
  ];

  return (
    <div className="home-page">
      {/* Navigation Header */}
      <header className="home-header">
        <div className="header-container">
          <div className="logo">
            <span className="logo-icon">🚀</span>
            <h1>CollabNest</h1>
          </div>

          <nav className="header-nav">
            <button
              className="nav-link"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
            <button
              className="nav-link nav-signup"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </button>
          </nav>

          <button
            className="hamburger"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            ☰
          </button>
        </div>

        {isMenuOpen && (
          <nav className="mobile-nav">
            <button onClick={() => navigate("/login")}>Login</button>
            <button onClick={() => navigate("/signup")}>Sign Up</button>
          </nav>
        )}
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h2 className="hero-title">Collaborate Smarter, Create Better</h2>
          <p className="hero-subtitle">
            CollabNest is your one-stop platform for group project management. 
            Coordinate tasks, track milestones, and collaborate with your team effortlessly.
          </p>

          <div className="hero-buttons">
            <button
              className="btn btn-primary"
              onClick={() => navigate("/signup")}
            >
              Get Started
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => navigate("/login")}
            >
              Already a member? Log in
            </button>
          </div>
        </div>

        <div className="hero-illustration">
          <div className="illustration-box">
            <div className="illustration-card card-1">
              <span className="card-icon">📋</span>
              <p>Projects</p>
            </div>
            <div className="illustration-card card-2">
              <span className="card-icon">✅</span>
              <p>Tasks</p>
            </div>
            <div className="illustration-card card-3">
              <span className="card-icon">👥</span>
              <p>Team</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-container">
          {stats.map((stat, index) => (
            <div key={index} className="stat-item">
              <p className="stat-number">{stat.number}</p>
              <p className="stat-label">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-header">
          <h2>Powerful Features</h2>
          <p>Everything you need to manage group projects effectively</p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to transform your team collaboration?</h2>
          <p>Join thousands of students already using CollabNest for their group projects.</p>
          <button
            className="btn btn-primary btn-large"
            onClick={() => navigate("/signup")}
          >
            Start Your Free Account
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>CollabNest</h4>
            <p>Making group project collaboration simple and effective.</p>
          </div>

          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#features">Features</a></li>
              <li><a href="#pricing">Pricing</a></li>
              <li><a href="#about">About</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Account</h4>
            <ul>
              <li><button onClick={() => navigate("/login")}>Login</button></li>
              <li><button onClick={() => navigate("/signup")}>Sign Up</button></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2024 CollabNest. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
