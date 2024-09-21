import React, { useContext, useState, useEffect } from 'react';
import { DateContext } from '../store/DateContext';
import { DoctorContext } from '../store/DoctorContext';
import { AvailabilityContext } from '../store/AvailabilityContext';
import DateTable from '../component/DateTable';
import DoctorTable from '../component/DoctorTable';
import AvailabilityTable from '../component/AvailabilityTable';
import Calendar from 'react-calendar'; // Importamos el calendario de React
import 'react-calendar/dist/Calendar.css'; // Importamos los estilos del calendario
import { Button, Modal, Form, Spinner, Alert, Card, Row, Col } from 'react-bootstrap';
import { FaUserMd, FaCalendarAlt, FaClock } from 'react-icons/fa';

export const AdminPanel = () => {
  const { dates, addDate, updateDate, removeDate, loading: datesLoading, error: datesError } = useContext(DateContext);
  const { doctors, addDoctor, updateDoctor, removeDoctor, loading: doctorsLoading, error: doctorsError } = useContext(DoctorContext);
  const { availabilities, addAvailability, updateAvailability, removeAvailability, loading: availabilitiesLoading, error: availabilitiesError, getAvailabilityByDate } = useContext(AvailabilityContext);

  // Estados para gestionar la apertura y cierre de modales
  const [showDateModal, setShowDateModal] = useState(false);
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // Estados para gestionar los datos actuales
  const [currentDate, setCurrentDate] = useState({ speciality: '', doctor: '', datetime: '', reason_for_appointment: '', date_type: '', user_id: '' });
  const [currentDoctor, setCurrentDoctor] = useState({ name: '', email: '', speciality: '', password: '', last_name: '', document_type: '', document_number: '', address: '', phone: '' });
  const [currentAvailability, setCurrentAvailability] = useState({ doctor_id: '', date: '', start_time: '', end_time: '', is_available: true });

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableTimes, setAvailableTimes] = useState([]);

  // Estado para gestionar la lista de usuarios
  const [users, setUsers] = useState([]);

  // Función para obtener la lista de usuarios
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${process.env.BACKEND_URL}/users`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        setUsers(data.user);  // Guardar la lista de usuarios en el estado
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  // Funciones para gestionar la apertura y cierre de modales
  const handleShowDateModal = (date = { speciality: '', doctor: '', datetime: '', reason_for_appointment: '', date_type: '', user_id: '' }) => {
    setCurrentDate(date);
    setEditMode(!!date.id);
    setShowDateModal(true);
  };

  const handleShowDoctorModal = (doctor = {}) => {
    setCurrentDoctor({
      name: '',
      email: '',
      speciality: '',
      password: '',
      last_name: '',
      document_type: '',
      document_number: '',
      address: '',
      phone: '',
      ...doctor
    });
    setEditMode(!!doctor.id);
    setShowDoctorModal(true);
  };

  const handleShowAvailabilityModal = (availability = { doctor_id: '', date: '', start_time: '', end_time: '', is_available: true }) => {
    setCurrentAvailability(availability);
    setEditMode(!!availability.id);
    setShowAvailabilityModal(true);
  };

  const handleCloseModal = () => {
    setShowDateModal(false);
    setShowDoctorModal(false);
    setShowAvailabilityModal(false);
  };

  // Handlers para gestionar los cambios en los formularios
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setCurrentDate({ ...currentDate, [name]: value });
  };

  const handleDoctorChange = (e) => {
    const { name, value } = e.target;
    setCurrentDoctor({ ...currentDoctor, [name]: value });
  };

  const handleAvailabilityChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setCurrentAvailability({ ...currentAvailability, [name]: newValue });
  };

  // Función para manejar el envío de la cita
  const handleDateSubmit = async (e) => {
    e.preventDefault();

    if (!currentDate.datetime) {
      alert("Please select a valid time.");
      return;
    }

    const combinedDate = new Date(selectedDate.toISOString().split('T')[0] + 'T' + currentDate.datetime + ':00.000Z');
    console.log("Combined Date:", combinedDate);  // Verifica la fecha

    const formattedDateTime = combinedDate.toISOString().split('.')[0] + 'Z'; // Formatear sin milisegundos
    console.log("Formatted DateTime:", formattedDateTime); // Verifica el formato antes de enviar

    const newDate = {
      speciality: currentDate.speciality,
      doctor_id: currentDate.doctor,
      datetime: formattedDateTime, // Asegúrate de enviar el formato correcto
      reason_for_appointment: currentDate.reason_for_appointment,
      date_type: currentDate.date_type,
      user_id: currentDate.user_id
    };

    try {
      if (editMode) {
        await updateDate(newDate);
      } else {
        await addDate(newDate);
      }
      handleCloseModal();
    } catch (error) {
      console.error("Error creating/updating date:", error);
      alert("There was an error creating or updating the date.");
    }
  };





  const handleDoctorSubmit = async (e) => {
    e.preventDefault();
    const { name, email, speciality, password } = currentDoctor;

    if (!name || !email || !speciality) {
      alert("Name, email, and speciality are required!");
      return;
    }

    if (!editMode && !password) {
      alert("Password is required for new doctors!");
      return;
    }

    try {
      if (editMode) {
        await updateDoctor(currentDoctor);
      } else {
        await addDoctor(currentDoctor);
      }
      handleCloseModal();
    } catch (err) {
      console.error("Error submitting doctor:", err);
    }
  };

  const handleAvailabilitySubmit = async (e) => {
    e.preventDefault();
    if (editMode) {
      await updateAvailability(currentAvailability);
    } else {
      await addAvailability(currentAvailability);
    }
    handleCloseModal();
  };

  // Función para obtener la disponibilidad del doctor por fecha seleccionada

  const handleDateSelection = async (date) => {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      console.error('Invalid date:', date);
      alert('Please select a valid date.');
      return;
    }

    setSelectedDate(date);
    const doctorId = currentDate.doctor;

    if (!doctorId) {
      alert("Please select a doctor first.");
      return;
    }

    try {
      const availability = await getAvailabilityByDate(doctorId, date);
      console.log("API Response for availability:", availability); // Verifica la respuesta aquí

      if (Array.isArray(availability) && availability.length > 0) {
        // Extraer y formatear los rangos de tiempo disponibles
        const timeSlots = [];
        availability.forEach(item => {
          const startTime = item.start_time;
          const endTime = item.end_time;
          console.log(`Availability: ${startTime} to ${endTime}`);

          // Generar intervalos de 30 minutos dentro del rango disponible
          let current = startTime;
          while (current < endTime) {
            timeSlots.push(current);
            // Añadir 30 minutos al tiempo actual
            const [hours, minutes] = current.split(':');
            let newMinutes = parseInt(minutes) + 30;
            let newHours = parseInt(hours);
            if (newMinutes >= 60) {
              newHours += 1;
              newMinutes = newMinutes - 60;
            }
            current = `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
          }
        });
        setAvailableTimes(timeSlots);
      } else {
        console.error("Invalid or empty availability response:", availability);
        alert("No available times found for the selected date.");
        setAvailableTimes([]);
      }
    } catch (error) {
      console.error('Error fetching availability:', error);
      alert('Error fetching availability');
      setAvailableTimes([]);
    }
  };





  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Admin Panel</h1>

      <Row>
        {/* Gestión de Citas */}
        <Col md={4}>
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <Card.Title className="text-center mb-4">
                <FaCalendarAlt className="me-2" /> Dates
              </Card.Title>
              <Button variant="primary" onClick={() => handleShowDateModal()}>
                <FaCalendarAlt className="me-2" /> Add Date
              </Button>

              {datesLoading && <Spinner animation="border" variant="primary" className="d-block mx-auto mt-3" />}
              {datesError && <Alert variant="danger" className="mt-3">{datesError}</Alert>}

              <DateTable dates={dates} handleShowModal={handleShowDateModal} removeDate={removeDate} />
            </Card.Body>
          </Card>
        </Col>

        {/* Gestión de Doctores */}
        <Col md={4}>
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <Card.Title className="text-center mb-4">
                <FaUserMd className="me-2" /> Doctors
              </Card.Title>
              <Button variant="primary" onClick={() => handleShowDoctorModal()}>
                <FaUserMd className="me-2" /> Add Doctor
              </Button>

              {doctorsLoading && <Spinner animation="border" variant="primary" className="d-block mx-auto mt-3" />}
              {doctorsError && <Alert variant="danger" className="mt-3">{doctorsError}</Alert>}

              <DoctorTable doctors={doctors} handleShowModal={handleShowDoctorModal} removeDoctor={removeDoctor} />
            </Card.Body>
          </Card>
        </Col>

        {/* Gestión de Disponibilidad */}
        <Col md={4}>
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <Card.Title className="text-center mb-4">
                <FaClock className="me-2" /> Availability
              </Card.Title>
              <Button variant="primary" onClick={() => handleShowAvailabilityModal()}>
                <FaClock className="me-2" /> Add Availability
              </Button>

              {availabilitiesLoading && <Spinner animation="border" variant="primary" className="d-block mx-auto mt-3" />}
              {availabilitiesError && <Alert variant="danger" className="mt-3">{availabilitiesError}</Alert>}

              <AvailabilityTable availabilities={availabilities} handleShowModal={handleShowAvailabilityModal} removeAvailability={removeAvailability} doctors={doctors} />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal para agregar/editar cita */}
      <Modal show={showDateModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>{editMode ? 'Edit Date' : 'Add Date'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleDateSubmit}>
            <Form.Group controlId="formSpeciality" className="mb-3">
              <Form.Label>Speciality</Form.Label>
              <Form.Control
                type="text"
                name="speciality"
                value={currentDate.speciality}
                onChange={handleDateChange}
                placeholder="Enter speciality"
                required
              />
            </Form.Group>

            <Form.Group controlId="formDoctor" className="mb-3">
              <Form.Label>Doctor</Form.Label>
              <Form.Control
                as="select"
                name="doctor"
                value={currentDate.doctor}
                onChange={(e) => {
                  handleDateChange(e); // Actualiza el doctor
                  setAvailableTimes([]); // Reinicia las horas disponibles
                  setSelectedDate(new Date()); // Reinicia la fecha seleccionada
                }}
                required
              >
                <option value="">Select a doctor</option>
                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>


            {/* Calendario para seleccionar fecha */}
            <Form.Group controlId="formCalendar" className="mb-3">
              <Form.Label>Select Date</Form.Label>
              <Calendar onChange={handleDateSelection} value={selectedDate} />


            </Form.Group>

            {/* Mostrar horas disponibles solo si hay horas */}
            {availableTimes.length > 0 ? (
              <Form.Group controlId="formTime" className="mb-3">
                <Form.Label>Available Time Slots</Form.Label>
                <Form.Control
                  as="select"
                  name="datetime"
                  value={currentDate.datetime}
                  onChange={handleDateChange}
                  required
                >
                  <option value="">Select Time</option>
                  {availableTimes.map((time, index) => (
                    <option key={index} value={time}>{time}</option>
                  ))}
                </Form.Control>
              </Form.Group>
            ) : (
              <p>No available time slots for the selected date.</p>
            )}

            <Form.Group controlId="formReason" className="mb-3">
              <Form.Label>Reason for Appointment</Form.Label>
              <Form.Control
                as="textarea"
                name="reason_for_appointment"
                value={currentDate.reason_for_appointment}
                onChange={handleDateChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formDateType" className="mb-3">
              <Form.Label>Type of Appointment</Form.Label>
              <Form.Control
                type="text"
                name="date_type"
                value={currentDate.date_type}
                onChange={handleDateChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formUserId" className="mb-3">
              <Form.Label>User</Form.Label>
              <Form.Control
                as="select"
                name="user_id"
                value={currentDate.user_id}
                onChange={handleDateChange}
                required
              >
                <option value="">Select a user</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} {user.last_name} (ID: {user.id})
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Button variant="primary" type="submit" className="mt-3 w-100">
              {editMode ? 'Update Date' : 'Add Date'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AdminPanel;
