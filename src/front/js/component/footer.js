import React from "react";
import { Container } from "react-bootstrap";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

export const Footer = () => (
  <footer className="footer mt-auto py-4 text-center bg-dark text-white">
    <Container>
      <p className="mb-2">
        Made with <i className="fa fa-heart text-danger" /> by{" "}
        <a href="http://www.4geeksacademy.com" className="text-white font-weight-bold" target="_blank" rel="noopener noreferrer">
          4Geeks Academy
        </a>
      </p>
      <div className="social-icons d-flex justify-content-center mb-3">
        <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="text-white mx-2">
          <FaFacebookF />
        </a>
        <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="text-white mx-2">
          <FaTwitter />
        </a>
        <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="text-white mx-2">
          <FaInstagram />
        </a>
        <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="text-white mx-2">
          <FaLinkedinIn />
        </a>
      </div>
      <p className="mb-0">© {new Date().getFullYear()} Oftalmología. All rights reserved.</p>
    </Container>
  </footer>
);
