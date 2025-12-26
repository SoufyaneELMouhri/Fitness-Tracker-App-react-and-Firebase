import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import { EnvelopeFill, LockFill, EyeFill, EyeSlashFill } from 'react-bootstrap-icons';
import AuthService from '../../services/authServices';

// Validation Schema
const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState(null);

  const handleLogin = async (values, { setSubmitting }) => {
    setAuthError(null);

    try {
      // Call login service
      const { user, role, error } = await AuthService.login(values.email, values.password);

      if (error) {
        setAuthError(error);
        setSubmitting(false);
        return;
      }

      if (!user || !role) {
        setAuthError('Login failed. Please try again.');
        setSubmitting(false);
        return;
      }

      // Role-based redirection
      if (role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else if (role === 'coach') {
        navigate('/coach/dashboard', { replace: true });
      } else {
        navigate('/app/dashboard', { replace: true });
      }
    } catch (error) {
      console.error('Login error:', error);
      setAuthError('An unexpected error occurred. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center p-3">
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} md={8} lg={5}>
            <Card className="border-0 shadow-sm rounded-4">
              <Card.Body className="p-4 p-md-5">
                {/* Header */}
                <div className="text-center mb-4">
                  <h2 className="fw-bold mb-2">Welcome Back</h2>
                  <p className="text-muted">Sign in to your FitTracker account</p>
                </div>

                {/* Error Alert */}
                {authError && (
                  <Alert variant="danger" dismissible onClose={() => setAuthError(null)}>
                    {authError}
                  </Alert>
                )}

                {/* Formik Form */}
                <Formik
                  initialValues={{ email: '', password: '' }}
                  validationSchema={loginSchema}
                  onSubmit={handleLogin}
                >
                  {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    isSubmitting,
                  }) => (
                    <Form onSubmit={handleSubmit}>
                      {/* Email Field */}
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Email Address</Form.Label>
                        <div className="position-relative">
                          <EnvelopeFill 
                            className="position-absolute text-muted" 
                            style={{ left: '15px', top: '50%', transform: 'translateY(-50%)', zIndex: 1 }}
                            size={18}
                          />
                          <Form.Control
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={values.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={touched.email && errors.email}
                            className="ps-5"
                            style={{ height: '50px' }}
                            disabled={isSubmitting}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.email}
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>

                      {/* Password Field */}
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Password</Form.Label>
                        <div className="position-relative">
                          <LockFill 
                            className="position-absolute text-muted" 
                            style={{ left: '15px', top: '50%', transform: 'translateY(-50%)', zIndex: 1 }}
                            size={18}
                          />
                          <Form.Control
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            placeholder="Enter your password"
                            value={values.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={touched.password && errors.password}
                            className="ps-5 pe-5"
                            style={{ height: '50px' }}
                            disabled={isSubmitting}
                          />
                          <Button
                            variant="link"
                            className="position-absolute text-muted p-0"
                            style={{ right: '15px', top: '50%', transform: 'translateY(-50%)', zIndex: 1 }}
                            onClick={() => setShowPassword(!showPassword)}
                            type="button"
                            disabled={isSubmitting}
                          >
                            {showPassword ? <EyeSlashFill size={18} /> : <EyeFill size={18} />}
                          </Button>
                          <Form.Control.Feedback type="invalid">
                            {errors.password}
                          </Form.Control.Feedback>
                        </div>
                      </Form.Group>

                      {/* Forgot Password Link */}
                      <div className="text-end mb-3">
                        <Link to="/forgot-password" className="text-primary text-decoration-none small">
                          Forgot password?
                        </Link>
                      </div>

                      {/* Submit Button */}
                      <Button
                        variant="primary"
                        type="submit"
                        className="w-100 fw-semibold"
                        size="lg"
                        disabled={isSubmitting}
                        style={{ height: '50px' }}
                      >
                        {isSubmitting ? (
                          <>
                            <Spinner
                              as="span"
                              animation="border"
                              size="sm"
                              role="status"
                              aria-hidden="true"
                              className="me-2"
                            />
                            Signing in...
                          </>
                        ) : (
                          'Sign In'
                        )}
                      </Button>
                    </Form>
                  )}
                </Formik>

                {/* Register Link */}
                <div className="text-center mt-4">
                  <p className="text-muted mb-0">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-primary text-decoration-none fw-semibold">
                      Sign up
                    </Link>
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
