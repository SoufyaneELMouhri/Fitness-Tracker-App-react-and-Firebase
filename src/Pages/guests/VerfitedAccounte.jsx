// Pages/guests/VerifiedAccount.jsx
import React, { useState, useEffect } from 'react';
import { Container, Alert, Button, Spinner } from 'react-bootstrap';
import { CheckCircle, Envelope, ExclamationTriangle, ArrowRight } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import { UseAuth } from '../../Hooks/UseAuth';
import AuthService from '../../services/authServices';

export default function VerifiedAccount() {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated, isEmailVerified, refreshUserData } = UseAuth();
  
  const [resending, setResending] = useState(false);
  const [checking, setChecking] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const [resendError, setResendError] = useState('');

  // ✅ 1. Auto redirect if already verified
  useEffect(() => {
    if (isAuthenticated && isEmailVerified) {
      console.log('Email already verified, redirecting...');
      navigate('/onboarding', { replace: true });
    }
  }, [isAuthenticated, isEmailVerified, navigate]);

  // ✅ Check email verification and update Firestore
  const handleCheckVerification = async () => {
    if (!currentUser) {
      setResendError('No user logged in. Please login again.');
      return;
    }

    setChecking(true);
    setResendMessage('');
    setResendError('');

    try {
      const result = await AuthService.checkAndUpdateEmailVerification();

      if (result.verified) {
        setResendMessage('✅ Email verified successfully!');
        
        // Refresh auth context
        await refreshUserData();

        // Navigate to onboarding
        setTimeout(() => {
          navigate('/onboarding', { replace: true });
        }, 1500); // ✅ 2. Reduced from 2000ms to 1500ms
      } else {
        setResendError(result.message);
      }
    } catch (error) {
      console.error('Verification check error:', error);
      setResendError(error.message || 'Failed to verify. Please try again.');
    } finally {
      setChecking(false);
    }
  };

  // ✅ Resend verification email
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
      setResendMessage('✅ Verification email sent! Check your inbox.');
    } catch (error) {
      console.error('Resend Error:', error);
      
      if (error.message.includes('already verified')) {
        setResendMessage('✅ Email is already verified! You can login now.');
        setTimeout(() => navigate('/login'), 1500);
      } else if (error.code === 'auth/too-many-requests') {
        setResendError('⚠️ Too many requests. Please wait a few minutes.');
      } else if (error.message.includes('No user')) {
        setResendError('Session expired. Please login again.');
      } else {
        setResendError(error.message || 'Failed to send email. Please try again.');
      }
    } finally {
      setResending(false);
    }
  };

  // ✅ 3. Loading state while checking auth
  if (!isAuthenticated && currentUser === undefined) {
    return (
      <div 
        className="bg-light d-flex align-items-center justify-content-center"
        style={{ minHeight: '100vh' }}
      >
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div 
      className="bg-light d-flex align-items-center justify-content-center p-3"
      style={{ minHeight: '100vh' }}
    >
      <Container style={{ maxWidth: '580px' }}>
        <div className="bg-white rounded-4 shadow p-4 p-md-5">
          <div className="text-center">
            {/* Icon Circle */}
            <div 
              className={`${isAuthenticated ? 'bg-success' : 'bg-warning'} rounded-circle mx-auto mb-4 d-flex align-items-center justify-content-center shadow-sm`}
              style={{ width: '80px', height: '80px' }}
            >
              {isAuthenticated ? (
                <CheckCircle size={40} color="white" />
              ) : (
                <ExclamationTriangle size={40} color="white" />
              )}
            </div>

            {/* Title */}
            <h1 className="fw-bolder mb-3 text-dark" style={{ fontSize: '1.75rem' }}>
              {isAuthenticated ? 'Verify Your Email' : 'Email Verification Required'}
            </h1>

            {/* Alert */}
            {isAuthenticated ? (
              <Alert variant="info" className="text-start mb-4 border-0 shadow-sm">
                <p className="mb-2 fw-bold" style={{ fontSize: '0.95rem' }}>
                  📧 Check your inbox
                </p>
                <p className="mb-0" style={{ fontSize: '0.9rem' }}>
                  We sent a verification link to <strong>{currentUser?.email}</strong>. 
                  Click the link to activate your account.
                </p>
              </Alert>
            ) : (
              <Alert variant="warning" className="text-start mb-4 border-0 shadow-sm">
                <p className="mb-2 fw-bold" style={{ fontSize: '0.95rem' }}>
                  ⚠️ No active session
                </p>
                <p className="mb-0" style={{ fontSize: '0.9rem' }}>
                  Please login to resend the verification email.
                </p>
              </Alert>
            )}

            {/* Success Message */}
            {resendMessage && (
              <Alert variant="success" className="mb-3 border-0 shadow-sm fw-semibold">
                {resendMessage}
              </Alert>
            )}

            {/* Error Message */}
            {resendError && (
              <Alert variant="danger" className="mb-3 border-0 shadow-sm fw-semibold">
                {resendError}
              </Alert>
            )}

            {/* Help Text */}
            {isAuthenticated && !resendMessage && (
              <p className="text-muted mb-4" style={{ fontSize: '0.9rem' }}>
                Didn't receive the email? Check your spam folder or click resend.
              </p>
            )}

            {/* Buttons */}
            <div className="d-grid gap-3">
              {/* Check Verification Button */}
              {isAuthenticated && (
                <Button
                  variant="success"
                  size="lg"
                  onClick={handleCheckVerification}
                  disabled={checking}
                  className="fw-bold shadow-sm"
                  style={{ 
                    height: '56px',
                    fontSize: '1rem',
                    letterSpacing: '0.3px'
                  }}
                >
                  {checking ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Checking...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={20} className="me-2" />
                      I've Verified My Email
                    </>
                  )}
                </Button>
              )}

              {/* Resend Email Button */}
              {isAuthenticated && (
                <Button
                  variant="outline-primary"
                  size="lg"
                  onClick={handleResendEmail}
                  disabled={resending || checking}
                  className="fw-semibold"
                  style={{ 
                    height: '56px',
                    fontSize: '1rem',
                    letterSpacing: '0.3px'
                  }}
                >
                  {resending ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Envelope size={20} className="me-2" />
                      Resend Verification Email
                    </>
                  )}
                </Button>
              )}

              {/* Go to Login Button */}
              <Button
                variant={isAuthenticated ? "outline-secondary" : "primary"}
                size="lg"
                onClick={() => navigate('/login')}
                disabled={checking || resending}
                className="fw-semibold"
                style={{ 
                  height: '56px',
                  fontSize: '1rem',
                  letterSpacing: '0.3px'
                }}
              >
                {isAuthenticated ? (
                  <>
                    Go to Login
                    <ArrowRight size={20} className="ms-2" />
                  </>
                ) : (
                  <>
                    Login to Resend Email
                    <ArrowRight size={20} className="ms-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
