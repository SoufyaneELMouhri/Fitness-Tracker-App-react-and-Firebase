import React from 'react';
import { Container, Alert, Button } from 'react-bootstrap';
import { CheckCircle } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';

export default function VerifiedAccount() {
  const navigate = useNavigate();

  return (
    <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center p-3">
      <Container style={{ maxWidth: '600px' }}>
        <div className="bg-white rounded-4 shadow-sm p-4 p-md-5">
          <div className="text-center">
            {/* Icon Circle */}
            <div className="bg-success rounded-circle mx-auto mb-4 d-flex align-items-center justify-content-center shadow">
              <CheckCircle size={40} color="white" style={{ width: '80px', height: '80px' }} />
            </div>

            {/* Title */}
            <h2 className="fw-bold mb-4 text-dark">
              Account Created Successfully!
            </h2>

            {/* Alert */}
            <Alert variant="success" className="text-start mb-4">
              <p className="mb-2 fw-semibold">
                Please verify your email address
              </p>
              <p className="mb-0 small">
                We've sent a verification link to your email. 
                Click the link to activate your account and then you can login.
              </p>
            </Alert>

            {/* Help Text */}
            <p className="text-muted small mb-3">
              Didn't receive the email? Check your spam folder.
            </p>

            {/* Button */}
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/login')}
              className="px-5 rounded-3"
            >
              Go to Login
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
