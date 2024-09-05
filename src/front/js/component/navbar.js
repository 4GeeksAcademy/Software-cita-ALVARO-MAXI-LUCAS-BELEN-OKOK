import React from "react";
import { Navbar as BootstrapNavbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { FaHome, FaUserAlt, FaCalendarAlt, FaEnvelope, FaSignInAlt, FaUserPlus } from "react-icons/fa";

export const CustomNavbar = () => {
  return (
    <BootstrapNavbar bg="dark" variant="dark" expand="lg" className="shadow-sm py-3 sticky-top">
      <Container>
        <BootstrapNavbar.Brand href="/" className="font-weight-bold text-uppercase">
          Oftalmología
        </BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto text-uppercase">
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
            <Nav.Link href="/login" className="mx-3 me-auto">
              <FaSignInAlt className="mr-1" /> Login
            </Nav.Link>
            <Nav.Link href="/register" className="mx-3 me-auto">
              <FaUserPlus className="mr-1" /> Register
            </Nav.Link>
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};
