import { useState } from "react";
import { AuthContext } from "./auth-context";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedToken) {
      try {
        return JSON.parse(storedUser);
      } catch (err) {
        console.error("Error parsing stored user:", err);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    } else if (storedUser || storedToken) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
    return null;
  });
  const loading = false;

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", userData.token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const isTeacher = () => {
    return user?.role === "ADMIN";
  };

  const isStudent = () => {
    return user?.role === "STUDENT";
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isTeacher, isStudent }}>
      {children}
    </AuthContext.Provider>
  );
}
