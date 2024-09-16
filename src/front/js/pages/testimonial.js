
import React, { useContext, useEffect, useState } from 'react';
import { Container, Card, Row, Col } from 'react-bootstrap';
import { TestimonialContext } from '../store/TestimonialContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalfAlt, faStar as farStar } from '@fortawesome/free-solid-svg-icons'; 
import { faStar as farEmptyStar } from '@fortawesome/free-regular-svg-icons'; 

export const Testimonials = () => {
  const { testimonials } = useContext(TestimonialContext) || { testimonials: [] };

  const [defaultTestimonials, setDefaultTestimonials] = useState([]);

  useEffect(() => {
    if (!testimonials.length) {
      setDefaultTestimonials([
        {
          text: 'Excelente atención y resultados, me siento muy satisfecha con mi tratamiento.',
          author: 'María González',
          rating: 4.5,       
        },
        {
          text: 'Buena experiencia, aunque creo que podría mejorar en algunos aspectos.',
          author: 'Juan Pérez',
          rating: 4,          
        },
        {
          text: 'El mejor lugar para cuidar de tu salud visual. Muy recomendados.',
          author: 'Carla Rodríguez',
          rating: 5,
        },
        {
          text: 'El tiempo de espera fue mayor al esperado, pero la atención fue buena.',
          author: 'Pedro Morales',
          rating: 3.5,         
        },
        {
          text: 'La atención no fue lo que esperaba y me sentí apurado durante la consulta.',
          author: 'Ana López',
          rating: 2.5,         
        },
        {
          text: 'Tuve una experiencia negativa, ya que mi cita se retrasó demasiado y no obtuve respuestas claras.',
          author: 'Luis Fernández',
          rating: 2,         
        },
      ]);
    }
  }, [testimonials]);

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating); 
    const halfStar = rating % 1 !== 0;    
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0); 
    return (
      <>
        {[...Array(fullStars)].map((_, i) => (
          <FontAwesomeIcon icon={faStar} color="#FFD700" key={`full-${i}`} /> 
        ))}
        {halfStar && <FontAwesomeIcon icon={faStarHalfAlt} color="#FFD700" />} 
        {[...Array(emptyStars)].map((_, i) => (
          <FontAwesomeIcon icon={farEmptyStar} color="#FFD700" key={`empty-${i}`} /> 
        ))}
      </>
    );
  };

  const displayTestimonials = testimonials.length ? testimonials : defaultTestimonials;

  return (
    <Container className="mt-4 text-center">
      <h2>Testimonios de Pacientes</h2>
      <Row>
        {displayTestimonials.map((testimonial, index) => (
          <Col md={4} key={index} className="mb-3">
            <Card>
              <Card.Body>
                <Card.Text>"{testimonial.text}"</Card.Text>
                <Card.Subtitle className="mb-2 text-muted">{testimonial.author}</Card.Subtitle>
                <div className="star-rating">
                  {renderStars(testimonial.rating)}
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Testimonials;
