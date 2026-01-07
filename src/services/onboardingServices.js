// services/onboardingServices.js
import { 
  doc, 
  updateDoc, 
  getDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { auth, db } from '../firebase/firebase';

const onboardingServices = {

  getCurrentStep: async () => {
    try {
      const user = auth.currentUser;
      if (!user) return 1;

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (!userDoc.exists()) return 1;

      const data = userDoc.data();
      
      // ✅ If onboarding already completed
      if (data.onboardingComplete === true) {
        return null;
      }

      const stepAnswers = data.stepAnswers || {};

      // ✅ Check which step is next
      if (!stepAnswers.step1 || Object.keys(stepAnswers.step1).length === 0) {
        return 1; // Step 1 not completed
      }
      
      if (!stepAnswers.step2 || Object.keys(stepAnswers.step2).length === 0) {
        return 2; // Step 2 not completed
      }
      
      if (!stepAnswers.step3 || Object.keys(stepAnswers.step3).length === 0) {
        return 3; // Step 3 not completed
      }

      // All steps completed but onboardingComplete not set
      return null;
    } catch (error) {
      console.error('GET CURRENT STEP ERROR:', error);
      return 1;
    }
  },

  /**
   * Save Step 1 - Personal Information
   */
  saveStep1: async (answers) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No user logged in');

      const userRef = doc(db, 'users', user.uid);
      
      await updateDoc(userRef, {
        // Save to root level
        age: answers.age,
        weight: answers.weight,
        height: answers.height,
        
        // Save full answers
        'stepAnswers.step1': {
          age: answers.age,
          weight: answers.weight,
          height: answers.height,
          answeredAt: serverTimestamp()
        },
        
        updated_at: serverTimestamp()
      });

      return { 
        success: true, 
        message: 'Step 1 saved successfully',
        nextStep: 2 
      };
    } catch (error) {
      console.error('SAVE STEP 1 ERROR:', error);
      throw error;
    }
  },

  /**
   * Save Step 2 - Goals & Lifestyle
   */
  saveStep2: async (answers) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No user logged in');

      const userRef = doc(db, 'users', user.uid);
      
      await updateDoc(userRef, {
        // Save to root level
        goals: answers.goals,
        workoutFrequency: answers.workoutFrequency,
        dietPreferences: answers.dietPreferences,
        
        // Save full answers
        'stepAnswers.step2': {
          goals: answers.goals,
          workoutFrequency: answers.workoutFrequency,
          dietPreferences: answers.dietPreferences,
          answeredAt: serverTimestamp()
        },
        
        updated_at: serverTimestamp()
      });

      return { 
        success: true, 
        message: 'Step 2 saved successfully',
        nextStep: 3 
      };
    } catch (error) {
      console.error('SAVE STEP 2 ERROR:', error);
      throw error;
    }
  },

  /**
   * Save Step 3 - Activity & Habits
   */
  saveStep3: async (answers) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No user logged in');

      const userRef = doc(db, 'users', user.uid);
      
      await updateDoc(userRef, {
        // Save to root level
        sleepHours: answers.sleepHours,
        activityLevel: answers.activityLevel,
        dailyWaterIntake: answers.dailyWaterIntake,
        
        // Save full answers
        'stepAnswers.step3': {
          sleepHours: answers.sleepHours,
          activityLevel: answers.activityLevel,
          dailyWaterIntake: answers.dailyWaterIntake,
          answeredAt: serverTimestamp()
        },
        
        // ✅ Mark onboarding as complete
        onboardingComplete: true,
        onboardingCompletedAt: serverTimestamp(),
        updated_at: serverTimestamp()
      });

      return { 
        success: true, 
        message: 'Onboarding completed successfully',
        completed: true 
      };
    } catch (error) {
      console.error('SAVE STEP 3 ERROR:', error);
      throw error;
    }
  },

  /**
   * Get all onboarding data
   */
  getOnboardingData: async () => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No user logged in');

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (!userDoc.exists()) {
        return null;
      }

      const data = userDoc.data();
      
      return {
        // Root level data
        email: data.email || '',
        age: data.age || null,
        weight: data.weight || null,
        height: data.height || null,
        goals: data.goals || '',
        workoutFrequency: data.workoutFrequency || '',
        dietPreferences: data.dietPreferences || '',
        sleepHours: data.sleepHours || null,
        activityLevel: data.activityLevel || '',
        dailyWaterIntake: data.dailyWaterIntake || null,
        onboardingComplete: data.onboardingComplete || false,
        
        // Step answers
        stepAnswers: data.stepAnswers || {
          step1: null,
          step2: null,
          step3: null
        }
      };
    } catch (error) {
      console.error('GET ONBOARDING DATA ERROR:', error);
      throw error;
    }
  },

  /**
   * Get specific step answers
   */
  getStepAnswers: async (step) => {
    try {
      const user = auth.currentUser;
      if (!user) return null;

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (!userDoc.exists()) return null;

      const data = userDoc.data();
      const stepAnswers = data.stepAnswers || {};
      
      return stepAnswers[`step${step}`] || null;
    } catch (error) {
      console.error('GET STEP ANSWERS ERROR:', error);
      return null;
    }
  },

  /**
   * Check if step is completed
   */
  isStepCompleted: async (step) => {
    try {
      const stepAnswers = await onboardingServices.getStepAnswers(step);
      
      // ✅ Step is completed if answers exist and not empty
      return stepAnswers !== null && Object.keys(stepAnswers).length > 0;
    } catch (error) {
      console.error('CHECK STEP COMPLETED ERROR:', error);
      return false;
    }
  },

  /**
   * Check if all onboarding is completed
   */
  isOnboardingComplete: async () => {
    try {
      const user = auth.currentUser;
      if (!user) return false;

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (!userDoc.exists()) return false;

      return userDoc.data().onboardingComplete === true;
    } catch (error) {
      console.error('CHECK ONBOARDING COMPLETE ERROR:', error);
      return false;
    }
  },

  /**
   * Reset onboarding (for testing)
   */
  resetOnboarding: async () => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No user logged in');

      const userRef = doc(db, 'users', user.uid);
      
      await updateDoc(userRef, {
        stepAnswers: {
          step1: null,
          step2: null,
          step3: null
        },
        onboardingComplete: false,
        updated_at: serverTimestamp()
      });

      return { success: true, message: 'Onboarding reset successfully' };
    } catch (error) {
      console.error('RESET ONBOARDING ERROR:', error);
      throw error;
    }
  }
};

export default onboardingServices;
