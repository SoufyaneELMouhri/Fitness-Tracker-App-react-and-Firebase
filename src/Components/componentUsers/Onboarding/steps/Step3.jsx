// pages/onboarding/steps/Step3.jsx
import React, { useState } from 'react';
import { Form, Button, Card, Row, Col, InputGroup } from 'react-bootstrap';
import { LightningFill, ArrowLeft, CheckCircleFill } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '../../../../Hooks/useOnboarding';
import { UseAuth } from '../../../../Hooks/UseAuth'; 

export default function Step3() {
  const navigate = useNavigate();
  const { refreshUserData } = UseAuth(); // ✅ Get refreshUserData
  const { saveStep3, goToPreviousStep, onboardingData, loading } = useOnboarding();
  
  const [answers, setAnswers] = useState({
    sleepHours: onboardingData.stepAnswers?.step3?.sleepHours || onboardingData.sleepHours || '',
    activityLevel: onboardingData.stepAnswers?.step3?.activityLevel || onboardingData.activityLevel || '',
    dailyWaterIntake: onboardingData.stepAnswers?.step3?.dailyWaterIntake || onboardingData.dailyWaterIntake || ''
  });
  
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (!answers.sleepHours) {
      newErrors.sleepHours = 'Sleep hours is required';
    } else if (answers.sleepHours < 3 || answers.sleepHours > 14) {
      newErrors.sleepHours = 'Sleep hours must be between 3 and 14';
    }

    if (!answers.activityLevel) {
      newErrors.activityLevel = 'Please select your activity level';
    }

    if (!answers.dailyWaterIntake) {
      newErrors.dailyWaterIntake = 'Water intake is required';
    } else if (answers.dailyWaterIntake < 0 || answers.dailyWaterIntake > 10) {
      newErrors.dailyWaterIntake = 'Water intake must be between 0 and 10 liters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setSubmitting(true);

    try {
      console.log('🚀 Starting Step 3 submission...');
      
      // Save step 3
      const result = await saveStep3({
        sleepHours: parseInt(answers.sleepHours),
        activityLevel: answers.activityLevel,
        dailyWaterIntake: parseFloat(answers.dailyWaterIntake)
      });

      console.log('✅ Step 3 saved:', result);

      if (result.completed) {
        console.log('🔄 Refreshing auth context...');
        
        // ✅ Refresh user data
        await refreshUserData();
        
        console.log('✅ Navigating to app...');
        
        // Small delay then navigate
        setTimeout(() => {
          navigate('/app', { replace: true });
        }, 300);
      }
    } catch (error) {
      console.error('❌ Error completing onboarding:', error);
      alert(`Failed to complete onboarding: ${error.message || 'Unknown error'}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="border-0 shadow-sm">
      <Card.Body className="p-4 p-md-5">
        {/* Header */}
        <div className="text-center mb-4">
          <div 
            className="mx-auto mb-3 d-flex align-items-center justify-content-center"
            style={{
              width: '70px',
              height: '70px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white'
            }}
          >
            <LightningFill size={35} />
          </div>
          <h3 className="fw-bold mb-2">Daily Habits</h3>
          <p className="text-muted">Last step! Tell us about your lifestyle</p>
        </div>

        {/* Form */}
        <Form onSubmit={handleSubmit}>
          {/* Sleep Hours */}
          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold">
              How many hours do you sleep per night?
              <span className="text-danger">*</span>
            </Form.Label>
            <InputGroup>
              <Form.Control
                type="number"
                step="0.5"
                placeholder="Enter sleep hours"
                value={answers.sleepHours}
                onChange={(e) => setAnswers({...answers, sleepHours: e.target.value})}
                isInvalid={!!errors.sleepHours}
                style={{ height: '50px' }}
                disabled={submitting}
              />
              <InputGroup.Text>hours</InputGroup.Text>
              <Form.Control.Feedback type="invalid">
                {errors.sleepHours}
              </Form.Control.Feedback>
            </InputGroup>
            <Form.Text className="text-muted">Recommended: 7-9 hours</Form.Text>
          </Form.Group>

          {/* Activity Level */}
          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold mb-3">
              What's your daily activity level?
              <span className="text-danger">*</span>
            </Form.Label>
            <Row>
              {[
                { value: 'Sedentary', label: '🪑 Sedentary', desc: 'Little to no exercise' },
                { value: 'Light', label: '🚶 Light', desc: 'Light exercise 1-3 days/week' },
                { value: 'Moderate', label: '🏃 Moderate', desc: 'Moderate exercise 3-5 days/week' },
                { value: 'Active', label: '💪 Active', desc: 'Hard exercise 6-7 days/week' }
              ].map((option) => (
                <Col md={6} key={option.value} className="mb-3">
                  <Form.Check
                    type="radio"
                    id={`activity-${option.value}`}
                    name="activityLevel"
                    value={option.value}
                    checked={answers.activityLevel === option.value}
                    onChange={(e) => setAnswers({...answers, activityLevel: e.target.value})}
                    label={
                      <div className={`p-3 border rounded-3 ${answers.activityLevel === option.value ? 'border-primary bg-primary-subtle' : ''}`}>
                        <div className="fw-semibold">{option.label}</div>
                        <small className="text-muted">{option.desc}</small>
                      </div>
                    }
                    disabled={submitting}
                  />
                </Col>
              ))}
            </Row>
            {errors.activityLevel && <div className="text-danger small mt-2">{errors.activityLevel}</div>}
          </Form.Group>

          {/* Water Intake */}
          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold">
              How much water do you drink daily?
              <span className="text-danger">*</span>
            </Form.Label>
            <InputGroup>
              <Form.Control
                type="number"
                step="0.1"
                placeholder="Enter daily water intake"
                value={answers.dailyWaterIntake}
                onChange={(e) => setAnswers({...answers, dailyWaterIntake: e.target.value})}
                isInvalid={!!errors.dailyWaterIntake}
                style={{ height: '50px' }}
                disabled={submitting}
              />
              <InputGroup.Text>liters</InputGroup.Text>
              <Form.Control.Feedback type="invalid">
                {errors.dailyWaterIntake}
              </Form.Control.Feedback>
            </InputGroup>
            <Form.Text className="text-muted">Recommended: 2-3 liters per day</Form.Text>
          </Form.Group>

          {/* Buttons */}
          <div className="d-flex justify-content-between mt-4">
            <Button
              variant="outline-secondary"
              size="lg"
              onClick={goToPreviousStep}
              disabled={submitting || loading}
              className="px-4"
            >
              <ArrowLeft className="me-2" size={20} />
              Back
            </Button>

            <Button
              type="submit"
              size="lg"
              className="px-5 fw-semibold"
              style={{ 
                background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
                border: 'none'
              }}
              disabled={submitting || loading}
            >
              {submitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  Completing...
                </>
              ) : (
                <>
                  Complete Setup
                  <CheckCircleFill className="ms-2" size={20} />
                </>
              )}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}
