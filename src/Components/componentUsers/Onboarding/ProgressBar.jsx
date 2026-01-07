// pages/onboarding/components/ProgressBar.jsx
import React from 'react';
import { CheckCircleFill, Circle } from 'react-bootstrap-icons';
import { useOnboarding } from '../../../Hooks/useOnboarding';

export default function ProgressBar() {
  const { currentStep, isStepCompleted } = useOnboarding();

  const steps = [
    { number: 1, label: 'Personal Info', icon: '👤' },
    { number: 2, label: 'Goals', icon: '🎯' },
    { number: 3, label: 'Habits', icon: '⚡' }
  ];

  return (
    <div className="mb-5">
      {/* Progress Steps */}
      <div className="d-flex justify-content-between align-items-center position-relative">
        {/* Background Line */}
        <div 
          className="position-absolute top-50 start-0 translate-middle-y"
          style={{
            width: '100%',
            height: '3px',
            backgroundColor: '#e9ecef',
            zIndex: 0
          }}
        />
        
        {/* Active Progress Line */}
        <div 
          className="position-absolute top-50 start-0 translate-middle-y"
          style={{
            width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
            height: '3px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            zIndex: 0,
            transition: 'width 0.5s ease'
          }}
        />

        {/* Step Circles */}
        {steps.map((step) => {
          const isCompleted = isStepCompleted(step.number);
          const isActive = currentStep === step.number;
          const isPast = step.number < currentStep;

          return (
            <div 
              key={step.number}
              className="text-center position-relative"
              style={{ zIndex: 1, flex: 1 }}
            >
              {/* Circle */}
              <div className="d-flex justify-content-center mb-2">
                <div
                  className="d-flex align-items-center justify-content-center"
                  style={{
                    width: isActive ? '60px' : '50px',
                    height: isActive ? '60px' : '50px',
                    borderRadius: '50%',
                    background: isCompleted || isPast || isActive
                      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                      : '#fff',
                    border: isCompleted || isPast || isActive 
                      ? 'none' 
                      : '3px solid #e9ecef',
                    color: isCompleted || isPast || isActive ? '#fff' : '#adb5bd',
                    fontSize: isActive ? '1.5rem' : '1.2rem',
                    fontWeight: 'bold',
                    transition: 'all 0.3s ease',
                    boxShadow: isActive 
                      ? '0 5px 15px rgba(102, 126, 234, 0.4)' 
                      : 'none'
                  }}
                >
                  {isCompleted || isPast ? (
                    <CheckCircleFill size={24} />
                  ) : (
                    step.icon
                  )}
                </div>
              </div>

              {/* Label */}
              <div
                className="small fw-semibold"
                style={{
                  color: isActive ? '#667eea' : isCompleted || isPast ? '#495057' : '#adb5bd',
                  transition: 'color 0.3s ease'
                }}
              >
                {step.label}
              </div>

              {/* Step Number */}
              <div className="text-muted" style={{ fontSize: '0.7rem' }}>
                Step {step.number}
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress Percentage */}
      <div className="mt-3 text-center">
        <small className="text-muted">
          Progress: <strong>{Math.round(((currentStep) / steps.length) * 100)}%</strong> Complete
        </small>
      </div>
    </div>
  );
}
