import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const LoggedInUserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null); // ✅ token ko state me rakho

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      try {
        const decoded = jwtDecode(storedToken);
        setUser({ id: decoded.id, role: decoded.role });
        setToken(storedToken);
      } catch (err) {
        console.error("Invalid token", err);
        setUser(null);
        setToken(null);
      }
    }
  }, []);

  // ✅ New login function
  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    try {
      const decoded = jwtDecode(newToken);
      setUser({ id: decoded.id, role: decoded.role });
    } catch (err) {
      console.error("Invalid token", err);
      setUser(null);
      setToken(null);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
  };

  return (
    <LoggedInUserContext.Provider
      value={{ user, setUser, login, logout, token }}
    >
      {children}
    </LoggedInUserContext.Provider>
  );
};
