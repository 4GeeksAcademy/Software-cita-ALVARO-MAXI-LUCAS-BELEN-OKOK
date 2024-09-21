import React, { useState, useContext, useEffect } from 'react';
import { Container, Form, Button, Alert, Spinner, Row, Col, Card } from 'react-bootstrap';
import { AppointmentContext } from '../store/AppointmentContext';
import { AvailabilityContext } from '../store/AvailabilityContext';
import { AuthContext } from '../store/AuthContext';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../../styles/AppointmentForm.css';

export const AppointmentForm = () => {
  const { addAppointment, loading, error, doctors, getDoctors } = useContext(AppointmentContext);
  const { getAvailabilityByDate } = useContext(AvailabilityContext);
  const { user } = useContext(AuthContext);
  const userId = user ? user.id : null;

  const [appointment, setAppointment] = useState({
    name: user ? user.name : '',
    email: user ? user.email : '',
    doctor_id: '',
    date: null,
    datetime: '',
    type: 'in-person',
    speciality: '',
    reason_for_appointment: '',
    date_type: '',
    user_id: userId,
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  // Fetch doctors on component mount
  useEffect(() => {
    getDoctors();
  }, []);

  // Fetch availability whenever doctor or date changes
  useEffect(() => {
    if (appointment.doctor_id && appointment.date) {
      fetchAvailableTimes(appointment.doctor_id, appointment.date);
    }
  }, [appointment.doctor_id, appointment.date]);


  const fetchAvailableTimes = async (doctorId, date) => {
    try {
      const availabilities = await getAvailabilityByDate(doctorId, date);
      console.log("Availabilities fetched:", availabilities);

      // Transformar las disponibilidades a un array de horas como strings
      const times = availabilities.map((availability) => {
        const startTime = availability.start_time;
        const endTime = availability.end_time;

        // Crear un array con intervalos de 30 minutos dentro del rango de tiempo
        const timesArray = [];
        let currentTime = new Date(`1970-01-01T${startTime}`);
        const endTimeObj = new Date(`1970-01-01T${endTime}`);

        while (currentTime <= endTimeObj) {
          timesArray.push(
            currentTime.toTimeString().substring(0, 5) // Formato "HH:mm"
          );
          currentTime = new Date(currentTime.getTime() + 30 * 60000); // Incrementar 30 minutos
        }
        return timesArray;
      }).flat(); // Aplana el array si hay múltiples disponibilidades

      setAvailableTimes(times);
    } catch (error) {
      console.error('Error fetching availability:', error);
    }
  };



  const handleChange = (e) => {
    const { name, value } = e.target;
    setAppointment((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setAppointment((prev) => ({ ...prev, date }));
    setAvailableTimes([]); // Reset available times when changing the date
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (appointment.date && appointment.datetime) {
      const combinedDateTime = new Date(
        appointment.date.toISOString().split('T')[0] + 'T' + appointment.datetime + ':00.000Z'
      );

      const formattedAppointment = {
        ...appointment,
        datetime: combinedDateTime.toISOString(),
        user_id: userId,
      };

      try {
        await addAppointment(formattedAppointment);

        // Establece el mensaje de éxito
        setSuccessMessage('¡Cita solicitada exitosamente! Recibirá un correo electrónico con la confirmación.');

        // Restablece el formulario
        resetForm();

        // Limpia el mensaje de éxito después de 5 segundos
        setTimeout(() => setSuccessMessage(''), 5000);
      } catch (error) {
        console.error('Error al solicitar la cita:', error);
      }
    } else {
      console.error('Fecha y hora son necesarias');
    }
  };

  const resetForm = () => {
    setAppointment({
      name: '',
      email: '',
      doctor_id: '',
      date: null,
      datetime: '',
      type: 'in-person',
      speciality: '',
      reason_for_appointment: '',
      date_type: '',
      user_id: userId,
    });
  };

  return (
    <Container className="mt-4 appointment-form-container">
      <h2 className="text-center mb-4">Solicitar Cita</h2>

      {loading && (
        <div className="text-center my-3">
          <Spinner animation="border" />
          <p>Cargando...</p>
        </div>
      )}

      {successMessage && <Alert variant="success">{successMessage}</Alert>}
      {error && <Alert variant="danger">Error: {error.message}</Alert>}

      <Card className="p-4 shadow">
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group controlId="formName" className="mb-3">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={appointment.name}
                  onChange={handleChange}
                  placeholder="Ingrese su nombre"
                  readOnly={!!user}
                  required
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group controlId="formEmail" className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={appointment.email}
                  onChange={handleChange}
                  placeholder="Ingrese su correo electrónico"
                  readOnly={!!user}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group controlId="formDoctor" className="mb-3">
                <Form.Label>Doctor</Form.Label>
                <Form.Control
                  as="select"
                  name="doctor_id"
                  value={appointment.doctor_id}
                  onChange={(e) => {
                    handleChange(e);
                    setSelectedDoctor(e.target.value);
                    setAvailableTimes([]); // Reset available times on doctor change
                  }}
                  required
                >
                  <option value="">Seleccione un doctor</option>
                  {doctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.name} - {doctor.speciality}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group controlId="formDate" className="mb-3">
                <Form.Label>Fecha de la Cita</Form.Label>
                <DatePicker
                  selected={appointment.date}
                  onChange={handleDateChange}
                  minDate={new Date()}
                  className="form-control datepicker-custom"
                  placeholderText="Seleccione una fecha"
                  dateFormat="yyyy-MM-dd"
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group controlId="formAvailableTimes" className="mb-3">
                <Form.Label>Horarios Disponibles</Form.Label>
                <Form.Control
                  as="select"
                  name="datetime"
                  value={appointment.datetime}
                  onChange={handleChange}
                  required
                  disabled={!availableTimes.length}
                >
                  <option value="">Seleccione un horario</option>
                  {availableTimes.map((time, index) => (
                    <option key={index} value={time}>
                      {time}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>

            </Col>

            <Col md={6}>
              <Form.Group controlId="formType" className="mb-3">
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
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group controlId="formSpeciality" className="mb-3">
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
            </Col>

            <Col md={6}>
              <Form.Group controlId="formReasonForAppointment" className="mb-3">
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
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              <Form.Group controlId="formDateType" className="mb-3">
                <Form.Label>Tipo de consulta</Form.Label>
                <Form.Control
                  as="select"
                  name="date_type"
                  value={appointment.date_type}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione un tipo de consulta</option>
                  <option value="Consulta médica">Consulta médica</option>
                  <option value="Cita médica">Cita médica</option>
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>

          <Button variant="primary" type="submit" className="mt-3 w-100" disabled={loading}>
            Solicitar Cita
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default AppointmentForm;
