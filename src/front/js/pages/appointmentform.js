import React, { useState, useContext, useEffect } from 'react';
import { Container, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { AppointmentContext } from '../store/AppointmentContext';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export const AppointmentForm = () => {
  const { addAppointment, loading, error, availability, getDoctors, doctors } = useContext(AppointmentContext);
  const [appointment, setAppointment] = useState({
    name: '',
    email: '',
    doctor: '',
    date: null, // Usamos un objeto de fecha
    time: '',
    type: 'in-person'
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [availableTimes, setAvailableTimes] = useState([]);

  console.log(doctors, 'doctors')

  // Actualizar los horarios disponibles cuando se selecciona un doctor y una fecha
  useEffect(() => {
    if (appointment.doctor && appointment.date) {
      const doctorAvailability = availability.find(doc => doc.doctorId === appointment.doctor);
      if (doctorAvailability) {
        const selectedDate = appointment.date.toISOString().split('T')[0];
        const timesForDate = doctorAvailability.times[selectedDate] || [];
        setAvailableTimes(timesForDate);
      }
    }
    console.log(appointment.doctor, 'doctor')
    console.log(appointment, 'appointment')
  }, [appointment.doctor, appointment.date, availability]);

  const handleChange = (e) => {
    setAppointment({ ...appointment, [e.target.name]: e.target.value });
  };

  const handleDateChange = (date) => {
    setAppointment({ ...appointment, date });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Formatear la fecha antes de enviarla
    const formattedAppointment = {
      ...appointment,
      date: appointment.date.toISOString().split('T')[0],
    };

    // Enviar la cita al contexto
    await addAppointment(formattedAppointment);

    // Mostrar un mensaje de éxito
    setSuccessMessage('Cita solicitada exitosamente.');

    // Reiniciar el formulario después de enviar la cita
    setAppointment({
      name: '',
      email: '',
      doctor: '',
      date: null,
      time: '',
      type: 'in-person'
    });

    // Limpiar el mensaje de éxito después de unos segundos
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  return (
    <Container className="mt-4">
      <h2>Solicitar Cita</h2>

      {/* Mostrar un mensaje de carga */}
      {loading && (
        <div className="text-center my-3">
          <Spinner animation="border" />
          <p>Cargando...</p>
        </div>
      )}

      {/* Mostrar un mensaje de éxito */}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}

      {/* Mostrar un mensaje de error si existe */}
      {error && <Alert variant="danger">Error: {error.message}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formName">
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={appointment.name}
            onChange={handleChange}
            placeholder="Ingrese su nombre"
            required
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
            required
          />
        </Form.Group>

        <Form.Group controlId="formDoctor">
          <Form.Label>Doctor</Form.Label>
          <Form.Control
            as="select"
            name="doctor"
            value={appointment.doctor}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione un doctor</option>
            {doctors.map((doctor) => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.name}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="formDate">
          <Form.Label>Fecha</Form.Label>
          <DatePicker
            selected={appointment.date}
            onChange={handleDateChange}
            dateFormat="yyyy-MM-dd"
            className="form-control"
            minDate={new Date()}
            placeholderText="Seleccione una fecha"
            required
          />
        </Form.Group>

        {availableTimes.length > 0 && (
          <Form.Group controlId="formTime">
            <Form.Label>Hora</Form.Label>
            <Form.Control
              as="select"
              name="time"
              value={appointment.time}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione una hora</option>
              {availableTimes.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        )}

        <Form.Group controlId="formType">
          <Form.Label>Tipo de Cita</Form.Label>
          <Form.Control
            as="select"
            name="type"
            value={appointment.type}
            onChange={handleChange}
            required
          >
            <option value="in-person">Presencial</option>
            <option value="video">Videollamada</option>
            <option value="call">Llamada</option>
          </Form.Control>
        </Form.Group>

        <Button variant="primary" type="submit" className="mt-3" disabled={loading}>
          Solicitar Cita
        </Button>
      </Form>
    </Container>
  );
};

export default AppointmentForm;
