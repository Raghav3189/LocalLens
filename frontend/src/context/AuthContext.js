import React, { createContext, useState, useContext } from "react";
import Alert from "../components/Alert";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });

  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    // Show logout alert
    setAlert({ show: true, message: "You have been logged out.", type: "info" });

    // Auto-hide alert after 3 seconds
    setTimeout(() => {
      setAlert({ show: false, message: "", type: "" });
    }, 3000);
  };

  React.useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {alert.show && <Alert message={alert.message} type={alert.type} />}
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
