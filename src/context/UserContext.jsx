// contexts/UserContext.jsx
import { createContext, useState, useCallback } from 'react';
import UserServices from '../services/userServices';

// NO import of useAuth - complete separation
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // NO auth state here - only user operations state
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAllUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const allUsers = await UserServices.getAllUsers();
      setUsers(allUsers);
      return allUsers;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getCoaches = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      return await UserServices.getUsersByRoleCoach();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getRegularUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      return await UserServices.getUsersByRoleUser();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getUserById = useCallback(async (userId) => {
    setLoading(true);
    setError(null);
    try {
      return await UserServices.getUserById(userId);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (userData) => {
    setLoading(true);
    setError(null);
    try {
      return await UserServices.updateCurrentUserProfile(userData);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUser = useCallback(async (userId, userData) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await UserServices.updateUser(userId, userData);
      await getAllUsers();
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [getAllUsers]);

  const deleteUser = useCallback(async (userId) => {
    setLoading(true);
    setError(null);
    try {
      const result = await UserServices.deleteUser(userId);
      await getAllUsers();
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [getAllUsers]);

  const updateUserRole = useCallback(async (userId, newRole) => {
    setLoading(true);
    setError(null);
    try {
      const result = await UserServices.updateUserRole(userId, newRole);
      await getAllUsers();
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [getAllUsers]);

  const searchUsers = useCallback(async (searchTerm) => {
    setLoading(true);
    setError(null);
    try {
      return await UserServices.searchUsers(searchTerm);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getUsersCount = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      return await UserServices.getUsersCountByRole();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    // ONLY user operations - NO auth state
    users,
    loading,
    error,
    getAllUsers,
    getCoaches,
    getRegularUsers,
    getUserById,
    updateProfile,
    updateUser,
    deleteUser,
    updateUserRole,
    searchUsers,
    getUsersCount
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};


