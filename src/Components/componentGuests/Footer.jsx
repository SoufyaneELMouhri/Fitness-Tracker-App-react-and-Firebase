import React from 'react';
import { Container, Row, Col, Nav } from 'react-bootstrap';
import { Facebook, Twitter, Instagram, Linkedin } from 'react-bootstrap-icons';

export default function Footer() {
  return (
    <footer className="py-5" >
      <Container>
        <Row className="mb-4">
          <Col xs={12} md={4} className="mb-3 mb-md-0">
            <h5 className="fw-bold">Fitness Tracker</h5>
            <p style={{ fontSize: '0.9rem', color: '#bbb' }}>
              Track your workouts, monitor progress, and achieve your fitness goals with ease.
            </p>
          </Col>

          <Col xs={6} md={2} className="mb-3 mb-md-0">
            <h6 className="fw-bold">Links</h6>
            <Nav className="flex-column">
              <Nav.Link href="#" className="p-0 text-muted">Home</Nav.Link>
              <Nav.Link href="#" className="p-0 text-muted">Dashboard</Nav.Link>
              <Nav.Link href="#" className="p-0 text-muted">Workouts</Nav.Link>
              <Nav.Link href="#" className="p-0 text-muted">Profile</Nav.Link>
            </Nav>
          </Col>

          <Col xs={6} md={2} className="mb-3 mb-md-0">
            <h6 className="fw-bold">Resources</h6>
            <Nav className="flex-column">
              <Nav.Link href="#" className="p-0 text-muted">Blog</Nav.Link>
              <Nav.Link href="#" className="p-0 text-muted">FAQ</Nav.Link>
              <Nav.Link href="#" className="p-0 text-muted">Support</Nav.Link>
            </Nav>
          </Col>

          <Col xs={12} md={4} className="d-flex flex-column align-items-md-end">
            <h6 className="fw-bold">Follow Us</h6>
            <div className="d-flex gap-3 mt-2">
              <a href="#" style={{ color: '#bbb' }}><Facebook size={24} /></a>
              <a href="#" style={{ color: '#bbb' }}><Twitter size={24} /></a>
              <a href="#" style={{ color: '#bbb' }}><Instagram size={24} /></a>
              <a href="#" style={{ color: '#bbb' }}><Linkedin size={24} /></a>
            </div>
          </Col>
        </Row>

        <Row>
          <Col className="text-center text-muted" style={{ fontSize: '0.85rem' }}>
            © 2024 Fitness Tracker. All rights reserved.
          </Col>
        </Row>
      </Container>
    </footer>
  );
}
