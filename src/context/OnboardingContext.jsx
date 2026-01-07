// contexts/OnboardingContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import onboardingServices from '../services/onboardingServices';
import { UseAuth } from '../Hooks/UseAuth';

const OnboardingContext = createContext(null);

export const OnboardingProvider = ({ children }) => {
  const { currentUser } = UseAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [onboardingData, setOnboardingData] = useState({
    email: '',
    display_name: '',
    role: 'user',
    
    // Step 1
    age: null,
    weight: null,
    height: null,
    
    // Step 2
    goals: '',
    workoutFrequency: '',
    dietPreferences: '',
    
    // Step 3
    sleepHours: null,
    activityLevel: '',
    dailyWaterIntake: null,
    
    // Status
    onboardingComplete: false,
    emailVerified: false,
    
    // Step tracking
    stepAnswers: {
      step1: null,
      step2: null,
      step3: null
    }
  });

  // ✅ Load onboarding state on mount
  useEffect(() => {
    const loadOnboardingState = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        console.log('📥 Loading onboarding state...');
        
        // Get current step from service
        const step = await onboardingServices.getCurrentStep();
        
        // Get all onboarding data from service
        const data = await onboardingServices.getOnboardingData();
        
        if (data) {
          console.log('✅ Onboarding data loaded:', data);
          setOnboardingData(data);
        }

        // Set current step (null if complete)
        if (step !== null) {
          setCurrentStep(step);
        }
        
        console.log('✅ Current step:', step);
      } catch (error) {
        console.error('❌ Load onboarding state error:', error);
        setCurrentStep(1);
      } finally {
        setLoading(false);
      }
    };

    loadOnboardingState();
  }, [currentUser]);

  /**
   * Save Step 1
   */
  const saveStep1 = async (answers) => {
    try {
      setLoading(true);
      console.log('💾 Saving Step 1:', answers);
      
      const result = await onboardingServices.saveStep1(answers);
      
      // Update local state
      setOnboardingData(prev => ({
        ...prev,
        age: answers.age,
        weight: answers.weight,
        height: answers.height,
        stepAnswers: {
          ...prev.stepAnswers,
          step1: { answeredAt: new Date() }
        }
      }));

      // Move to next step
      setCurrentStep(result.nextStep);
      
      console.log('✅ Step 1 saved successfully');
      return result;
    } catch (error) {
      console.error('❌ Save step 1 error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Save Step 2
   */
  const saveStep2 = async (answers) => {
    try {
      setLoading(true);
      console.log('💾 Saving Step 2:', answers);
      
      const result = await onboardingServices.saveStep2(answers);
      
      // Update local state
      setOnboardingData(prev => ({
        ...prev,
        goals: answers.goals,
        workoutFrequency: answers.workoutFrequency,
        dietPreferences: answers.dietPreferences,
        stepAnswers: {
          ...prev.stepAnswers,
          step2: { answeredAt: new Date() }
        }
      }));

      // Move to next step
      setCurrentStep(result.nextStep);
      
      console.log('✅ Step 2 saved successfully');
      return result;
    } catch (error) {
      console.error('❌ Save step 2 error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Save Step 3 - Complete onboarding
   */
  const saveStep3 = async (answers) => {
    try {
      setLoading(true);
      console.log('💾 Saving Step 3:', answers);
      
      const result = await onboardingServices.saveStep3(answers);
      
      // Update local state
      setOnboardingData(prev => ({
        ...prev,
        sleepHours: answers.sleepHours,
        activityLevel: answers.activityLevel,
        dailyWaterIntake: answers.dailyWaterIntake,
        onboardingComplete: true,
        stepAnswers: {
          ...prev.stepAnswers,
          step3: { answeredAt: new Date() }
        }
      }));

      console.log('✅ Step 3 saved - Onboarding complete!');
      
      // Return result (component handles navigation)
      return result;
    } catch (error) {
      console.error('❌ Save step 3 error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Go to previous step
   */
  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      console.log('⬅️ Going to step:', currentStep - 1);
    }
  };

  /**
   * Go to specific step
   */
  const goToStep = (step) => {
    if (step >= 1 && step <= 3) {
      setCurrentStep(step);
      console.log('➡️ Going to step:', step);
    }
  };

  /**
   * Check if step is completed
   */
  const isStepCompleted = (step) => {
    const stepKey = `step${step}`;
    const stepAnswers = onboardingData.stepAnswers[stepKey];
    return stepAnswers !== null && stepAnswers.answeredAt !== undefined;
  };

  /**
   * Get step completion percentage
   */
  const getCompletionPercentage = () => {
    const completedSteps = [1, 2, 3].filter(step => isStepCompleted(step)).length;
    return Math.round((completedSteps / 3) * 100);
  };

  /**
   * Refresh onboarding data from Firestore
   */
  const refreshOnboardingData = async () => {
    try {
      setLoading(true);
      console.log('🔄 Refreshing onboarding data...');
      
      const data = await onboardingServices.getOnboardingData();
      
      if (data) {
        setOnboardingData(data);
        console.log('✅ Onboarding data refreshed');
      }
      
      return data;
    } catch (error) {
      console.error('❌ Refresh onboarding data error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    // State
    currentStep,
    onboardingData,
    loading,
    
    // Actions
    saveStep1,
    saveStep2,
    saveStep3,
    goToPreviousStep,
    goToStep,
    refreshOnboardingData,
    
    // Helpers
    isStepCompleted,
    getCompletionPercentage
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
};


export default OnboardingContext;
