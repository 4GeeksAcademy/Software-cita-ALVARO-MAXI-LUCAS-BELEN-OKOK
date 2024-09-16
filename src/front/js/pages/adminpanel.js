import React, { useContext, useState, useEffect } from 'react';
import { DateContext } from '../store/DateContext';
import { DoctorContext } from '../store/DoctorContext';
import { AvailabilityContext } from '../store/AvailabilityContext';
import DoctorAvailability from '../component/DoctorAvailability';
import DateTable from '../component/DateTable';
import DoctorTable from '../component/DoctorTable';
import AvailabilityTable from '../component/AvailabilityTable';
import { Button, Modal, Form, Spinner, Alert, Card, Row, Col } from 'react-bootstrap';
import { FaUserMd, FaCalendarAlt, FaClock } from 'react-icons/fa';

export const AdminPanel = () => {
  const { dates, addDate, updateDate, removeDate, loading, error } = useContext(DateContext);
  const { doctors, addDoctor, updateDoctor, removeDoctor } = useContext(DoctorContext);
  const { availabilities, addAvailability, updateAvailability, removeAvailability } = useContext(AvailabilityContext);

  // Estados para mostrar y gestionar modales
  const [showDateModal, setShowDateModal] = useState(false);
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // Estado para gestionar la lista de usuarios
  const [users, setUsers] = useState([]);

  // Estado para gestionar las horas disponibles de los doctores
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [availableTimes, setAvailableTimes] = useState([]);

  // Estados para gestionar los datos de cada entidad
  const [currentDate, setCurrentDate] = useState({
    speciality: '', doctor: '', datetime: '', reason_for_appointment: '', date_type: '', user_id: ''
  });
  const [currentDoctor, setCurrentDoctor] = useState({
    name: '',
    email: '',
    speciality: '',
    password: '',
    last_name: '',
    document_type: '',
    document_number: '',
    address: '',
    phone: ''
  });
  const [currentAvailability, setCurrentAvailability] = useState({
    doctor_id: '', date: '', start_time: '', end_time: '', is_available: true
  });

  // Función para obtener las horas disponibles de un doctor
  const fetchAvailableTimes = async (doctorId, date) => {
    try {
      const response = await fetch(`${process.env.BACKEND_URL}/doctor/${doctorId}/availability?date=${date}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      const times = await response.json();
      setAvailableTimes(times);  // Guardar las horas disponibles
    } catch (error) {
      console.error('Error fetching available times:', error);
    }
  };



  // useEffect para obtener horas disponibles cuando cambian el doctor o la fecha
  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      fetchAvailableTimes(selectedDoctor, selectedDate);
    }
  }, [selectedDoctor, selectedDate]);

  // useEffect para cargar la lista de usuarios
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

  // Handlers para gestionar cambios en los formularios
  const handleDateChange = (e) => {
    const date = e.target.value; // Asegúrate de que este formato es YYYY-MM-DD
    setSelectedDate(date);
    setCurrentDate({ ...currentDate, datetime: date });
  };


  const handleDoctorChange = (e) => {
    const doctorId = e.target.value;
    setSelectedDoctor(doctorId);
    setCurrentDate({ ...currentDate, doctor: doctorId });
  };

  const handleAvailabilityChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setCurrentAvailability({ ...currentAvailability, [name]: newValue });
  };

  // Envío de datos de citas
  const handleDateSubmit = async (e) => {
    e.preventDefault();

    const newDate = {
      speciality: currentDate.speciality,
      doctor_id: currentDate.doctor,
      datetime: new Date(currentDate.datetime).toISOString(), // Convertir a formato ISO
      reason_for_appointment: currentDate.reason_for_appointment,
      date_type: currentDate.date_type,
      user_id: currentDate.user_id
    };

    try {
      if (editMode) {
        await updateDate(newDate); // Actualizar cita existente
      } else {
        await addDate(newDate); // Añadir nueva cita
      }
      handleCloseModal();
    } catch (error) {
      console.error("Error creating/updating date:", error);
      alert("There was an error creating or updating the date.");
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

              {loading && <Spinner animation="border" variant="primary" className="d-block mx-auto mt-3" />}
              {error && <Alert variant="danger" className="mt-3">{error}</Alert>}

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

              {loading && <Spinner animation="border" variant="primary" className="d-block mx-auto mt-3" />}
              {error && <Alert variant="danger" className="mt-3">{error}</Alert>}

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

              {loading && <Spinner animation="border" variant="primary" className="d-block mx-auto mt-3" />}
              {error && <Alert variant="danger" className="mt-3">{error}</Alert>}

              <AvailabilityTable availabilities={availabilities} handleShowModal={handleShowAvailabilityModal} removeAvailability={removeAvailability} />
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
            {/* Especialidad */}
            <Form.Group controlId="formSpeciality" className="mb-3">
              <Form.Label>Speciality</Form.Label>
              <Form.Control
                type="text"
                name="speciality"
                value={currentDate.speciality || ''}
                onChange={(e) => {
                  setCurrentDate({ ...currentDate, speciality: e.target.value });
                  console.log('Speciality:', e.target.value); // Verificación de valor
                }}
                placeholder="Enter speciality"
                required
              />
            </Form.Group>

            {/* Selección de Doctor */}
            <Form.Group controlId="formDoctor" className="mb-3">
              <Form.Label>Doctor</Form.Label>
              <Form.Control
                as="select"
                name="doctor"
                value={currentDate.doctor || ''}
                onChange={(e) => {
                  const selectedDoctorId = e.target.value;
                  setCurrentDate({ ...currentDate, doctor: selectedDoctorId });
                  console.log('Selected Doctor:', selectedDoctorId); // Verificación de valor
                  fetchAvailableTimes(selectedDoctorId, selectedDate); // Obtener tiempos disponibles
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

            {/* Fecha */}
            <Form.Group controlId="formDate" className="mb-3">
              <Form.Label>Select Date</Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={selectedDate || ''} // Asegúrate de que esté en formato 'YYYY-MM-DD'
                onChange={(e) => {
                  const selectedDateValue = e.target.value;
                  setSelectedDate(selectedDateValue);
                  console.log('Selected Date:', selectedDateValue); // Verificación de valor
                  fetchAvailableTimes(currentDate.doctor, selectedDateValue); // Obtener tiempos disponibles cuando cambia la fecha
                }}
                required
              />
            </Form.Group>

            {/* Tiempo disponible */}
            <Form.Group controlId="formAvailableTime" className="mb-3">
              <Form.Label>Available Time</Form.Label>
              <Form.Control
                as="select"
                name="datetime"
                value={currentDate.datetime || ''}
                onChange={(e) => {
                  setCurrentDate({ ...currentDate, datetime: e.target.value });
                  console.log('Selected Time:', e.target.value); // Verificación de valor
                }}
                required
              >
                <option value="">Select a time</option>
                {availableTimes.length > 0 ? (
                  availableTimes.map((time, index) => (
                    <option key={index} value={time}>
                      {time}
                    </option>
                  ))
                ) : (
                  <option value="">No available times</option>
                )}
              </Form.Control>
            </Form.Group>

            {/* Tipo de cita */}
            <Form.Group controlId="formDateType" className="mb-3">
              <Form.Label>Date Type</Form.Label>
              <Form.Control
                type="text"
                name="date_type"
                value={currentDate.date_type || ''}
                onChange={(e) => {
                  setCurrentDate({ ...currentDate, date_type: e.target.value });
                  console.log('Date Type:', e.target.value); // Verificación de valor
                }}
                placeholder="Enter the type of date (e.g., 'Consulta', 'Urgente')"
                required
              />
            </Form.Group>

            {/* Motivo de la cita */}
            <Form.Group controlId="formReasonForAppointment" className="mb-3">
              <Form.Label>Reason for Appointment</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="reason_for_appointment"
                value={currentDate.reason_for_appointment || ''}
                onChange={(e) => {
                  setCurrentDate({ ...currentDate, reason_for_appointment: e.target.value });
                  console.log('Reason:', e.target.value); // Verificación de valor
                }}
                placeholder="Describe the reason for the appointment"
                required
              />
            </Form.Group>

            {/* Selección de usuario */}
            <Form.Group controlId="formUserId" className="mb-3">
              <Form.Label>User</Form.Label>
              <Form.Control
                as="select"
                name="user_id"
                value={currentDate.user_id || ''}
                onChange={(e) => {
                  setCurrentDate({ ...currentDate, user_id: e.target.value });
                  console.log('Selected User:', e.target.value); // Verificación de valor
                }}
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
