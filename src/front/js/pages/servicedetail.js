import React from 'react';
import { Container, Card } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

export const ServiceDetail = () => {
  const { id } = useParams();

  
  const serviceDetails = {
    1: {
      image: {
        url: "https://oftalmosalud.pe/blog/wp-content/uploads/2023/12/shutterstock_475181446-scaled.jpg", 
        description: "Te acompañamos en cada uno de tus exámenes oftalmológicos para poder acceder al tratamiento que mejor se adapte a tu necesidad.",
      },
    },
    2: {
        image: {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Desinsertion_du_muscle_CO.jpg/280px-Desinsertion_du_muscle_CO.jpg", // Cambia esto a la URL real de la imagen
        description: "Nuestras cirugías las realizan los mejores profesionales en el área, brindándote seguridad y tranquilidad al momento de la misma",
      },
    },
    3: {
      image: {
        url: "https://www.fernandez-casas.com/ext/r/450x300-1421/portada20oftalmologia20infantil20parte201.webp", // Cambia esto a la URL real de la imagen
        description: "También realizamos tratamientos para sector de pediatría",
      },
    },
  };

  const service = serviceDetails[id];

  return (
    <Container className="mt-4">
      <Card className="text-center">
        <Card.Body>
          <Card.Title>Detalles del Servicio</Card.Title>
          <Card.Text>
            {service ? (
              <>
                <div>{service.details}</div>
                <img 
                  src={service.image.url} 
                  alt={service.image.description} 
                  style={{ width: '500px', height: 'auto' }} 
                />
                <div>{service.image.description}</div>
              </>
            ) : (
              "No hay detalles disponibles para este servicio."
            )}
          </Card.Text>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ServiceDetail;