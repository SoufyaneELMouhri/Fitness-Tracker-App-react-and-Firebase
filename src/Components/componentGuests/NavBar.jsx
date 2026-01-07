// Components/componentGuests/NavBar.jsx - Modern Gradient Style
import React from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { UseAuth } from "../../Hooks/UseAuth";
import { useRoleNavigation } from "../../Hooks/useRoleNavigation";

export default function NavBar() {
  const location = useLocation();
  const { isAuthenticated } = UseAuth();
  const { navigateToDashboard } = useRoleNavigation();

  const isActive = (path) => 
    location.pathname === path ? "text-primary fw-bold" : "text-dark";

  return (
    <Navbar
      expand="lg"
      className="shadow-sm py-3"
      style={{ 
        background: "#ffffffcc", 
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(0,0,0,0.05)"
      }}
      sticky="top"
    >
      <Container>
        <Navbar.Brand
          as={Link}
          to="/"
          className="fw-bold fs-4"
          style={{ 
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "1px" 
          }}
        >
          🏋️‍♂️ FitnessTracker
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center gap-3">
            <Nav.Link as={Link} to="/" className={isActive("/")}>
              Home
            </Nav.Link>

            {isAuthenticated ? (
              <Button
                onClick={navigateToDashboard}
                className="px-4 py-2 fw-semibold rounded-pill position-relative overflow-hidden"
                style={{ 
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  border: "none",
                  color: "white",
                  boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
                  transition: "all 0.3s ease"
                }}
              >
                <span className="position-relative" style={{ zIndex: 1 }}>
                  Go to Dashboard →
                </span>
              </Button>
            ) : (
              <>
                <Nav.Link 
                  as={Link} 
                  to="/login" 
                  className={isActive("/login")}
                  style={{ fontWeight: 500 }}
                >
                  Login
                </Nav.Link>
                <Button
                  as={Link}
                  to="/register"
                  className="px-4 py-2 fw-semibold rounded-pill"
                  style={{ 
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    border: "none",
                    color: "white",
                    boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)"
                  }}
                >
                  Get Started
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
