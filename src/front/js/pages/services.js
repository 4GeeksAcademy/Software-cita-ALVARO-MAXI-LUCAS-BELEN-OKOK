import React from 'react';
import { Container, Card, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export const Services = () => {
  return (
    <Container className="mt-4 text-center">
      <h2>Nuestros Servicios</h2>
      <Row>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Exámenes de Vista</Card.Title>
              <Card.Text>
                Realizamos exámenes exhaustivos para evaluar tu salud ocular y te proporcionamos la receta necesaria para que puedas acceder a tus lentes con graduación de acuerdo a la patología que tengas.
                <br/>
                ¡Pudiendo acceder a los mismos dentro de la clínica!
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
                Contamos con profesionales de alto nivel que estarán contigo en todo momento para aclarar tus dudas y hacer el acompañamiento necesario previo, durante y después de la cirigía.
                <br/>
                Cada una de nuestras cirugías, cuenta con los mejores especialistas para cada condición ocular.
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