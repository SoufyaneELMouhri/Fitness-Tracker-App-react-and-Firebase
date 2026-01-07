// Components/componentUsers/Onboarding/OnboardingWrapper.jsx
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import ProgressBar from './ProgressBar';
import Step1 from './Steps/Step1';
import Step2 from './Steps/Step2';
import Step3 from './Steps/Step3';
import Spinner from '../../componentGuests/Spinner';
import { useOnboarding } from '../../../Hooks/useOnboarding';

export default function OnboardingWrapper() {
  const { currentStep, loading } = useOnboarding();


  if (loading) {
    return <Spinner />;
  }

  return (
    <div 
      className="min-vh-100 d-flex align-items-center py-5"
      style={{
        background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)'
      }}
    >
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} lg={10} xl={8}>
            {/* Header */}
            <div className="text-center mb-4">
              <h1 className="fw-bold mb-2" style={{ fontSize: '2.5rem' }}>
                🏋️‍♂️ Welcome to <span style={{ 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>FitnessTracker</span>
              </h1>
              <p className="text-muted lead">
                Let's set up your personalized fitness profile
              </p>
            </div>

            {/* Progress Bar */}
            <ProgressBar />

            {/* Step Content */}
            <div className="mt-4">
              {currentStep === 1 && <Step1 />}
              {currentStep === 2 && <Step2 />}
              {currentStep === 3 && <Step3 />}
            </div>

            {/* Footer Note */}
            <div className="text-center mt-4">
              <small className="text-muted">
                Your data is secure and will only be used to personalize your experience
              </small>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
