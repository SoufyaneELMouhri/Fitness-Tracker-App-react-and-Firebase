import React, { useState } from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { 
  House, 
  Activity, 
  Egg, 
  BarChart, 
  Person,
  BoxArrowRight
} from 'react-bootstrap-icons';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import AuthService from '../../services/authServices';

export default function NavigationBar() {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const handleLogout = async () => {
    try {
      await AuthService.logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleNavClick = () => {
    setExpanded(false);
  };

  return (
    <Navbar 
      expand="lg" 
      expanded={expanded}
      onToggle={setExpanded}
      bg="white"
      className="shadow-sm border-bottom border-2 py-3"
    >
      <Container>
        {/* Brand/Logo */}
        <Navbar.Brand 
          as={Link}
          to="/app"
          onClick={handleNavClick}
          className="fw-bold fs-4 text-primary"
        >
          💪 FitTracker
        </Navbar.Brand>

        {/* Mobile Toggle */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {/* Home */}
            <NavLink
              to="/app/dashboard"
              onClick={handleNavClick}
              className={({ isActive }) => 
                isActive 
                  ? 'nav-link d-flex align-items-center gap-2 px-3 py-2 bg-primary bg-opacity-10 text-primary fw-semibold rounded' 
                  : 'nav-link d-flex align-items-center gap-2 px-3 py-2 text-secondary'
              }
            >
              <House size={20} />
              <span>Home</span>
            </NavLink>

            {/* Workouts */}
            <NavLink
              to="/app/workouts"
              onClick={handleNavClick}
              className={({ isActive }) => 
                isActive 
                  ? 'nav-link d-flex align-items-center gap-2 px-3 py-2 bg-primary bg-opacity-10 text-primary fw-semibold rounded' 
                  : 'nav-link d-flex align-items-center gap-2 px-3 py-2 text-secondary'
              }
            >
              <Activity size={20} />
              <span>Workouts</span>
            </NavLink>

            {/* Nutrition */}
            <NavLink
              to="/app/nutrition"
              onClick={handleNavClick}
              className={({ isActive }) => 
                isActive 
                  ? 'nav-link d-flex align-items-center gap-2 px-3 py-2 bg-primary bg-opacity-10 text-primary fw-semibold rounded' 
                  : 'nav-link d-flex align-items-center gap-2 px-3 py-2 text-secondary'
              }
            >
              <Egg size={20} />
              <span>Nutrition</span>
            </NavLink>

            {/* Progress */}
            <NavLink
              to="/app/progress"
              onClick={handleNavClick}
              className={({ isActive }) => 
                isActive 
                  ? 'nav-link d-flex align-items-center gap-2 px-3 py-2 bg-primary bg-opacity-10 text-primary fw-semibold rounded' 
                  : 'nav-link d-flex align-items-center gap-2 px-3 py-2 text-secondary'
              }
            >
              <BarChart size={20} />
              <span>Progress</span>
            </NavLink>

            {/* Profile Dropdown */}
            <NavDropdown
              title={
                <span className="d-inline-flex align-items-center gap-2">
                  <Person size={20} />
                  <span>Profile</span>
                </span>
              }
              id="profile-dropdown"
              align="end"
            >
              <NavDropdown.Item 
                as={Link}
                to="/app/profile"
                onClick={handleNavClick}
              >
                <Person size={18} className="me-2" />
                My Profile
              </NavDropdown.Item>
              
              <NavDropdown.Divider />
              
              <NavDropdown.Item 
                onClick={handleLogout}
                className="text-danger"
              >
                <BoxArrowRight size={18} className="me-2" />
                Logout
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
