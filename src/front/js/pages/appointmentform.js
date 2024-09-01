// src/pages/AppointmentForm.js
import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';

export const AppointmentForm = () => {
  const [appointment, setAppointment] = useState({
    name: '',
    email: '',
    date: '',
    time: '',
    type: 'in-person'
  });

  const handleChange = (e) => {
    setAppointment({ ...appointment, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí enviarías los datos a tu API
    console.log(appointment);
  };

  return (
    <Container className="mt-4">
      <h2>Solicitar Cita</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formName">
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={appointment.name}
            onChange={handleChange}
            placeholder="Ingrese su nombre"
          />
        </Form.Group>

        <Form.Group controlId="formEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={appointment.email}
            onChange={handleChange}
            placeholder="Ingrese su correo electrónico"
          />
        </Form.Group>

        <Form.Group controlId="formDate">
          <Form.Label>Fecha</Form.Label>
          <Form.Control
            type="date"
            name="date"
            value={appointment.date}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="formTime">
          <Form.Label>Hora</Form.Label>
          <Form.Control
            type="time"
            name="time"
            value={appointment.time}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="formType">
          <Form.Label>Tipo de Cita</Form.Label>
          <Form.Control
            as="select"
            name="type"
            value={appointment.type}
            onChange={handleChange}
          >
            <option value="in-person">Presencial</option>
            <option value="video">Videollamada</option>
            <option value="call">Llamada</option>
          </Form.Control>
        </Form.Group>

        <Button variant="primary" type="submit" className="mt-3">
          Solicitar Cita
        </Button>
      </Form>
    </Container>
  );
};

export default AppointmentForm;
