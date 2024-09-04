// src/pages/Testimonials.js
import React, { useContext } from 'react';
import { Container, Card, Row, Col } from 'react-bootstrap';
import { TestimonialContext } from '../store/TestimonialContext';

export const Testimonials = () => {
  const { testimonials } = useContext(TestimonialContext);

  return (
    <Container className="mt-4">
      <h2>Testimonios de Pacientes</h2>
      <Row>
        {testimonials.map((testimonial, index) => (
          <Col md={4} key={index} className="mb-3">
            <Card>
              <Card.Body>
                <Card.Text>"{testimonial.text}"</Card.Text>
                <Card.Subtitle className="mb-2 text-muted">{testimonial.author}</Card.Subtitle>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Testimonials;
