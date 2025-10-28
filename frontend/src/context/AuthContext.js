import React, { createContext, useState, useContext } from "react";

// Create the context
export const AuthContext = createContext();

// Provide context to the app
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Login: set the logged-in user
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // Logout: clear user and local storage
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  // On refresh: check localStorage for existing user
  React.useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

//  Custom hook to use the context easily
export const useAuth = () => useContext(AuthContext);
