import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  sendEmailVerification,
  sendPasswordResetEmail,
  onAuthStateChanged  
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/firebase';

const AuthService = {
  register: async (email, password, display_name) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await updateProfile(userCredential.user, {
        displayName: display_name,
        photoURL: "",
      });

      await sendEmailVerification(userCredential.user, {
        url: window.location.origin + '/login',
        handleCodeInApp: false,
      });

      await setDoc(doc(db, "users", userCredential.user.uid), {
        display_name,
        email,
        role: "user",
        created_at: serverTimestamp(),
        emailVerified: false,
        profileCompleted: false,
      });

      console.log("User registered. Verification email sent.");
      return userCredential.user;
    } catch (error) {
      console.error("REGISTER ERROR:", error);
      throw error;
    }
  },

  login: async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      
      await userCredential.user.reload();

      if (!userCredential.user.emailVerified) {
        return { 
          user: userCredential.user, 
          role: null, 
          error: null,
          emailVerified: false,
          profileCompleted: false
        };
      }

      const userDocRef = doc(db, "users", userCredential.user.uid);
      await setDoc(userDocRef, { emailVerified: true }, { merge: true });

      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        await signOut(auth);
        return { 
          user: null, 
          role: null, 
          error: 'User profile not found.',
          emailVerified: true,
          profileCompleted: false
        };
      }

      const userData = userDoc.data();
      const role = userData.role || 'user';
      const profileCompleted = userData.profileCompleted || false;

      return { 
        user: userCredential.user, 
        role: role, 
        error: null,
        emailVerified: true,
        profileCompleted: profileCompleted
      };
    } catch (error) {
      console.error("LOGIN ERROR:", error);
      
      let errorMessage = 'Login failed. Please try again.';
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password. Please try again.';
      } else if (error.code === 'auth/invalid-credential') {
        errorMessage = 'Invalid email or password.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return { 
        user: null, 
        role: null, 
        error: errorMessage,
        emailVerified: true,
        profileCompleted: false
      };
    }
  },

  resendVerificationEmail: async () => {
    try {
      const user = auth.currentUser;
      
      if (!user) {
        throw new Error('No user is currently signed in. Please login again.');
      }
      
      await user.reload();
      
      if (user.emailVerified) {
        throw new Error('Email is already verified. You can now login.');
      }

      await sendEmailVerification(user, {
        url: window.location.origin + '/login',
        handleCodeInApp: false,
      });
      
      console.log("Verification email resent successfully");
      return true;
    } catch (error) {
      console.error("RESEND EMAIL ERROR:", error);
      throw error;
    }
  },

  logout: async () => {
    try {
      await signOut(auth);
      console.log("Logout successful");
    } catch (error) {
      console.error("LOGOUT ERROR:", error);
      throw error;
    }
  },

  forgotPassword: async (email) => {
    try {
      await sendPasswordResetEmail(auth, email, {
        url: window.location.origin + '/login',
        handleCodeInApp: false,
      });

      return true;
    } catch (error) {
      console.error("FORGOT PASSWORD ERROR:", error);
      throw error;
    }
  },

  getUserData: async (user) => {
    try {
      if (!user) {
        return null;
      }

      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        return {
          uid: user.uid,
          email: user.email,
          emailVerified: user.emailVerified,
          displayName: user.displayName,
          photoURL: user.photoURL,
          ...userData
        };
      } else {
        return {
          uid: user.uid,
          email: user.email,
          emailVerified: user.emailVerified,
          displayName: user.displayName,
          photoURL: user.photoURL,
          role: 'user',
          profileCompleted: false
        };
      }
    } catch (error) {
      console.error('GET USER DATA ERROR:', error);
      return {
        uid: user.uid,
        email: user.email,
        emailVerified: user.emailVerified,
        displayName: user.displayName,
        photoURL: user.photoURL,
        role: 'user',
        profileCompleted: false
      };
    }
  },

  onAuthStateChange: (callback) => {
    return onAuthStateChanged(auth, callback);
  }
};

export default AuthService;
