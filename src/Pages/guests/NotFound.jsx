import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { House, ArrowLeft, ExclamationCircle } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center p-3">
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} md={8} lg={6}>
            <Card className="border-0 shadow-sm text-center rounded-4 p-4 p-md-5">
              <Card.Body>
                {/* Icon Circle */}
                <div className="bg-primary rounded-circle mx-auto mb-4 d-flex align-items-center justify-content-center shadow">
                  <ExclamationCircle size={80} color="white" style={{ width: '150px', height: '150px' }} />
                </div>

                {/* 404 Text */}
                <h1 className="display-1 text-primary fw-bold mb-3">
                  404
                </h1>

                {/* Message */}
                <h2 className="h3 fw-bold text-dark mb-3">
                  Page Not Found
                </h2>

                <p className="text-muted mb-4 fs-5">
                  Sorry, we couldn't find the page you're looking for. 
                  Perhaps you've mistyped the URL? Be sure to check your spelling.
                </p>

                {/* Divider */}
                <hr className="my-4" />

                {/* Buttons */}
                <div className="d-flex gap-3 justify-content-center flex-wrap">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => navigate('/')}
                    className="d-flex align-items-center gap-2 px-4 rounded-3 fw-semibold"
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
                <p className="text-muted mt-4 mb-0 small">
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
