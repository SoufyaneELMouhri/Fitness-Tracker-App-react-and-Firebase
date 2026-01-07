import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  serverTimestamp,
  setDoc
} from 'firebase/firestore';
import { auth, db } from '../firebase/firebase'; 

const UserServices = {
  // Get currently connected/logged-in user
  getCurrentUser: async () => {
    try {
      const user = auth.currentUser;
      
      if (!user) {
        throw new Error('No user is currently logged in');
      }

      // Get user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (userDoc.exists()) {
        return {
          uid: user.uid,
          email: user.email,
          emailVerified: user.emailVerified,
          ...userDoc.data()
        };
      } else {
        throw new Error('User document not found');
      }
    } catch (error) {
      console.error('GET CURRENT USER ERROR:', error);
      throw error;
    }
  },

  // Get all users
  getAllUsers: async () => {
    try {
      const usersRef = collection(db, 'users');
      const querySnapshot = await getDocs(usersRef);
      
      const users = [];
      querySnapshot.forEach((doc) => {
        users.push({
          uid: doc.id,
          ...doc.data()
        });
      });
      
      return users;
    } catch (error) {
      console.error('GET ALL USERS ERROR:', error);
      throw error;
    }
  },

  // Get users by role (coach)
  getUsersByRoleCoach: async () => {
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('role', '==', 'coach'));
      const querySnapshot = await getDocs(q);
      
      const coaches = [];
      querySnapshot.forEach((doc) => {
        coaches.push({
          uid: doc.id,
          ...doc.data()
        });
      });
      
      return coaches;
    } catch (error) {
      console.error('GET COACHES ERROR:', error);
      throw error;
    }
  },

  // Get users by role (user)
  getUsersByRoleUser: async () => {
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('role', '==', 'user'));
      const querySnapshot = await getDocs(q);
      
      const regularUsers = [];
      querySnapshot.forEach((doc) => {
        regularUsers.push({
          uid: doc.id,
          ...doc.data()
        });
      });
      
      return regularUsers;
    } catch (error) {
      console.error('GET REGULAR USERS ERROR:', error);
      throw error;
    }
  },

  // Get user by ID
  getUserById: async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      
      if (userDoc.exists()) {
        return {
          uid: userDoc.id,
          ...userDoc.data()
        };
      } else {
        throw new Error('User not found');
      }
    } catch (error) {
      console.error('GET USER BY ID ERROR:', error);
      throw error;
    }
  },

  // Create a new user document (for admin purposes)
  createUser: async (userId, userData) => {
    try {
      await setDoc(doc(db, 'users', userId), {
        ...userData,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp()
      });
      
      return { uid: userId, ...userData };
    } catch (error) {
      console.error('CREATE USER ERROR:', error);
      throw error;
    }
  },

  // Update user data
  updateUser: async (userId, userData) => {
    try {
      const userRef = doc(db, 'users', userId);
      
      await updateDoc(userRef, {
        ...userData,
        updated_at: serverTimestamp()
      });
      
      return { uid: userId, ...userData };
    } catch (error) {
      console.error('UPDATE USER ERROR:', error);
      throw error;
    }
  },

  // Update current user profile
  updateCurrentUserProfile: async (userData) => {
    try {
      const user = auth.currentUser;
      
      if (!user) {
        throw new Error('No user is currently logged in');
      }

      const userRef = doc(db, 'users', user.uid);
      
      await updateDoc(userRef, {
        ...userData,
        updated_at: serverTimestamp()
      });
      
      return { uid: user.uid, ...userData };
    } catch (error) {
      console.error('UPDATE CURRENT USER ERROR:', error);
      throw error;
    }
  },

  // Delete user document
  deleteUser: async (userId) => {
    try {
      await deleteDoc(doc(db, 'users', userId));
      return { success: true, message: 'User deleted successfully' };
    } catch (error) {
      console.error('DELETE USER ERROR:', error);
      throw error;
    }
  },

  // Update user role
  updateUserRole: async (userId, newRole) => {
    try {
      if (!['user', 'coach', 'admin'].includes(newRole)) {
        throw new Error('Invalid role. Must be: user, coach, or admin');
      }

      const userRef = doc(db, 'users', userId);
      
      await updateDoc(userRef, {
        role: newRole,
        updated_at: serverTimestamp()
      });
      
      return { success: true, message: `User role updated to ${newRole}` };
    } catch (error) {
      console.error('UPDATE USER ROLE ERROR:', error);
      throw error;
    }
  },

  // Search users by name or email
  searchUsers: async (searchTerm) => {
    try {
      const usersRef = collection(db, 'users');
      const querySnapshot = await getDocs(usersRef);
      
      const users = [];
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        const displayName = userData.display_name?.toLowerCase() || '';
        const email = userData.email?.toLowerCase() || '';
        const search = searchTerm.toLowerCase();
        
        if (displayName.includes(search) || email.includes(search)) {
          users.push({
            uid: doc.id,
            ...userData
          });
        }
      });
      
      return users;
    } catch (error) {
      console.error('SEARCH USERS ERROR:', error);
      throw error;
    }
  },

  // Get users count by role
  getUsersCountByRole: async () => {
    try {
      const usersRef = collection(db, 'users');
      const querySnapshot = await getDocs(usersRef);
      
      const counts = {
        total: 0,
        user: 0,
        coach: 0,
        admin: 0
      };
      
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        counts.total++;
        
        if (userData.role) {
          counts[userData.role] = (counts[userData.role] || 0) + 1;
        }
      });
      
      return counts;
    } catch (error) {
      console.error('GET USERS COUNT ERROR:', error);
      throw error;
    }
  }
};

export default UserServices;
