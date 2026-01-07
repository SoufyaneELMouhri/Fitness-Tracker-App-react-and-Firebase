// contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from "react";
import AuthService from "../services/authServices";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = AuthService.onAuthStateChange(async (user) => {
      if (user) {
        try {
          const userData = await AuthService.getUserData(user);
          setCurrentUser(userData);
          setUserRole(userData.role || 'user');
        } catch (error) {
          console.error('Error getting user data:', error);
          setCurrentUser(null);
          setUserRole(null);
        }
      } else {
        setCurrentUser(null);
        setUserRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // ✅ FIXED login - handle error properly
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await AuthService.login(email, password);
      
      // ✅ Check if there's an error in response
      if (res.error) {
        setError(res.error);
        setCurrentUser(null);
        setUserRole(null);
        setLoading(false);
        return res; // Return with error
      }
      
      // ✅ Only set user if login successful
      if (res.user && res.emailVerified) {
        setCurrentUser(res.user);
        setUserRole(res.role);
      }
      
      setLoading(false);
      return res;
    } catch (err) {
      const errorMsg = err.message || "Login failed";
      setError(errorMsg);
      setCurrentUser(null);
      setUserRole(null);
      setLoading(false);
      return { user: null, role: null, error: errorMsg };
    }
  };

  const register = async (email, password, display_name) => {
    setLoading(true);
    setError(null);
    try {
      const user = await AuthService.register(email, password, display_name);
      setLoading(false);
      return user;
    } catch (err) {
      setError(err.message || "Register failed");
      setLoading(false);
      throw err;
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await AuthService.logout();
      setCurrentUser(null);
      setUserRole(null);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  // forgot password
  const forgotPassword = async (email) => {
    setLoading(true);
    setError(null);
    try {
      const result = await AuthService.forgotPassword(email);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  // resend verification
  const resendVerification = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await AuthService.resendVerificationEmail();
      setLoading(false);
      return result;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  const value = {
    currentUser,
    userRole,
    loading,
    authLoading: loading,
    error,
    isAuthenticated: !!currentUser,
    isEmailVerified: currentUser?.emailVerified || false,
    isAdmin: userRole === 'admin',
    isCoach: userRole === 'coach',
    isUser: userRole === 'user',
    profileCompleted: currentUser?.profileCompleted || false,
    login,
    register,
    logout,
    forgotPassword,
    resendVerification,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

