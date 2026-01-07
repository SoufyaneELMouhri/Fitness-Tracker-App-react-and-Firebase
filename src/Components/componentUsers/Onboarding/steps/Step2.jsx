// pages/onboarding/steps/Step2.jsx
import React, { useState } from 'react';
import { Form, Button, Card, Row, Col, Alert } from 'react-bootstrap';
import { TrophyFill, ArrowRight, ArrowLeft } from 'react-bootstrap-icons';
import { useOnboarding } from '../../../../Hooks/useOnboarding';

export default function Step2() {
  const { saveStep2, goToPreviousStep, onboardingData, loading } = useOnboarding();
  
  const [answers, setAnswers] = useState({
    goals: onboardingData.stepAnswers?.step2?.goals || onboardingData.goals || '',
    workoutFrequency: onboardingData.stepAnswers?.step2?.workoutFrequency || onboardingData.workoutFrequency || '',
    dietPreferences: onboardingData.stepAnswers?.step2?.dietPreferences || onboardingData.dietPreferences || ''
  });
  
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // ✅ Validation
  const validate = () => {
    const newErrors = {};

    if (!answers.goals) {
      newErrors.goals = 'Please select your primary goal';
    }
    if (!answers.workoutFrequency) {
      newErrors.workoutFrequency = 'Please select your workout frequency';
    }
    if (!answers.dietPreferences) {
      newErrors.dietPreferences = 'Please select your diet preference';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setSubmitting(true);

    try {
      await saveStep2(answers);
    } catch (error) {
      console.error('Error saving step 2:', error);
      alert('Failed to save. Please try again.');
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
            <TrophyFill size={35} />
          </div>
          <h3 className="fw-bold mb-2">Your Fitness Goals</h3>
          <p className="text-muted">Help us understand what you want to achieve</p>
        </div>

        {/* Form */}
        <Form onSubmit={handleSubmit}>
          {/* Goals */}
          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold mb-3">
              What's your primary fitness goal?
              <span className="text-danger">*</span>
            </Form.Label>
            <Row>
              {[
                { value: 'lose-weight', label: '🔥 Lose Weight', desc: 'Burn fat and get lean' },
                { value: 'gain-muscle', label: '💪 Gain Muscle', desc: 'Build strength and mass' },
                { value: 'stay-fit', label: '🏃 Stay Fit', desc: 'Maintain current fitness' },
                { value: 'improve-endurance', label: '⚡ Improve Endurance', desc: 'Boost stamina' }
              ].map((option) => (
                <Col md={6} key={option.value} className="mb-3">
                  <Form.Check
                    type="radio"
                    id={`goal-${option.value}`}
                    name="goals"
                    value={option.value}
                    checked={answers.goals === option.value}
                    onChange={(e) => setAnswers({...answers, goals: e.target.value})}
                    label={
                      <div className={`p-3 border rounded-3 ${answers.goals === option.value ? 'border-primary bg-primary-subtle' : ''}`}>
                        <div className="fw-semibold">{option.label}</div>
                        <small className="text-muted">{option.desc}</small>
                      </div>
                    }
                    isInvalid={!!errors.goals}
                  />
                </Col>
              ))}
            </Row>
            {errors.goals && <div className="text-danger small mt-2">{errors.goals}</div>}
          </Form.Group>

          {/* Workout Frequency */}
          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold">
              How often can you work out?
              <span className="text-danger">*</span>
            </Form.Label>
            <Form.Select
              value={answers.workoutFrequency}
              onChange={(e) => setAnswers({...answers, workoutFrequency: e.target.value})}
              isInvalid={!!errors.workoutFrequency}
              style={{ height: '50px' }}
            >
              <option value="">Select frequency</option>
              <option value="1-2-times">1-2 times per week</option>
              <option value="3-4-times">3-4 times per week</option>
              <option value="5-6-times">5-6 times per week</option>
              <option value="daily">Every day</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {errors.workoutFrequency}
            </Form.Control.Feedback>
          </Form.Group>

          {/* Diet Preferences */}
          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold">
              What's your diet preference?
              <span className="text-danger">*</span>
            </Form.Label>
            <Form.Select
              value={answers.dietPreferences}
              onChange={(e) => setAnswers({...answers, dietPreferences: e.target.value})}
              isInvalid={!!errors.dietPreferences}
              style={{ height: '50px' }}
            >
              <option value="">Select preference</option>
              <option value="balanced">Balanced Diet</option>
              <option value="low-carb">Low Carb</option>
              <option value="high-protein">High Protein</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="vegan">Vegan</option>
              <option value="keto">Keto</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {errors.dietPreferences}
            </Form.Control.Feedback>
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
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none'
              }}
              disabled={submitting || loading}
            >
              {submitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  Saving...
                </>
              ) : (
                <>
                  Next Step
                  <ArrowRight className="ms-2" size={20} />
                </>
              )}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}
