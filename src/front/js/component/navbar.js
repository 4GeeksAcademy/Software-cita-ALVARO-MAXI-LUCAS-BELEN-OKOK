import React from "react";
import { Navbar as BootstrapNavbar, Nav, Container } from "react-bootstrap";

export const CustomNavbar = () => {
  return (
    <BootstrapNavbar bg="dark" variant="dark" expand="lg">
      <Container>
        <BootstrapNavbar.Brand href="/">Oftalmologia</BootstrapNavbar.Brand>
        <Nav className="ml-auto">
          <Nav.Link href="/services">Services</Nav.Link>
          <Nav.Link href="/appointment">Appointment</Nav.Link>
          <Nav.Link href="/testimonials">Testimonials</Nav.Link>
          <Nav.Link href="/contact">Contact</Nav.Link>
          <Nav.Link href="/login">Login</Nav.Link>
          <Nav.Link href="/register">Register</Nav.Link>
        </Nav>
      </Container>
    </BootstrapNavbar>
  );
};
