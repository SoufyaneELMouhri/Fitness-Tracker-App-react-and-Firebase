// services/authServices.js
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  sendEmailVerification
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase/firebase';

const AuthService = {
  // Register with email verification
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

      // Send email verification
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

      // Check if email is verified
      if (!userCredential.user.emailVerified) {
        await signOut(auth);
        throw new Error('Please verify your email before logging in. Check your inbox.');
      }
      if(userCredential.user.emailVerified){
        const userDocRef = doc(db, "users", userCredential.user.uid);
        await setDoc(userDocRef, { emailVerified: true }, { merge: true });
      }

      console.log("Login successful");
      console.log(userCredential.user);
      return userCredential.user;
    } catch (error) {
      console.error("LOGIN ERROR:", error);
      throw error;
    }
  },

  // Resend verification email
  resendVerificationEmail: async () => {
    try {
      const user = auth.currentUser;
      
      if (!user) {
        throw new Error('No user is currently signed in. Please register again.');
      }
      
      // Reload user to check current verification status
      await user.reload();
      
      if (user.emailVerified) {
        throw new Error('Email is already verified. You can now login.');
      }

      await sendEmailVerification(user, {
        url: window.location.origin + '/login',
        handleCodeInApp: false,
      });
      
      return true;
    } catch (error) {
      console.error("RESEND EMAIL ERROR:", error);
      throw error;
    }
  },

  // Logout
  logout: async () => {
    try {
      await signOut(auth);
      console.log("Logout successful");
    } catch (error) {
      console.error("LOGOUT ERROR:", error);
      throw error;
    }
  }
};

export default AuthService;
