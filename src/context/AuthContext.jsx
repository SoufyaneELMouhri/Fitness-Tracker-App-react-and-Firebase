// contexts/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";
import { 
  onAuthStateChanged,
  signOut
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import AuthService from "../services/authServices";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileCompleted, setProfileCompleted] = useState(false);

  // ✅ Load user data on auth change
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setCurrentUser(user);
            setUserRole(userData.role || 'user');
            setProfileCompleted(userData.onboardingComplete || false);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        setCurrentUser(null);
        setUserRole(null);
        setProfileCompleted(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // ✅ ADD THIS FUNCTION
  const refreshUserData = async () => {
    try {
      const user = auth.currentUser;
      
      if (!user) {
        console.warn('No user to refresh');
        return;
      }

      console.log('🔄 Refreshing user data for:', user.uid);

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        
        console.log('✅ User data refreshed:', userData);
        
        setUserRole(userData.role || 'user');
        setProfileCompleted(userData.onboardingComplete || false);
        
        return userData;
      }
    } catch (error) {
      console.error('❌ Error refreshing user data:', error);
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      const result = await AuthService.login(email, password);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const register = async (email, password, displayName) => {
    try {
      setError(null);
      const result = await AuthService.register(email, password, displayName);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      setUserRole(null);
      setProfileCompleted(false);
    } catch (err) {
      setError(err.message);
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
    profileCompleted, // ✅ Make sure this is here
    isAdmin: userRole === 'admin',
    isCoach: userRole === 'coach',
    isUser: userRole === 'user',
    login,
    register,
    logout,
    refreshUserData, // ✅ ADD THIS TO VALUE
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

