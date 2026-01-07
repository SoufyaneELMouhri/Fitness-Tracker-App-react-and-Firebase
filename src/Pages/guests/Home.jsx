import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { UseAuth } from '../../Hooks/UseAuth';
import { useRoleNavigation } from '../../Hooks/useRoleNavigation';

export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated, currentUser } = UseAuth();
  const { navigateToDashboard } = useRoleNavigation();

  return (
    <div>
      {/* Hero Section */}
      <section className="py-5" style={{ backgroundColor: '#667eea', color: 'white' }}>
        <Container>
          <Row className="align-items-center">
            <Col xs={12} md={6} className="mb-4 mb-md-0">
              <h1 className="display-4 fw-bold">
                {isAuthenticated 
                  ? `Welcome Back, ${currentUser?.display_name || 'User'}!` 
                  : 'Welcome to FitTracker'}
              </h1>
              <p className="lead">
                {isAuthenticated
                  ? 'Ready to continue your fitness journey? Track your progress and achieve your goals.'
                  : 'Discover amazing features and services designed to make your fitness goals a reality. Join thousands of satisfied users today.'}
              </p>
              
              {/* ✅ Conditional Buttons */}
              <div className="d-flex flex-wrap gap-3">
                {isAuthenticated ? (
                  <>
                    <Button 
                      variant="light" 
                      size="lg"
                      onClick={navigateToDashboard}
                    >
                      Go to Dashboard
                    </Button>
                    <Button 
                      variant="outline-light" 
                      size="lg"
                      onClick={() => navigate('/app/workouts')}
                    >
                      My Workouts
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      variant="light" 
                      size="lg"
                      onClick={() => navigate('/register')}
                    >
                      Get Started
                    </Button>
                    <Button 
                      variant="outline-light" 
                      size="lg"
                      onClick={() => navigate('/login')}
                    >
                      Sign In
                    </Button>
                  </>
                )}
              </div>
            </Col>
            <Col xs={12} md={6}>
              <Card className="shadow-lg rounded-4 overflow-hidden">
                <Card.Img 
                  variant="top" 
                  src="/image_runing.jpg" 
                  alt="fitness image"
                  style={{ objectFit: 'cover', height: '400px' }}
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
            <p className="text-muted">Everything you need to reach your fitness goals</p>
          </div>
          <Row className="g-4">
            {[
              {
                title: 'Track Workouts',
                description: 'Log your exercises, sets, reps, and monitor your progress over time with detailed analytics.',
                color: '#667eea',
                icon: '💪'
              },
              {
                title: 'Nutrition Plans',
                description: 'Plan your meals, track calories and macros, and maintain a balanced diet effortlessly.',
                color: '#48bb78',
                icon: '🥗'
              },
              {
                title: 'Progress Reports',
                description: 'Visualize your fitness journey with charts, graphs, and achievement milestones.',
                color: '#4299e1',
                icon: '📊'
              }
            ].map((feature, idx) => (
              <Col xs={12} md={4} key={idx}>
                <Card className="h-100 text-center shadow-sm border-0 p-4 rounded-3 hover-lift">
                  <div className="mb-3 d-flex align-items-center justify-content-center" style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    backgroundColor: `${feature.color}20`,
                    color: feature.color,
                    margin: '0 auto',
                    fontSize: '2rem'
                  }}>
                    {feature.icon}
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
              {isAuthenticated ? (
                <>
                  <h2 className="fw-bold">Keep Pushing Forward!</h2>
                  <p className="lead text-white-50">
                    Your fitness goals are within reach. Stay consistent and track your progress daily.
                  </p>
                </>
              ) : (
                <>
                  <h2 className="fw-bold">Ready to get started?</h2>
                  <p className="lead text-white-50">
                    Join our community today and transform your fitness journey.
                  </p>
                </>
              )}
            </Col>
            <Col xs={12} md={4} className="text-md-end">
              {isAuthenticated ? (
                <Button 
                  variant="light" 
                  size="lg"
                  onClick={navigateToDashboard}
                >
                  View Dashboard
                </Button>
              ) : (
                <Button 
                  variant="light" 
                  size="lg"
                  onClick={() => navigate('/register')}
                >
                  Sign Up Now
                </Button>
              )}
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
}
