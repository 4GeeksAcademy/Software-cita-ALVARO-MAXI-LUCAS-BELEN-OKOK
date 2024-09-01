import React from 'react';
import { Container, Card, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export const Services = () => {
  return (
    <Container className="mt-4">
      <h2>Nuestros Servicios</h2>
      <Row>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Exámenes de Vista</Card.Title>
              <Card.Text>
                Realizamos exámenes exhaustivos para evaluar tu salud ocular.
              </Card.Text>
              <Link to="/services/1">
                <Button variant="primary">Más Información</Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Cirugías</Card.Title>
              <Card.Text>
                Ofrecemos cirugías especializadas para tratar diversas condiciones.
              </Card.Text>
              <Link to="/services/2">
                <Button variant="primary">Más Información</Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Tratamientos</Card.Title>
              <Card.Text>
                Disponemos de tratamientos avanzados para diversas enfermedades oculares.
              </Card.Text>
              <Link to="/services/3">
                <Button variant="primary">Más Información</Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Services;