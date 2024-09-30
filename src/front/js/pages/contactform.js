import React, { useState } from 'react';
import { Container, Form, Button, Alert, Modal } from 'react-bootstrap';
import '../../styles/home.css';

export const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [showModal, setShowModal] = useState(false);

  const googleMapsUrl = 'https://www.google.com/maps/place/Be+Casa+Essential+Torrent+Park/@39.4284114,-0.4709562,19.25z/data=!4m6!3m5!1s0xd60512a2b64ce6b:0x93882948ce1271f2!8m2!3d39.4284164!4d-0.4704952!16s%2Fg%2F11kjm5xh3y?entry=ttu&g_ep=EgoyMDI0MDkwNC4wIKXMDSoASAFQAw%3D%3D'

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${process.env.BACKEND_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setAlertMessage('Tu mensaje ha sido enviado con éxito.');
        setShowAlert(true);
        setShowModal(true); // Mostrar el modal de éxito

        // Limpiar el formulario
        setFormData({
          name: '',
          email: '',
          message: '',
        });
      } else {
        setAlertMessage('Error al enviar el mensaje. Inténtelo de nuevo.');
        setShowAlert(true);
      }
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
      setAlertMessage('Ocurrió un error. Inténtelo de nuevo más tarde.');
      setShowAlert(true);
    }
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
          <div className='d-flex flex-column justify-content-center align-items-center'>
            <Button variant="primary" type="submit" className="button-enviar mt-3 col-3">
              Enviar
            </Button>

            <Button
              variant="primary"
              className="button-maps mt-3 col-3 m-2"
              onClick={() => window.open(googleMapsUrl, '_blank')} >
              Ubicación de nuestra clínica
            </Button>
          </div>
        </Form>
      </div>

      {/* Modal de éxito */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Mensaje Enviado</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Tu mensaje ha sido enviado con éxito y pronto serás atendido por uno de nuestros asesores.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={() => setShowModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ContactForm;
