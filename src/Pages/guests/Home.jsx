import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="py-5" style={{ backgroundColor: '#667eea', color: 'white' }}>
        <Container>
          <Row className="align-items-center">
            <Col xs={12} md={6} className="mb-4 mb-md-0">
              <h1 className="display-4 fw-bold">Welcome to Our Platform</h1>
              <p className="lead">
                Discover amazing features and services designed to make your life easier. 
                Join thousands of satisfied users today.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Button variant="light" size="lg">Get Started</Button>
                <Button variant="outline-light" size="lg">Learn More</Button>
              </div>
            </Col>
            <Col xs={12} md={6}>
              <Card className="shadow-lg rounded-4 overflow-hidden">
                <Card.Img 
                  variant="top" 
                  src="/public/image_runing.jpg" 
                  alt="fitness image"
                  style={{ objectFit: 'cover', height: '100%' }}
                />
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-5" style={{ backgroundColor: '#f8f9fa' }}>
        <Container>
          <div className="text-center mb-5">
            <h2 className="fw-bold">Our Features</h2>
            <p className="text-muted">Everything you need in one place</p>
          </div>
          <Row className="g-4">
            {[
              {
                title: 'Fast & Reliable',
                description: 'Lightning-fast performance with 99.9% uptime guarantee for all your needs.',
                color: '#667eea'
              },
              {
                title: 'Secure & Safe',
                description: 'Enterprise-grade security to protect your data with advanced encryption.',
                color: '#48bb78'
              },
              {
                title: 'Easy to Use',
                description: 'Intuitive interface designed for everyone, no technical skills required.',
                color: '#4299e1'
              }
            ].map((feature, idx) => (
              <Col xs={12} md={4} key={idx}>
                <Card className="h-100 text-center shadow-sm border-0 p-4 rounded-3">
                  <div className="mb-3 d-flex align-items-center justify-content-center" style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    backgroundColor: `${feature.color}20`,
                    color: feature.color,
                    margin: '0 auto'
                  }}>
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={feature.color} strokeWidth="2">
                      <circle cx="12" cy="12" r="10"></circle>
                    </svg>
                  </div>
                  <Card.Title className="fw-bold">{feature.title}</Card.Title>
                  <Card.Text className="text-muted">{feature.description}</Card.Text>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-5" style={{ backgroundColor: '#1a202c', color: 'white' }}>
        <Container>
          <Row className="align-items-center">
            <Col xs={12} md={8}>
              <h2 className="fw-bold">Ready to get started?</h2>
              <p className="lead text-white-50">
                Join our community today and experience the difference.
              </p>
            </Col>
            <Col xs={12} md={4} className="text-md-end">
              <Button variant="light" size="lg">Sign Up Now</Button>
            </Col>
          </Row>
        </Container>
      </section>


    </div>
  );
}
