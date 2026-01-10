// pages/Register.jsx
import { Container, Row, Col, Card, Form, Button, InputGroup } from 'react-bootstrap';
import { Envelope, Lock, Person, Eye, EyeSlash } from 'react-bootstrap-icons';
import { useState } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { UseAuth } from '../../Hooks/UseAuth';

const registerSchema = Yup.object({
  display_name: Yup.string()
    .min(3, 'Full name must be at least 3 characters')
    .required('Full name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
});

export default function Register() {
  const navigate = useNavigate();
  const { register } = UseAuth();
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Container 
      fluid 
      className="d-flex align-items-center justify-content-center py-5" 
      style={{ 
        backgroundColor: '#f8f9fa',
        minHeight: '100vh'
      }}
    >
      <Row className="w-100 justify-content-center">
        <Col xs={12} sm={10} md={8} lg={6} xl={5}>
          <Card 
            className="shadow border-0" 
            style={{ 
              borderRadius: '16px'
            }}
          >
            <Card.Body className="p-4 p-md-5">
              {/* Header */}
              <div className="text-center mb-4">
                <div 
                  className="mx-auto mb-3 d-flex align-items-center justify-content-center"
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    backgroundColor: '#0d6efd',
                    boxShadow: '0 4px 12px rgba(13, 110, 253, 0.25)'
                  }}
                >
                  <Person size={40} color="white" />
                </div>
                <h1 className="fw-bolder mb-2" style={{ color: '#1a1f36', fontSize: '1.75rem' }}>
                  Create Account
                </h1>
                <p className="text-muted mb-0" style={{ fontSize: '0.95rem' }}>
                  Join us today and get started
                </p>
              </div>

              <Formik
                initialValues={{
                  display_name: '',
                  email: '',
                  password: '',
                  confirmPassword: '',
                }}
                validationSchema={registerSchema}
                onSubmit={async (values, { resetForm, setSubmitting, setErrors }) => {
                  setIsLoading(true);
                  try {
                    await register(
                      values.email,
                      values.password,
                      values.display_name
                    );

                    console.log('✅ Registration successful');
                    resetForm();
                    
                    // Navigate to verification page
                    navigate('/verified-account', { replace: true });
                  } catch (error) {
                    console.error('❌ Registration error:', error);
                    let errorMessage = 'Registration failed. Please try again.';
                    
                    if (error.code === 'auth/email-already-in-use') {
                      errorMessage = 'This email is already registered. Please go to Login.';
                    } else if (error.code === 'auth/weak-password') {
                      errorMessage = 'Password is too weak.';
                    } else if (error.code === 'auth/invalid-email') {
                      errorMessage = 'Invalid email address.';
                    } else if (error.code === 'auth/operation-not-allowed') {
                      errorMessage = 'Email/Password authentication is not enabled.';
                    } else if (error.message) {
                      errorMessage = error.message;
                    }
                    
                    setErrors({ submit: errorMessage });
                  } finally {
                    setIsLoading(false);
                    setSubmitting(false);
                  }
                }}
              >
                {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
                  <Form onSubmit={handleSubmit}>
                    {/* Full Name */}
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold mb-2" style={{ color: '#1a1f36', fontSize: '0.95rem' }}>
                        Full Name
                      </Form.Label>
                      <InputGroup>
                        <InputGroup.Text 
                          style={{ 
                            backgroundColor: 'white',
                            border: '1px solid #dee2e6',
                            borderRight: 'none'
                          }}
                        >
                          <Person color="#6c757d" size={20} />
                        </InputGroup.Text>
                        <Form.Control
                          type="text"
                          name="display_name"
                          value={values.display_name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Enter your full name"
                          isInvalid={touched.display_name && !!errors.display_name}
                          style={{ 
                            border: '1px solid #dee2e6',
                            borderLeft: 'none',
                            padding: '0.75rem 1rem',
                            fontSize: '0.95rem'
                          }}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.display_name}
                        </Form.Control.Feedback>
                      </InputGroup>
                    </Form.Group>

                    {/* Email */}
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold mb-2" style={{ color: '#1a1f36', fontSize: '0.95rem' }}>
                        Email Address
                      </Form.Label>
                      <InputGroup>
                        <InputGroup.Text 
                          style={{ 
                            backgroundColor: 'white',
                            border: '1px solid #dee2e6',
                            borderRight: 'none'
                          }}
                        >
                          <Envelope color="#6c757d" size={20} />
                        </InputGroup.Text>
                        <Form.Control
                          type="email"
                          name="email"
                          value={values.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Enter your email"
                          isInvalid={touched.email && !!errors.email}
                          style={{ 
                            border: '1px solid #dee2e6',
                            borderLeft: 'none',
                            padding: '0.75rem 1rem',
                            fontSize: '0.95rem'
                          }}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.email}
                        </Form.Control.Feedback>
                      </InputGroup>
                    </Form.Group>

                    {/* Password */}
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold mb-2" style={{ color: '#1a1f36', fontSize: '0.95rem' }}>
                        Password
                      </Form.Label>
                      <InputGroup>
                        <InputGroup.Text 
                          style={{ 
                            backgroundColor: 'white',
                            border: '1px solid #dee2e6',
                            borderRight: 'none'
                          }}
                        >
                          <Lock color="#6c757d" size={20} />
                        </InputGroup.Text>
                        <Form.Control
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          value={values.password}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Create a password"
                          isInvalid={touched.password && !!errors.password}
                          style={{ 
                            border: '1px solid #dee2e6',
                            borderLeft: 'none',
                            borderRight: 'none',
                            padding: '0.75rem 1rem',
                            fontSize: '0.95rem'
                          }}
                        />
                        <InputGroup.Text
                          style={{ 
                            cursor: 'pointer',
                            backgroundColor: 'white',
                            border: '1px solid #dee2e6',
                            borderLeft: 'none'
                          }}
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeSlash color="#6c757d" size={20} /> : <Eye color="#6c757d" size={20} />}
                        </InputGroup.Text>
                        <Form.Control.Feedback type="invalid">
                          {errors.password}
                        </Form.Control.Feedback>
                      </InputGroup>
                      {!errors.password && values.password && (
                        <small className="text-muted" style={{ fontSize: '0.85rem' }}>
                          At least 6 characters with uppercase and number
                        </small>
                      )}
                    </Form.Group>

                    {/* Confirm Password */}
                    <Form.Group className="mb-4">
                      <Form.Label className="fw-bold mb-2" style={{ color: '#1a1f36', fontSize: '0.95rem' }}>
                        Confirm Password
                      </Form.Label>
                      <InputGroup>
                        <InputGroup.Text 
                          style={{ 
                            backgroundColor: 'white',
                            border: '1px solid #dee2e6',
                            borderRight: 'none'
                          }}
                        >
                          <Lock color="#6c757d" size={20} />
                        </InputGroup.Text>
                        <Form.Control
                          type={showConfirmPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          value={values.confirmPassword}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Confirm your password"
                          isInvalid={touched.confirmPassword && !!errors.confirmPassword}
                          style={{ 
                            border: '1px solid #dee2e6',
                            borderLeft: 'none',
                            borderRight: 'none',
                            padding: '0.75rem 1rem',
                            fontSize: '0.95rem'
                          }}
                        />
                        <InputGroup.Text
                          style={{ 
                            cursor: 'pointer',
                            backgroundColor: 'white',
                            border: '1px solid #dee2e6',
                            borderLeft: 'none'
                          }}
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeSlash color="#6c757d" size={20} /> : <Eye color="#6c757d" size={20} />}
                        </InputGroup.Text>
                        <Form.Control.Feedback type="invalid">
                          {errors.confirmPassword}
                        </Form.Control.Feedback>
                      </InputGroup>
                    </Form.Group>

                    {/* Error Message */}
                    {errors.submit && (
                      <div 
                        className="alert mb-4 fw-semibold border-0 shadow-sm" 
                        role="alert"
                        style={{
                          backgroundColor: '#fff3f3',
                          color: '#c62828',
                          borderRadius: '8px',
                          fontSize: '0.9rem'
                        }}
                      >
                        {errors.submit}
                      </div>
                    )}

                    {/* Submit Button */}
                    <div className="d-grid mb-3">
                      <Button
                        type="submit"
                        size="lg"
                        disabled={isLoading}
                        className="fw-bold shadow-sm"
                        style={{
                          backgroundColor: '#0d6efd',
                          border: 'none',
                          padding: '0.85rem',
                          borderRadius: '10px',
                          fontSize: '1rem',
                          letterSpacing: '0.3px',
                          height: '56px',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        {isLoading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Creating account...
                          </>
                        ) : (
                          'Create Account'
                        )}
                      </Button>
                    </div>

                    {/* Login Link */}
                    <div className="text-center pt-3" style={{ borderTop: '1px solid #dee2e6' }}>
                      <span className="text-muted" style={{ fontSize: '0.95rem' }}>
                        Already have an account?{' '}
                      </span>
                      <a 
                        href="/login" 
                        className="text-decoration-none fw-bold"
                        style={{ color: '#0d6efd', fontSize: '0.95rem' }}
                      >
                        Sign in
                      </a>
                    </div>
                  </Form>
                )}
              </Formik>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
