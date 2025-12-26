import React from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function NavBar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? "text-primary fw-bold" : "text-dark";

  return (
    <Navbar
      expand="lg"
      className="shadow-sm py-3"
      style={{ background: "#ffffffcc", backdropFilter: "blur(8px)" }}
      sticky="top"
    >
      <Container>
        <Navbar.Brand
          as={Link}
          to="/"
          className="fw-bold fs-4 text-primary"
          style={{ letterSpacing: "1px" }}
        >
          🏋️‍♂️ Fitness<span className="text-dark">Tracker</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center gap-3">
            <Nav.Link as={Link} to="/" className={isActive("/")}>
              Home
            </Nav.Link>

            <Nav.Link as={Link} to="/login" className={isActive("/login")}>
              Login
            </Nav.Link>
            <Button
              as={Link}
              to="/register"
              className="px-3 py-1 fw-semibold rounded-pill"
              style={{ backgroundColor: "#007bff", border: "none" }}
            >
              Register
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

