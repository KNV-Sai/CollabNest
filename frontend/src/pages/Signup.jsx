import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth-context";
import API from "../api/axios";
import "../styles/Auth.css";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = {};

    if (!name.trim()) {
      validationErrors.name = "Name is required";
    }

    if (!email.trim()) {
      validationErrors.email = "Email is required";
    }

    if (!password) {
      validationErrors.password = "Password is required";
    }

    if (!confirmPassword) {
      validationErrors.confirmPassword = "Confirm Password is required";
    }

    if (password && confirmPassword && password !== confirmPassword) {
      validationErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const res = await API.post("/auth/signup", {
        name,
        email,
        password,
      });

      const { token, id, role } = res.data;

      login({
        token,
        id,
        name,
        email,
        role,
      });

      navigate(role === "ADMIN" ? "/teacher-dashboard" : "/dashboard");
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        const message = typeof data === 'string' ? data : (data?.message || JSON.stringify(data));
        
        if (status === 409 || message.includes("already exists")) {
          setErrors({ general: "User with this email already exists" });
        } else {
          setErrors({ general: message || "Registration failed" });
        }
      } else {
        setErrors({ general: "Registration failed" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Create your account</h2>
        <p className="auth-subtitle">Register to access the CollabNest dashboard.</p>

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <div>
            <input
              className="auth-input"
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {errors.name && (
              <p style={{ color: "#dc2626", marginTop: "8px", fontSize: "0.95rem" }}>
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <input
              className="auth-input"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && (
              <p style={{ color: "#dc2626", marginTop: "8px", fontSize: "0.95rem" }}>
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <input
              className="auth-input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && (
              <p style={{ color: "#dc2626", marginTop: "8px", fontSize: "0.95rem" }}>
                {errors.password}
              </p>
            )}
          </div>

          <div>
            <input
              className="auth-input"
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {errors.confirmPassword && (
              <p style={{ color: "#dc2626", marginTop: "8px", fontSize: "0.95rem" }}>
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Registering..." : "Sign up"}
          </button>

          {errors.general && (
            <p style={{ color: "#dc2626", marginTop: "12px", textAlign: "center" }}>
              {errors.general}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export default Signup;
