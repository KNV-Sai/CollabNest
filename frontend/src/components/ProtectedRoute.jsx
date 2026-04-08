import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/auth-context";

const ProtectedRoute = ({ children, requireRole }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f5f7fb",
      }}>
        <div style={{
          textAlign: "center",
        }}>
          <p style={{
            fontSize: "18px",
            color: "#5563ff",
          }}>⏳ Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" />;
  }

  if (requireRole && user.role !== requireRole) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default ProtectedRoute;