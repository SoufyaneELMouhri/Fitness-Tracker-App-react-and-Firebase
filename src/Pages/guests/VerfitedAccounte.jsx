import React, { useState, useEffect } from 'react';
import { Container, Alert, Button, Spinner } from 'react-bootstrap';
import { CheckCircle, Envelope, ExclamationTriangle } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase/firebase';
import AuthService from '../../services/authServices';

export default function VerifiedAccount() {
  const navigate = useNavigate();
  const [resending, setResending] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const [resendError, setResendError] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
      
      if (!user) {
        setResendError('No user logged in. Please register or login again.');
      }
    });

    return () => unsubscribe();
  }, []);

  const handleResendEmail = async () => {
    if (!currentUser) {
      setResendError('No user logged in. Please login again.');
      return;
    }

    setResending(true);
    setResendMessage('');
    setResendError('');

    try {
      await AuthService.resendVerificationEmail();
      setResendMessage('Verification email sent successfully! Check your inbox.');
    } catch (error) {
      console.error('Resend Error:', error);
      
      if (error.message.includes('already verified')) {
        setResendMessage('Email is already verified! You can login now.');
        setTimeout(() => navigate('/login'), 2000);
      } else if (error.code === 'auth/too-many-requests') {
        setResendError('Too many requests. Please wait a few minutes before trying again.');
      } else if (error.message.includes('No user')) {
        setResendError('Session expired. Please login again.');
      } else {
        setResendError(error.message || 'Failed to send email. Please try again later.');
      }
    } finally {
      setResending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center p-3">
      <Container style={{ maxWidth: '600px' }}>
        <div className="bg-white rounded-4 shadow-sm p-4 p-md-5">
          <div className="text-center">
            {/* Icon Circle */}
            <div 
              className={`${currentUser ? 'bg-success' : 'bg-warning'} rounded-circle mx-auto mb-4 d-flex align-items-center justify-content-center shadow`}
              style={{ width: '80px', height: '80px' }}
            >
              {currentUser ? (
                <CheckCircle size={40} color="white" />
              ) : (
                <ExclamationTriangle size={40} color="white" />
              )}
            </div>

            {/* Title */}
            <h2 className="fw-bold mb-4 text-dark">
              {currentUser ? 'Account Created Successfully!' : 'Email Verification Required'}
            </h2>

            {/* Alert */}
            {currentUser ? (
              <Alert variant="success" className="text-start mb-4">
                <p className="mb-2 fw-semibold">
                  Please verify your email address
                </p>
                <p className="mb-0 small">
                  We've sent a verification link to <strong>{currentUser.email}</strong>. 
                  Click the link to activate your account and then you can login.
                </p>
              </Alert>
            ) : (
              <Alert variant="warning" className="text-start mb-4">
                <p className="mb-2 fw-semibold">
                  No active session found
                </p>
                <p className="mb-0 small">
                  Please login to resend the verification email.
                </p>
              </Alert>
            )}

            {/* Resend Success Message */}
            {resendMessage && (
              <Alert variant="info" className="mb-3">
                <Envelope size={16} className="me-2" />
                {resendMessage}
              </Alert>
            )}

            {/* Resend Error Message */}
            {resendError && (
              <Alert variant="danger" className="mb-3">
                {resendError}
              </Alert>
            )}

            {/* Help Text */}
            <p className="text-muted small mb-3">
              Didn't receive the email? Check your spam folder or resend it.
            </p>

            {/* Buttons */}
            <div className="d-grid gap-2">
              {/* Resend Email Button - Only if user is logged in */}
              {currentUser && (
                <Button
                  variant="outline-primary"
                  size="lg"
                  onClick={handleResendEmail}
                  disabled={resending}
                  className="rounded-3"
                >
                  {resending ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Envelope size={18} className="me-2" />
                      Resend Verification Email
                    </>
                  )}
                </Button>
              )}

              {/* Go to Login Button */}
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate('/login')}
                className="rounded-3"
              >
                {currentUser ? 'Go to Login' : 'Login to Resend Email'}
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
