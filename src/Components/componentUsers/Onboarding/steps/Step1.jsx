// pages/onboarding/steps/Step1.jsx
import React, { useState } from 'react';
import { Form, Button, Card, Row, Col, InputGroup, Alert } from 'react-bootstrap';
import { PersonFill, ArrowRight } from 'react-bootstrap-icons';
import { useOnboarding } from '../../../../Hooks/useOnboarding';

export default function Step1() {
  const { saveStep1, onboardingData, loading } = useOnboarding();
  
  const [answers, setAnswers] = useState({
    age: onboardingData.stepAnswers?.step1?.age || onboardingData.age || '',
    weight: onboardingData.stepAnswers?.step1?.weight || onboardingData.weight || '',
    height: onboardingData.stepAnswers?.step1?.height || onboardingData.height || ''
  });
  
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // ✅ Validation
  const validate = () => {
    const newErrors = {};

    if (!answers.age) {
      newErrors.age = 'Age is required';
    } else if (answers.age < 13 || answers.age > 120) {
      newErrors.age = 'Age must be between 13 and 120';
    }

    if (!answers.weight) {
      newErrors.weight = 'Weight is required';
    } else if (answers.weight < 30 || answers.weight > 300) {
      newErrors.weight = 'Weight must be between 30 and 300 kg';
    }

    if (!answers.height) {
      newErrors.height = 'Height is required';
    } else if (answers.height < 100 || answers.height > 250) {
      newErrors.height = 'Height must be between 100 and 250 cm';
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
      await saveStep1({
        age: parseInt(answers.age),
        weight: parseFloat(answers.weight),
        height: parseFloat(answers.height)
      });
    } catch (error) {
      console.error('Error saving step 1:', error);
      alert('Failed to save. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ Calculate BMI
  const calculateBMI = () => {
    if (answers.height && answers.weight) {
      const heightInMeters = answers.height / 100;
      const bmi = answers.weight / (heightInMeters * heightInMeters);
      return bmi.toFixed(1);
    }
    return null;
  };

  const bmi = calculateBMI();

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
            <PersonFill size={35} />
          </div>
          <h3 className="fw-bold mb-2">Personal Information</h3>
          <p className="text-muted">Tell us about yourself to personalize your fitness journey</p>
        </div>

        {/* Form */}
        <Form onSubmit={handleSubmit}>
          <Row>
            {/* Age */}
            <Col md={12} className="mb-4">
              <Form.Group>
                <Form.Label className="fw-semibold">
                  How old are you?
                  <span className="text-danger">*</span>
                </Form.Label>
                <InputGroup>
                  <Form.Control
                    type="number"
                    placeholder="Enter your age"
                    value={answers.age}
                    onChange={(e) => setAnswers({...answers, age: e.target.value})}
                    isInvalid={!!errors.age}
                    style={{ height: '50px' }}
                    disabled={submitting}
                  />
                  <InputGroup.Text>years</InputGroup.Text>
                  <Form.Control.Feedback type="invalid">
                    {errors.age}
                  </Form.Control.Feedback>
                </InputGroup>
                <Form.Text className="text-muted">
                  Must be 13 years or older
                </Form.Text>
              </Form.Group>
            </Col>

            {/* Weight */}
            <Col md={6} className="mb-4">
              <Form.Group>
                <Form.Label className="fw-semibold">
                  What's your current weight?
                  <span className="text-danger">*</span>
                </Form.Label>
                <InputGroup>
                  <Form.Control
                    type="number"
                    step="0.1"
                    placeholder="Enter weight"
                    value={answers.weight}
                    onChange={(e) => setAnswers({...answers, weight: e.target.value})}
                    isInvalid={!!errors.weight}
                    style={{ height: '50px' }}
                    disabled={submitting}
                  />
                  <InputGroup.Text>kg</InputGroup.Text>
                  <Form.Control.Feedback type="invalid">
                    {errors.weight}
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
            </Col>

            {/* Height */}
            <Col md={6} className="mb-4">
              <Form.Group>
                <Form.Label className="fw-semibold">
                  What's your height?
                  <span className="text-danger">*</span>
                </Form.Label>
                <InputGroup>
                  <Form.Control
                    type="number"
                    step="0.1"
                    placeholder="Enter height"
                    value={answers.height}
                    onChange={(e) => setAnswers({...answers, height: e.target.value})}
                    isInvalid={!!errors.height}
                    style={{ height: '50px' }}
                    disabled={submitting}
                  />
                  <InputGroup.Text>cm</InputGroup.Text>
                  <Form.Control.Feedback type="invalid">
                    {errors.height}
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
            </Col>
          </Row>

          {/* BMI Preview */}
          {bmi && (
            <Alert variant="info" className="mb-4">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <strong>Your BMI:</strong> {bmi}
                  <span className="ms-2 text-muted">
                    {bmi < 18.5 && '(Underweight)'}
                    {bmi >= 18.5 && bmi < 25 && '(Normal)'}
                    {bmi >= 25 && bmi < 30 && '(Overweight)'}
                    {bmi >= 30 && '(Obese)'}
                  </span>
                </div>
                <small className="text-muted">Body Mass Index</small>
              </div>
            </Alert>
          )}

          {/* Submit Button */}
          <div className="d-flex justify-content-end">
            <Button
              type="submit"
              size="lg"
              className="px-5 fw-semibold"
              style={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                height: '50px'
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
