// contexts/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";
import AuthService from "../services/authServices";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileCompleted, setProfileCompleted] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);

  useEffect(() => {
    const unsubscribe = AuthService.onAuthStateChange(async (user) => {
      if (user) {
        try {
          const userData = await AuthService.getUserData(user);
          
          if (userData) {
            setCurrentUser(user);
            setUserRole(userData.role || 'user');
            setProfileCompleted(userData.onboardingComplete || false);
            setEmailVerified(userData.emailVerified || false);
          }
        } catch (error) {
          console.error('Error getting user data:', error);
          setCurrentUser(null);
          setUserRole(null);
          setProfileCompleted(false);
          setEmailVerified(false);
        }
      } else {
        setCurrentUser(null);
        setUserRole(null);
        setProfileCompleted(false);
        setEmailVerified(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // ✅ Refresh user data
  const refreshUserData = async () => {
    try {
      const user = AuthService.getCurrentUser();
      
      if (!user) {
        console.warn('No user to refresh');
        return;
      }

      console.log('🔄 Refreshing user data for:', user.uid);

      const userData = await AuthService.getUserData(user);
      
      if (userData) {
        console.log('✅ User data refreshed:', userData);
        
        setUserRole(userData.role || 'user');
        setProfileCompleted(userData.onboardingComplete || false);
        setEmailVerified(userData.emailVerified || false);
        
        return userData;
      }
    } catch (error) {
      console.error('❌ Error refreshing user data:', error);
      throw error;
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await AuthService.login(email, password);
      
      if (res.error) {
        setError(res.error);
        setCurrentUser(null);
        setUserRole(null);
        setEmailVerified(false);
        setProfileCompleted(false);
        setLoading(false);
        return res;
      }
      
      if (res.user && res.emailVerified) {
        setCurrentUser(res.user);
        setUserRole(res.role);
        setEmailVerified(res.emailVerified);
        setProfileCompleted(res.profileCompleted);
      }
      
      setLoading(false);
      return res;
    } catch (err) {
      const errorMsg = err.message || "Login failed";
      setError(errorMsg);
      setCurrentUser(null);
      setUserRole(null);
      setEmailVerified(false);
      setProfileCompleted(false);
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
      setProfileCompleted(false);
      setEmailVerified(false);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

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
    isEmailVerified: emailVerified,
    isAdmin: userRole === 'admin',
    isCoach: userRole === 'coach',
    isUser: userRole === 'user',
    profileCompleted,
    login,
    register,
    logout,
    forgotPassword,
    resendVerification,
    refreshUserData,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
