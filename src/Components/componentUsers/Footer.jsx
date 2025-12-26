import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  Github,
  Envelope,
  GeoAlt,
  Telephone
} from 'react-bootstrap-icons';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer 
      style={{ 
        backgroundColor: '#ffffff',
        borderTop: '2px solid #e3e6ea',
        marginTop: 'auto'
      }}
    >
      {/* Main Footer Content */}
      <Container className="py-5">
        <Row className="g-4">
          {/* About Section */}
          <Col lg={4} md={6} className="mb-4 mb-lg-0">
            <h5 
              className="fw-bold mb-3" 
              style={{ color: '#0d6efd' }}
            >
              💪 FitTracker
            </h5>
            <p className="text-muted" style={{ fontSize: '0.95rem' }}>
              Your ultimate fitness companion. Track workouts, monitor nutrition, 
              and achieve your health goals with our comprehensive fitness platform.
            </p>
            
            {/* Social Media Icons */}
            <div className="d-flex gap-3 mt-3">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-decoration-none"
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: '#f8f9fa',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#0d6efd';
                  e.currentTarget.querySelector('svg').style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f8f9fa';
                  e.currentTarget.querySelector('svg').style.color = '#6c757d';
                }}
              >
                <Facebook size={18} color="#6c757d" />
              </a>

              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-decoration-none"
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: '#f8f9fa',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#0d6efd';
                  e.currentTarget.querySelector('svg').style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f8f9fa';
                  e.currentTarget.querySelector('svg').style.color = '#6c757d';
                }}
              >
                <Twitter size={18} color="#6c757d" />
              </a>

              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-decoration-none"
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: '#f8f9fa',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#0d6efd';
                  e.currentTarget.querySelector('svg').style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f8f9fa';
                  e.currentTarget.querySelector('svg').style.color = '#6c757d';
                }}
              >
                <Instagram size={18} color="#6c757d" />
              </a>

              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-decoration-none"
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: '#f8f9fa',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#0d6efd';
                  e.currentTarget.querySelector('svg').style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f8f9fa';
                  e.currentTarget.querySelector('svg').style.color = '#6c757d';
                }}
              >
                <Linkedin size={18} color="#6c757d" />
              </a>

              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-decoration-none"
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: '#f8f9fa',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#0d6efd';
                  e.currentTarget.querySelector('svg').style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f8f9fa';
                  e.currentTarget.querySelector('svg').style.color = '#6c757d';
                }}
              >
                <Github size={18} color="#6c757d" />
              </a>
            </div>
          </Col>

          {/* Quick Links */}
          <Col lg={2} md={6} className="mb-4 mb-lg-0">
            <h6 className="fw-bold mb-3" style={{ color: '#1a1f36' }}>
              Quick Links
            </h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a 
                  href="/dashboard" 
                  className="text-decoration-none"
                  style={{ color: '#6c757d', fontSize: '0.95rem', transition: 'color 0.2s' }}
                  onMouseEnter={(e) => e.target.style.color = '#0d6efd'}
                  onMouseLeave={(e) => e.target.style.color = '#6c757d'}
                >
                  Home
                </a>
              </li>
              <li className="mb-2">
                <a 
                  href="/workouts" 
                  className="text-decoration-none"
                  style={{ color: '#6c757d', fontSize: '0.95rem', transition: 'color 0.2s' }}
                  onMouseEnter={(e) => e.target.style.color = '#0d6efd'}
                  onMouseLeave={(e) => e.target.style.color = '#6c757d'}
                >
                  Workouts
                </a>
              </li>
              <li className="mb-2">
                <a 
                  href="/nutrition" 
                  className="text-decoration-none"
                  style={{ color: '#6c757d', fontSize: '0.95rem', transition: 'color 0.2s' }}
                  onMouseEnter={(e) => e.target.style.color = '#0d6efd'}
                  onMouseLeave={(e) => e.target.style.color = '#6c757d'}
                >
                  Nutrition
                </a>
              </li>
              <li className="mb-2">
                <a 
                  href="/progress" 
                  className="text-decoration-none"
                  style={{ color: '#6c757d', fontSize: '0.95rem', transition: 'color 0.2s' }}
                  onMouseEnter={(e) => e.target.style.color = '#0d6efd'}
                  onMouseLeave={(e) => e.target.style.color = '#6c757d'}
                >
                  Progress
                </a>
              </li>
            </ul>
          </Col>

          {/* Support */}
          <Col lg={3} md={6} className="mb-4 mb-lg-0">
            <h6 className="fw-bold mb-3" style={{ color: '#1a1f36' }}>
              Support
            </h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a 
                  href="/help" 
                  className="text-decoration-none"
                  style={{ color: '#6c757d', fontSize: '0.95rem', transition: 'color 0.2s' }}
                  onMouseEnter={(e) => e.target.style.color = '#0d6efd'}
                  onMouseLeave={(e) => e.target.style.color = '#6c757d'}
                >
                  Help Center
                </a>
              </li>
              <li className="mb-2">
                <a 
                  href="/faq" 
                  className="text-decoration-none"
                  style={{ color: '#6c757d', fontSize: '0.95rem', transition: 'color 0.2s' }}
                  onMouseEnter={(e) => e.target.style.color = '#0d6efd'}
                  onMouseLeave={(e) => e.target.style.color = '#6c757d'}
                >
                  FAQ
                </a>
              </li>
              <li className="mb-2">
                <a 
                  href="/privacy" 
                  className="text-decoration-none"
                  style={{ color: '#6c757d', fontSize: '0.95rem', transition: 'color 0.2s' }}
                  onMouseEnter={(e) => e.target.style.color = '#0d6efd'}
                  onMouseLeave={(e) => e.target.style.color = '#6c757d'}
                >
                  Privacy Policy
                </a>
              </li>
              <li className="mb-2">
                <a 
                  href="/terms" 
                  className="text-decoration-none"
                  style={{ color: '#6c757d', fontSize: '0.95rem', transition: 'color 0.2s' }}
                  onMouseEnter={(e) => e.target.style.color = '#0d6efd'}
                  onMouseLeave={(e) => e.target.style.color = '#6c757d'}
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </Col>

          {/* Contact Info */}
          <Col lg={3} md={6}>
            <h6 className="fw-bold mb-3" style={{ color: '#1a1f36' }}>
              Contact Us
            </h6>
            <ul className="list-unstyled">
              <li className="mb-3 d-flex align-items-start">
                <GeoAlt size={18} color="#0d6efd" className="me-2 mt-1" />
                <span className="text-muted" style={{ fontSize: '0.95rem' }}>
                  123 Fitness Street, New York, NY 10001
                </span>
              </li>
              <li className="mb-3 d-flex align-items-center">
                <Envelope size={18} color="#0d6efd" className="me-2" />
                <a 
                  href="mailto:info@fittracker.com" 
                  className="text-decoration-none"
                  style={{ color: '#6c757d', fontSize: '0.95rem', transition: 'color 0.2s' }}
                  onMouseEnter={(e) => e.target.style.color = '#0d6efd'}
                  onMouseLeave={(e) => e.target.style.color = '#6c757d'}
                >
                  info@fittracker.com
                </a>
              </li>
              <li className="mb-3 d-flex align-items-center">
                <Telephone size={18} color="#0d6efd" className="me-2" />
                <a 
                  href="tel:+1234567890" 
                  className="text-decoration-none"
                  style={{ color: '#6c757d', fontSize: '0.95rem', transition: 'color 0.2s' }}
                  onMouseEnter={(e) => e.target.style.color = '#0d6efd'}
                  onMouseLeave={(e) => e.target.style.color = '#6c757d'}
                >
                  +1 (234) 567-890
                </a>
              </li>
            </ul>
          </Col>
        </Row>
      </Container>

      {/* Bottom Copyright Bar */}
      <div 
        style={{ 
          backgroundColor: '#f8f9fa',
          borderTop: '1px solid #e3e6ea'
        }}
      >
        <Container>
          <Row>
            <Col className="text-center py-3">
              <p 
                className="mb-0 text-muted" 
                style={{ fontSize: '0.9rem' }}
              >
                © {currentYear} <span style={{ color: '#0d6efd', fontWeight: '600' }}>FitTracker</span>. 
                All rights reserved. Made with ❤️ for fitness enthusiasts.
              </p>
            </Col>
          </Row>
        </Container>
      </div>
    </footer>
  );
}
