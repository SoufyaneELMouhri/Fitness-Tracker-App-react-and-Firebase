import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { House, ArrowLeft, ShieldLock } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center p-3">
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} md={8} lg={6}>
            <Card className="border shadow-sm text-center rounded-4 p-4 p-md-5">
              <Card.Body>
                {/* Icon Circle */}
                <div className="bg-danger bg-gradient rounded-circle mx-auto mb-4 d-flex align-items-center justify-content-center shadow-lg" style={{ width: '150px', height: '150px' }}>
                  <ShieldLock size={80} color="white" />
                </div>

                {/* 403 Text */}
                <h1 className="display-1 fw-bold text-danger mb-4">
                  403
                </h1>

                {/* Message */}
                <h2 className="h3 fw-bold text-dark mb-3">
                  Access Denied
                </h2>

                <p className="text-muted mb-4 mx-auto fs-5">
                  Sorry, you don't have permission to access this resource. 
                  If you think this is a mistake, please contact support.
                </p>

                {/* Divider */}
                <hr className="my-4" />

                {/* Buttons */}
                <div className="d-flex gap-3 justify-content-center flex-wrap mb-3">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => navigate('/')}
                    className="d-flex align-items-center gap-2 px-4 rounded-3 fw-semibold shadow"
                  >
                    <House size={20} />
                    Back to Home
                  </Button>

                  <Button
                    variant="outline-primary"
                    size="lg"
                    onClick={() => navigate(-1)}
                    className="d-flex align-items-center gap-2 px-4 rounded-3 fw-semibold border-2"
                  >
                    <ArrowLeft size={20} />
                    Go Back
                  </Button>
                </div>

                {/* Help Text */}
                <p className="text-muted mb-0 small">
                  Need help? <a href="/contact" className="text-primary text-decoration-none fw-semibold">Contact Support</a>
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
