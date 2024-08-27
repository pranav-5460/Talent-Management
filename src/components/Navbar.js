import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faUser, faTachometerAlt, faUsers, faFileAlt, faBriefcase, faChartBar, faTasks, faEnvelopeOpen } from '@fortawesome/free-solid-svg-icons';
import axiosInstance from '../services/axios';

const MyNavbar = ({ isAuthenticated, setIsAuthenticated, userRole }) => {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axiosInstance.post('/auth/logout');
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      setIsAuthenticated(false);
      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error);
      alert('Logout failed. Please try again.');
    }
  };

  const handleNavClick = () => {
    setExpanded(false);
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" expanded={expanded}>
      <Container>
        <Navbar.Brand as={Link} to="/">Talent Management</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={() => setExpanded(!expanded)} />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {isAuthenticated && userRole === 'manager' && (
              <>
                <Nav.Link as={Link} to="/manager-dashboard" onClick={handleNavClick}>
                  <FontAwesomeIcon icon={faTachometerAlt} /> Dashboard
                </Nav.Link>
                <Nav.Link as={Link} to="/employees" onClick={handleNavClick}>
                  <FontAwesomeIcon icon={faUsers} /> Employees
                </Nav.Link>
                <Nav.Link as={Link} to="/reports" onClick={handleNavClick}>
                  <FontAwesomeIcon icon={faFileAlt} /> Reports
                </Nav.Link>
                <Nav.Link as={Link} to="/create-job" onClick={handleNavClick}>
                  <FontAwesomeIcon icon={faBriefcase} /> Create Job Posting
                </Nav.Link>
                <Nav.Link as={Link} to="/applications" onClick={handleNavClick}>
                  <FontAwesomeIcon icon={faEnvelopeOpen} /> Applications
                </Nav.Link>
                <Nav.Link as={Link} to="/performance-reports" onClick={handleNavClick}>
                  <FontAwesomeIcon icon={faChartBar} /> Performance Reports
                </Nav.Link>
                <Nav.Link as={Link} to="/set-goals" onClick={handleNavClick}>
                  <FontAwesomeIcon icon={faTasks} /> Set Goals
                </Nav.Link>
                <Nav.Link onClick={() => { handleLogout(); handleNavClick(); }}>
                  <FontAwesomeIcon icon={faSignOutAlt} /> Logout
                </Nav.Link>
              </>
            )}
            {isAuthenticated && userRole === 'HR' && (
              <>
                <Nav.Link as={Link} to="/hr-dashboard" onClick={handleNavClick}>
                  <FontAwesomeIcon icon={faTachometerAlt} /> HR Dashboard
                </Nav.Link>
                <Nav.Link as={Link} to="/employees" onClick={handleNavClick}>
                  <FontAwesomeIcon icon={faUsers} /> Employees
                </Nav.Link>
                <Nav.Link as={Link} to="/profile" onClick={handleNavClick}>
                  <FontAwesomeIcon icon={faUser} /> Profile
                </Nav.Link>
                <Nav.Link as={Link} to="/performance-reports" onClick={handleNavClick}>
                  <FontAwesomeIcon icon={faChartBar} /> Performance Reports
                </Nav.Link>
                <Nav.Link as={Link} to="/set-goals" onClick={handleNavClick}>
                  <FontAwesomeIcon icon={faTasks} /> Set Goals
                </Nav.Link>
                <Nav.Link onClick={() => { handleLogout(); handleNavClick(); }}>
                  <FontAwesomeIcon icon={faSignOutAlt} /> Logout
                </Nav.Link>
              </>
            )}
            {isAuthenticated && userRole === 'employee' && (
              <>
                <Nav.Link as={Link} to="/dashboard" onClick={handleNavClick}>
                  <FontAwesomeIcon icon={faTachometerAlt} /> Dashboard
                </Nav.Link>
                <Nav.Link as={Link} to="/profile" onClick={handleNavClick}>
                  <FontAwesomeIcon icon={faUser} /> Profile
                </Nav.Link>
                <Nav.Link as={Link} to="/job-vacancies" onClick={handleNavClick}>
                  Job Vacancies
                </Nav.Link>
                <Nav.Link onClick={() => { handleLogout(); handleNavClick(); }}>
                  <FontAwesomeIcon icon={faSignOutAlt} /> Logout
                </Nav.Link>
              </>
            )}
            {!isAuthenticated && (
              <>
                <Nav.Link as={Link} to="/login" onClick={handleNavClick}>Login</Nav.Link>
                <Nav.Link as={Link} to="/register" onClick={handleNavClick}>Register</Nav.Link>
                <Nav.Link as={Link} to="/job-vacancies" onClick={handleNavClick}>Job Vacancies</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default MyNavbar;
