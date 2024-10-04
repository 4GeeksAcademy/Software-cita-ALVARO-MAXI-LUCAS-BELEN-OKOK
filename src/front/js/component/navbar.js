import React, { useContext } from "react";
import { Navbar as BootstrapNavbar, Nav, Container } from "react-bootstrap";
import { FaHome, FaUserAlt, FaCalendarAlt, FaEnvelope, FaSignInAlt, FaUserPlus, FaSignOutAlt, FaChartBar, FaClock } from "react-icons/fa";
import { AuthContext } from "../store/AuthContext"; // Make sure you have this context to manage user authentication
import { useLocation } from 'react-router-dom'; // Import useLocation to detect the current path
import '../../styles/home.css';
import logo from '../../img/logo.png'; // Import the logo image

export const CustomNavbar = () => {
  const { user, logout } = useContext(AuthContext); // Access the user state and logout function
  const location = useLocation(); // Get the current path

  return (
    <BootstrapNavbar variant="dark" expand="lg" className="shadow-sm py-3 sticky-top custom-navbar">
      <Container>
        <BootstrapNavbar.Brand href="/" className="font-weight-bold text-uppercase d-flex align-items-center">
          <img src={logo} alt="Logo" width="90" height="70" className="mr-2" />
          Oftalmología
        </BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto text-uppercase">
            {location.pathname === "/admin" ? (
              <>
                {/* lINKS PARA EL ADMIN :) */}
                <Nav.Link href="#dates-section" className="mx-3">
                  <FaCalendarAlt className="mr-1" /> Dates
                </Nav.Link>
                <Nav.Link href="#doctors-section" className="mx-3">
                  <FaUserAlt className="mr-1" /> Doctors
                </Nav.Link>
                <Nav.Link href="#availability-section" className="mx-3">
                  <FaClock className="mr-1" /> Availability
                </Nav.Link>
                <Nav.Link href="#statistics-section" className="mx-3">
                  <FaChartBar className="mr-1" /> Statistics
                </Nav.Link>
              </>
            ) : (
              <>
                {/* Nvbar regular */}
                <Nav.Link href="/" className="mx-3">
                  <FaHome className="mr-1" /> Home
                </Nav.Link>
                <Nav.Link href="/services" className="mx-3">
                  <FaCalendarAlt className="mr-1" /> Services
                </Nav.Link>
                <Nav.Link href="/appointment" className="mx-3">
                  <FaUserAlt className="mr-1" /> Appointment
                </Nav.Link>
                <Nav.Link href="/testimonials" className="mx-3">
                  <FaEnvelope className="mr-1" /> Testimonials
                </Nav.Link>
                <Nav.Link href="/contact" className="mx-3">
                  <FaEnvelope className="mr-1" /> Contact
                </Nav.Link>
              </>
            )}

            {/* Condicional para el perfilo o logout */}
            {user ? (
              <>
                <Nav.Link href="/dashboard" className="mx-3">
                  <FaUserAlt className="mr-1" /> My Profile
                </Nav.Link>
                <Nav.Link href="/login" onClick={logout} className="mx-3 me-auto">
                  <FaSignOutAlt className="mr-1" /> Logout
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link href="/login" className="mx-3 me-auto">
                  <FaSignInAlt className="mr-1" /> Login
                </Nav.Link>
                <Nav.Link href="/register" className="mx-3 me-auto">
                  <FaUserPlus className="mr-1" /> Register
                </Nav.Link>
              </>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};
