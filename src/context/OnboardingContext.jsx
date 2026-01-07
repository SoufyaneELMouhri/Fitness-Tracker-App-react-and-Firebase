// contexts/OnboardingContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import onboardingServices from '../services/onboardingServices';
import { UseAuth } from '../Hooks/UseAuth';

const OnboardingContext = createContext();

export const OnboardingProvider = ({ children }) => {
  // ❌ REMOVE: const navigate = useNavigate();
  const { currentUser } = UseAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [onboardingData, setOnboardingData] = useState({
    email: '',
    age: null,
    weight: null,
    height: null,
    goals: '',
    workoutFrequency: '',
    dietPreferences: '',
    sleepHours: null,
    activityLevel: '',
    dailyWaterIntake: null,
    onboardingComplete: false,
    stepAnswers: {
      step1: null,
      step2: null,
      step3: null
    }
  });

  // ✅ Load onboarding state on mount (NO navigation here)
  useEffect(() => {
    const loadOnboardingState = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        // Get current step
        const step = await onboardingServices.getCurrentStep();
        
        // Get all data
        const data = await onboardingServices.getOnboardingData();
        
        if (data) {
          setOnboardingData(data);
        }

        // Just set the step, don't navigate
        setCurrentStep(step || 1);
      } catch (error) {
        console.error('Load onboarding state error:', error);
        setCurrentStep(1);
      } finally {
        setLoading(false);
      }
    };

    loadOnboardingState();
  }, [currentUser]); // ✅ Removed navigate from deps

  /**
   * Save Step 1 and move to next
   */
  const saveStep1 = async (answers) => {
    try {
      setLoading(true);
      
      const result = await onboardingServices.saveStep1(answers);
      
      // Update local state
      setOnboardingData(prev => ({
        ...prev,
        age: answers.age,
        weight: answers.weight,
        height: answers.height,
        stepAnswers: {
          ...prev.stepAnswers,
          step1: answers
        }
      }));

      // Move to next step
      setCurrentStep(result.nextStep);
      
      return result;
    } catch (error) {
      console.error('Save step 1 error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Save Step 2 and move to next
   */
  const saveStep2 = async (answers) => {
    try {
      setLoading(true);
      
      const result = await onboardingServices.saveStep2(answers);
      
      // Update local state
      setOnboardingData(prev => ({
        ...prev,
        goals: answers.goals,
        workoutFrequency: answers.workoutFrequency,
        dietPreferences: answers.dietPreferences,
        stepAnswers: {
          ...prev.stepAnswers,
          step2: answers
        }
      }));

      // Move to next step
      setCurrentStep(result.nextStep);
      
      return result;
    } catch (error) {
      console.error('Save step 2 error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Save Step 3 and complete onboarding
   * ✅ Return completion status, let component handle navigation
   */
  const saveStep3 = async (answers) => {
    try {
      setLoading(true);
      
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
          step3: answers
        }
      }));

      // ✅ Return result, component will handle navigation
      return result;
    } catch (error) {
      console.error('Save step 3 error:', error);
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
      setCurrentStep(currentStep - 1);
    }
  };

  /**
   * Go to specific step
   */
  const goToStep = (step) => {
    if (step >= 1 && step <= 3) {
      setCurrentStep(step);
    }
  };

  /**
   * Check if step is completed
   */
  const isStepCompleted = (step) => {
    const stepKey = `step${step}`;
    const stepAnswers = onboardingData.stepAnswers[stepKey];
    return stepAnswers !== null && Object.keys(stepAnswers).length > 0;
  };

  /**
   * Get step completion percentage
   */
  const getCompletionPercentage = () => {
    const completed = [1, 2, 3].filter(step => isStepCompleted(step)).length;
    return Math.round((completed / 3) * 100);
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
