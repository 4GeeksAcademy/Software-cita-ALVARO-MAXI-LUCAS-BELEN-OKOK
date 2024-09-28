import React, { useState, useContext, useEffect } from 'react';
import { Container, Form, Button, Alert, Spinner, Row, Col, Card, ProgressBar } from 'react-bootstrap';
import { AppointmentContext } from '../store/AppointmentContext';
import { AvailabilityContext } from '../store/AvailabilityContext';
import { AuthContext } from '../store/AuthContext';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../../styles/AppointmentForm.css';
import { FaUser, FaEnvelope, FaUserMd, FaCalendarAlt, FaClock, FaClipboardList, FaFileMedical, FaCheckCircle } from 'react-icons/fa';

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
  const [step, setStep] = useState(1); // Step tracking

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
      const times = availabilities.flatMap((availability) => {
        const startTime = availability.start_time;
        const endTime = availability.end_time;
        const timesArray = [];
        let currentTime = new Date(`1970-01-01T${startTime}`);
        const endTimeObj = new Date(`1970-01-01T${endTime}`);

        while (currentTime <= endTimeObj) {
          timesArray.push(currentTime.toTimeString().substring(0, 5));
          currentTime = new Date(currentTime.getTime() + 30 * 60000);
        }
        return timesArray;
      });

      setAvailableTimes(times);
    } catch (error) {
      console.error('Error fetching availability:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAppointment((prev) => ({ ...prev, [name]: value }));
  };

  const handleDoctorChange = (e) => {
    const doctorId = e.target.value;
    const selectedDoctor = doctors.find((doc) => doc.id.toString() === doctorId);
    setAppointment((prev) => ({
      ...prev,
      doctor_id: doctorId,
      speciality: selectedDoctor ? selectedDoctor.speciality : '',
    }));
    setSelectedDoctor(selectedDoctor);
    setAvailableTimes([]); // Reset available times
  };

  const handleDateChange = (date) => {
    setAppointment((prev) => ({ ...prev, date }));
    setAvailableTimes([]); // Reset available times when changing the date
  };

  const handleNextStep = () => setStep((prevStep) => prevStep + 1);
  const handlePrevStep = () => setStep((prevStep) => prevStep - 1);

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
        setSuccessMessage('¡Cita solicitada exitosamente! Recibirá un correo electrónico con la confirmación.');
        resetForm();
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
    setStep(1);
  };

  return (
    <Container className="mt-4 appointment-form-container">
      <h2 className="text-center mb-4"><FaCalendarAlt className="me-2" /> Solicitar Cita</h2>

      {loading && (
        <div className="text-center my-3">
          <Spinner animation="border" />
          <p>Cargando...</p>
        </div>
      )}

      {successMessage && <Alert variant="success">{successMessage}</Alert>}
      {error && <Alert variant="danger">Error: {error.message}</Alert>}

      {/* Progress Bar */}
      <ProgressBar now={(step / 3) * 100} className="mb-4" label={`${step} / 3`} />

      {/* Step 1: Select Doctor and Speciality */}
      {step === 1 && (
        <Card className="p-3 shadow">
          <h4><FaUserMd className="me-2" /> Seleccionar Doctor y Especialidad</h4>
          <Row>
            <Col md={6}>
              <Form.Group controlId="formDoctor" className="mb-3">
                <Form.Label><FaUserMd className="me-2" /> Doctor</Form.Label>
                <Form.Control
                  as="select"
                  name="doctor_id"
                  value={appointment.doctor_id}
                  onChange={handleDoctorChange}
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

            </Col>

            <Col md={6}>
              <Form.Group controlId="formSpeciality" className="mb-3">
                <Form.Label><FaFileMedical className="me-2" /> Especialidad</Form.Label>
                <Form.Control
                  as="select"
                  name="speciality"
                  value={appointment.speciality}
                  onChange={(e) => {
                    handleChange(e);
                    setAppointment((prev) => ({
                      ...prev,
                      doctor_id: '' // Resetea la selección del doctor al cambiar la especialidad
                    }));
                  }}
                  required
                >
                  <option value="">Seleccione una especialidad</option>
                  {[...new Set(doctors.map(doctor => doctor.speciality))].map((speciality, index) => (
                    <option key={index} value={speciality}>
                      {speciality}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>

            </Col>
          </Row>
          <Button variant="primary" onClick={handleNextStep} className="mt-3 w-100">Siguiente</Button>
        </Card>
      )}

      {/* Step 2: Select Date and Time */}
      {step === 2 && (
        <Card className="p-3 shadow">
          <h4><FaCalendarAlt className="me-2" /> Seleccionar Fecha y Hora</h4>
          <Row>
            <Col md={6}>
              <Form.Group controlId="formDate" className="mb-3">
                <Form.Label><FaCalendarAlt className="me-2" /> Fecha de la Cita</Form.Label>
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

            <Col md={6}>
              <Form.Group controlId="formAvailableTimes" className="mb-3">
                <Form.Label><FaClock className="me-2" /> Horarios Disponibles</Form.Label>
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
          </Row>
          <Button variant="secondary" onClick={handlePrevStep} className="me-2">Atrás</Button>
          <Button variant="primary" onClick={handleNextStep}>Siguiente</Button>
        </Card>
      )}

      {/* Step 3: Confirm Appointment */}
      {step === 3 && (
        <Card className="p-3 shadow">
          <h4><FaCheckCircle className="me-2" /> Confirmar Cita</h4>
          <Row className="mb-3">
            <Col md={6}>
              <p><strong><FaUser className="me-2" /> Nombre:</strong> {appointment.name}</p>
            </Col>
            <Col md={6}>
              <p><strong><FaEnvelope className="me-2" /> Email:</strong> {appointment.email}</p>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col md={6}>
              <p><strong><FaUserMd className="me-2" /> Doctor:</strong> {selectedDoctor ? selectedDoctor.name : 'No seleccionado'}</p>
            </Col>
            <Col md={6}>
              <p><strong><FaFileMedical className="me-2" /> Especialidad:</strong> {appointment.speciality}</p>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col md={6}>
              <p><strong><FaCalendarAlt className="me-2" /> Fecha:</strong> {appointment.date ? appointment.date.toLocaleDateString() : 'No seleccionada'}</p>
            </Col>
            <Col md={6}>
              <p><strong><FaClock className="me-2" /> Horario:</strong> {appointment.datetime}</p>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col md={6}>
              <p><strong><FaClipboardList className="me-2" /> Tipo de Cita:</strong>
                {appointment.type === 'in-person' ? 'Presencial' : appointment.type === 'video' ? 'Videollamada' : 'Llamada'}
              </p>
            </Col>
            <Col md={6}>
              <p><strong><FaFileMedical className="me-2" /> Razón de la Cita:</strong> {appointment.reason_for_appointment}</p>
            </Col>
          </Row>

          <Button variant="secondary" onClick={handlePrevStep} className="me-2">Atrás</Button>
          <Button variant="success" onClick={handleSubmit}>
            <FaCheckCircle className="me-2" /> Confirmar Cita
          </Button>
        </Card>
      )}
    </Container>
  );
};

export default AppointmentForm;

