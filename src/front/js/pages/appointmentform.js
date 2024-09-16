import React, { useState, useContext, useEffect } from 'react';
import { Container, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { AppointmentContext } from '../store/AppointmentContext';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../../styles/AppointmentForm.css';
import { AuthContext } from '../store/AuthContext';



export const AppointmentForm = () => {
  const { addAppointment, loading, error, availability, getDoctors, doctors } = useContext(AppointmentContext);
  const { user } = useContext(AuthContext);
  const userId = user ? user.id : null; // Extraigo el user de auth context aweonao 
  const [appointment, setAppointment] = useState({
    name: '',
    email: '',
    doctor_id: '',
    date: null,
    type: 'in-person',
    speciality: '', // Agregar el campo speciality
    reason_for_appointment: '', // Agregar el campo reason_for_appointment
    date_type: '', // Agregar el campo date_type
    user_id: userId,
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [availableTimes, setAvailableTimes] = useState([]);

  // Actualizar los horarios disponibles cuando se selecciona un doctor y una fecha
  useEffect(() => {
    if (appointment.doctor_id && appointment.date) {
      const doctorAvailability = availability.find(doc => doc.doctorId === appointment.doctor_id);
      if (doctorAvailability) {
        const selectedDate = appointment.date.toISOString().split('T')[0];
        const timesForDate = doctorAvailability.times[selectedDate] || [];
        setAvailableTimes(timesForDate);
      }
    }
  }, [appointment.doctor_id, appointment.date, availability]);

  const handleChange = (e) => {
    setAppointment({ ...appointment, [e.target.name]: e.target.value });
  };

  const handleDateChange = (date) => {
    setAppointment({ ...appointment, date });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (appointment.date) {
      const dateStr = appointment.date.toISOString(); // ISO String incluye fecha y hora
      const formattedAppointment = {
        ...appointment,
        datetime: dateStr,
        speciality: 'Oftalmología', // Agregar el campo speciality
        reason_for_appointment: 'Consulta médica', // Agregar el campo reason_for_appointment
        date_type: 'Cita médica', // Agregar el campo date_type
        user_id: userId, // Actualizar el campo user_id con el valor correcto
      };


      try {
        await addAppointment(formattedAppointment);

        setSuccessMessage('Cita solicitada exitosamente.');
        setAppointment({
          name: '',
          email: '',
          doctor_id: '',
          date: null,
          type: 'in-person',
          speciality: '', // Agregar el campo speciality
          reason_for_appointment: '', // Agregar el campo reason_for_appointment
          date_type: '', // Agregar el campo date_type
        });

        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (error) {
        console.error('Error al solicitar la cita:', error);
      }
    } else {
      console.error('Fecha y hora son necesarias');
    }
  };

  return (
    <Container className="mt-4 appointment-form-container">
      <h2>Solicitar Cita</h2>

      {loading && (
        <div className="text-center my-3">
          <Spinner animation="border" />
          <p>Cargando...</p>
        </div>
      )}

      {successMessage && <Alert variant="success">{successMessage}</Alert>}

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
            name="doctor_id"
            value={appointment.doctor_id}
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
          <Form.Label>Fecha y Hora</Form.Label>
          <DatePicker
            selected={appointment.date}
            onChange={handleDateChange}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={30}
            dateFormat="yyyy-MM-dd h:mm aa"
            className="form-control datepicker-custom"
            minDate={new Date()}
            placeholderText="Seleccione una fecha y hora"
            required
          />
        </Form.Group>

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
        <Form.Group controlId="formSpeciality">
          <Form.Label>Especialidad</Form.Label>
          <Form.Control
            type="text"
            name="speciality"
            value={appointment.speciality}
            onChange={handleChange}
            placeholder="Ingrese la especialidad"
            required
          />
        </Form.Group>

        <Form.Group controlId="formReasonForAppointment">
          <Form.Label>Razón de la cita</Form.Label>
          <Form.Control
            type="text"
            name="reason_for_appointment"
            value={appointment.reason_for_appointment}
            onChange={handleChange}
            placeholder="Ingrese la razón de la cita"
            required
          />
        </Form.Group>

        <Form.Group controlId="formDateType">
          <Form.Label>Tipo de cita</Form.Label>
          <Form.Control
            as="select"
            name="date_type"
            value={appointment.date_type}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione un tipo de cita</option>
            <option value="Cita médica">Cita médica</option>
            <option value="Consulta médica">Consulta médica</option>
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
