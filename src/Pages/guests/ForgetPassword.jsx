import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Envelope, ArrowLeft, Check } from 'react-bootstrap-icons';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import AuthService from '../../services/authServices';

const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
});

export default function ForgetPassword() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (values, { setSubmitting }) => {
    setError('');
    setMessage('');
    
    try {
      await AuthService.forgotPassword(values.email);
      setMessage('Password reset link has been sent to your email');
      setEmailSent(true);
    } catch (err) {
      setError(err.message || 'An error occurred while sending email');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container className="min-vh-100 d-flex align-items-center justify-content-center py-5">
      <Row className="w-100 justify-content-center">
        <Col xs={12} sm={10} md={8} lg={5}>
          <Card className="border-0 shadow-lg">
            <Card.Body className="p-4 p-md-5">
              {/* Header Section */}
              <div className="text-center mb-4">
                <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex p-3 mb-3">
                  <Envelope size={40} className="text-primary" />
                </div>
                <h2 className="fw-bold text-dark mb-2">Forgot Password?</h2>
                <p className="text-muted">
                  Enter your email and we'll send you a link to reset your password
                </p>
              </div>

              {/* Success Alert */}
              {message && (
                <Alert variant="success" className="d-flex align-items-center">
                  <Check size={20} className="me-2" />
                  {message}
                </Alert>
              )}

              {/* Error Alert */}
              {error && (
                <Alert variant="danger">
                  {error}
                </Alert>
              )}

              {/* Show form only if email not sent yet */}
              {!emailSent ? (
                <Formik
                  initialValues={{ email: '' }}
                  validationSchema={forgotPasswordSchema}
                  onSubmit={handleSubmit}
                >
                  {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
                    <Form onSubmit={handleSubmit}>
                      {/* Email Field */}
                      <Form.Group className="mb-4">
                        <Form.Label className="fw-semibold text-dark">
                          Email Address
                        </Form.Label>
                        <div className="position-relative">
                          <Form.Control
                            type="email"
                            name="email"
                            placeholder="example@email.com"
                            value={values.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={touched.email && errors.email}
                            className="py-2 ps-5"
                            style={{ borderRadius: '8px' }}
                          />
                          <Envelope 
                            className="position-absolute text-muted" 
                            size={18}
                            style={{ top: '50%', left: '12px', transform: 'translateY(-50%)' }}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.email}
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>

                      {/* Submit Button */}
                      <Button
                        type="submit"
                        variant="primary"
                        className="w-100 py-2 fw-semibold mb-3"
                        disabled={isSubmitting}
                        style={{ borderRadius: '8px' }}
                      >
                        {isSubmitting ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Sending...
                          </>
                        ) : (
                          'Send Reset Link'
                        )}
                      </Button>
                    </Form>
                  )}
                </Formik>
              ) : (
                // Success message after email sent
                <div className="text-center">
                  <p className="text-muted mb-3">
                    Check your email and follow the instructions to reset your password
                  </p>
                </div>
              )}

              {/* Back to Login Link */}
              <div className="text-center mt-4">
                <Link 
                  to="/login" 
                  className="text-decoration-none d-inline-flex align-items-center text-primary fw-semibold"
                >
                  <ArrowLeft size={18} className="me-2" />
                  Back to Login
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
