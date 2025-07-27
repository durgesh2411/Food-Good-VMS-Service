import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { backendUrl } from '../lib/constant';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check authentication status on app load
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/users/current-user`, {
        withCredentials: true,
      });

      if (response.data.success) {
        setIsAuthenticated(true);
        setUser(response.data.data);

        // Update localStorage as well
        localStorage.setItem("user", JSON.stringify(response.data.data));
      } else {
        // Clear authentication state
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
      }
    } catch (error) {
      console.log("Authentication check failed:", error.response?.status);

      // Clear authentication state on error
      setIsAuthenticated(false);
      setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
    } finally {
      setLoading(false);
    }
  };

  const login = async (userData, accessToken) => {
    setIsAuthenticated(true);
    setUser(userData);

    // Update localStorage
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
    }
    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
    }
  };

  const logout = async () => {
    try {
      // Call backend logout endpoint
      await axios.post(`${backendUrl}/users/logout`, {}, { withCredentials: true });
    } catch (error) {
      console.error("Logout API error:", error);
      // Continue with local logout even if API fails
    }

    // Clear authentication state
    setIsAuthenticated(false);
    setUser(null);

    // Clear localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
