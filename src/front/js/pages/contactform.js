// src/front/js/pages/ContactForm.js
import React, { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import '../../styles/home.css';

export const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const googleMapsUrl = 'https://www.google.com/maps/place/Be+Casa+Essential+Torrent+Park/@39.4284114,-0.4709562,19.25z/data=!4m6!3m5!1s0xd60512a2b64ce6b:0x93882948ce1271f2!8m2!3d39.4284164!4d-0.4704952!16s%2Fg%2F11kjm5xh3y?entry=ttu&g_ep=EgoyMDI0MDkwNC4wIKXMDSoASAFQAw%3D%3D'

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Aquí puedes añadir la lógica para enviar los datos del formulario a tu backend
    // Por ejemplo, usando fetch o axios

    // Simulación de éxito
    setAlertMessage('Tu mensaje ha sido enviado con éxito.');
    setShowAlert(true);

    // Limpiar el formulario
    setFormData({
      name: '',
      email: '',
      message: '',
    });
  };

  return (
    <Container className="mt-4">
      <div className="contact-container p-5 shadow-lg rounded bg-white my-5">
        <h1 className='text-center'>Formulario de Contacto</h1>
        {showAlert && (
          <Alert variant="success" onClose={() => setShowAlert(false)} dismissible>
            {alertMessage}
          </Alert>
        )}
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formName">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingresa tu nombre"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formEmail" className="mt-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Ingresa tu correo electrónico"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formMessage" className="mt-3">
            <Form.Label>Mensaje</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Escribe tu mensaje aquí"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <div className='d-flex flex-column justify-content-center align-items-center '>
            <Button variant="primary" type="submit" className="button-enviar mt-3 col-3">
              Enviar
            </Button>

            <Button
              variant="primary"
              className="button-maps mt-3 col-3 m-2"
              onClick={() => window.open(googleMapsUrl, '_blank')} >
              Ubicación de nuestra clínica
            </Button>
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d1831.0010805200143!2d-0.37181847120525063!3d39.48368352468122!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1ses!2ses!4v1727355064456!5m2!1ses!2ses"
              width="1000"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade">
            </iframe>
          </div>
        </Form>
      </div>
    </Container>
  );
};

export default ContactForm;
