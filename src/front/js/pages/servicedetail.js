// src/front/js/pages/ServiceDetail.js
import React from 'react';
import { Container, Card } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

export const ServiceDetail = () => {
  const { id } = useParams();

  // Datos estáticos de ejemplo
  const serviceDetails = {
    1: "Detalles sobre exámenes de vista...",
    2: "Detalles sobre cirugías...",
    3: "Detalles sobre tratamientos..."
  };

  return (
    <Container className="mt-4">
      <Card>
        <Card.Body>
          <Card.Title>Detalles del Servicio</Card.Title>
          <Card.Text>
            {serviceDetails[id] || "No hay detalles disponibles para este servicio."}
          </Card.Text>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ServiceDetail;
