import React, { useContext, useState, useEffect } from 'react';
import { DateContext } from '../store/DateContext';
import { DoctorContext } from '../store/DoctorContext';
import { AvailabilityContext } from '../store/AvailabilityContext';
import DateTable from '../component/DateTable';
import DoctorTable from '../component/DoctorTable';
import AvailabilityTable from '../component/AvailabilityTable';
import Calendar from 'react-calendar'; // Importamos el calendario de React
import 'react-calendar/dist/Calendar.css'; // Importamos los estilos del calendario
import { Button, Modal, Form, Spinner, Alert, Card, Row, Col, Table } from 'react-bootstrap';
import { FaUserMd, FaCalendarAlt, FaClock } from 'react-icons/fa';
import AppointmentChart from '../component/AppointmentChart';
import { AuthContext } from "../store/AuthContext"; // Importa tu contexto de autenticación


export const AdminPanel = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

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
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  const changeRoleToDoctor = async (userId) => {
    try {
      const response = await fetch(`${process.env.BACKEND_URL}/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ role: 'doctor' }),
      });

      if (response.ok) {
        alert("El rol del usuario ha sido cambiado a 'doctor' con éxito.");
        // Actualizar la lista de usuarios después del cambio
        setUsers(users.map(user => (user.id === userId ? { ...user, role: 'doctor' } : user)));
      } else {
        alert("Hubo un error al cambiar el rol del usuario.");
      }
    } catch (error) {
      console.error("Error changing user role:", error);
    }
  };

  if (loading) {
    return <Spinner animation="border" variant="primary" />;
  }

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
      doctor_id: currentDate.doctor,
      datetime: formattedDateTime,
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

  const handleRoleChange = async (userId, newRole) => {
    try {
      const response = await fetch(`${process.env.BACKEND_URL}/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ role: newRole })
      });

      if (response.ok) {
        alert(`Rol cambiado a ${newRole} exitosamente.`);
        // Actualiza la lista de usuarios/doctores después de cambiar el rol
        fetchUsers();
      } else {
        const data = await response.json();
        alert(`Error al cambiar rol: ${data.message}`);
      }
    } catch (error) {
      console.error('Error al cambiar rol:', error);
    }
  };





  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Admin Panel</h1>

      <Row>
        {/* Gestión de Citas */}


        <Col md={4}>
          <section id="dates-section">
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
          </section>
        </Col>

        {/* Gestión de Doctores */}
        <Col md={4}>
          <section id="doctors-section">
            <Card className="shadow-sm mb-4">
              <Card.Body>
                <Card.Title className="text-center mb-4">
                  <FaUserMd className="me-2" /> Doctors
                </Card.Title>
                <Button variant="primary" onClick={() => handleShowDoctorModal({})}>
                  <FaUserMd className="me-2" /> Add Doctor
                </Button>

                {doctorsLoading && <Spinner animation="border" variant="primary" className="d-block mx-auto mt-3" />}
                {doctorsError && <Alert variant="danger" className="mt-3">{doctorsError}</Alert>}

                <DoctorTable
                  doctors={doctors}
                  handleShowModal={handleShowDoctorModal}   // Se pasa correctamente la función
                  removeDoctor={removeDoctor}             // Asegúrate de que la función de eliminación esté vinculada
                />
              </Card.Body>
            </Card>
          </section>
        </Col>

        {/* Gestión de Disponibilidad */}
        <Col md={4}>
          <section id="availability-section">
            <Card className="shadow-sm mb-4">
              <Card.Body>
                <Card.Title className="text-center mb-4">
                  <FaClock className="me-2" /> Availability
                </Card.Title>
                <Button variant="primary" onClick={() => handleShowAvailabilityModal({})}>
                  <FaClock className="me-2" /> Add Availability
                </Button>

                {availabilitiesLoading && <Spinner animation="border" variant="primary" className="d-block mx-auto mt-3" />}
                {availabilitiesError && <Alert variant="danger" className="mt-3">{availabilitiesError}</Alert>}

                <AvailabilityTable
                  availabilities={availabilities}
                  handleShowModal={handleShowAvailabilityModal}  // Se pasa correctamente la función
                  removeAvailability={removeAvailability}       // Asegúrate de que la función de eliminación esté vinculada
                  doctors={doctors}
                />
              </Card.Body>
            </Card>
          </section>
        </Col>
      </Row>

      {/* Modal para agregar/editar cita */}
      <section id='#dates-section'>
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
      </section>

      {/* Modal para agregar/editar doctor */}
      <section id='#doctors-section'>
        <Modal show={showDoctorModal} onHide={handleCloseModal} centered>
          <Modal.Header closeButton className="bg-primary text-white">
            <Modal.Title>{editMode ? 'Edit Doctor' : 'Add Doctor'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleDoctorSubmit}>
              <Form.Group controlId="formDoctorName" className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={currentDoctor.name}
                  onChange={handleDoctorChange}
                  placeholder="Enter doctor's name"
                  required
                />
              </Form.Group>

              <Form.Group controlId="formDoctorEmail" className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={currentDoctor.email}
                  onChange={handleDoctorChange}
                  placeholder="Enter doctor's email"
                  required
                />
              </Form.Group>

              <Form.Group controlId="formDoctorSpeciality" className="mb-3">
                <Form.Label>Speciality</Form.Label>
                <Form.Control
                  type="text"
                  name="speciality"
                  value={currentDoctor.speciality}
                  onChange={handleDoctorChange}
                  placeholder="Enter speciality"
                  required
                />
              </Form.Group>

              <Form.Group controlId="formDoctorDocumentType" className="mb-3">
                <Form.Label>Document Type</Form.Label>
                <Form.Control
                  as="select"
                  name="document_type"
                  value={currentDoctor.document_type}
                  onChange={handleDoctorChange}
                  required
                >
                  <option value="">Select Document Type</option>
                  <option value="passport">Passport</option>
                  <option value="national_id">National ID</option>
                  <option value="driver_license">Driver License</option>
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="formDoctorDocumentNumber" className="mb-3">
                <Form.Label>Document Number</Form.Label>
                <Form.Control
                  type="text"
                  name="document_number"
                  value={currentDoctor.document_number}
                  onChange={handleDoctorChange}
                  placeholder="Enter document number"
                  required
                />
              </Form.Group>

              {!editMode && (
                <Form.Group controlId="formDoctorPassword" className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={currentDoctor.password}
                    onChange={handleDoctorChange}
                    placeholder="Enter password"
                    required
                  />
                </Form.Group>
              )}

              <Button variant="primary" type="submit" className="mt-3 w-100">
                {editMode ? 'Update Doctor' : 'Add Doctor'}
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </section>

      {/* Modal para agregar/editar disponibilidad */}
      <section id='#availability-section'>
        <Modal show={showAvailabilityModal} onHide={handleCloseModal} centered>
          <Modal.Header closeButton className="bg-primary text-white">
            <Modal.Title>{editMode ? 'Edit Availability' : 'Add Availability'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleAvailabilitySubmit}>
              <Form.Group controlId="formAvailabilityDoctor" className="mb-3">
                <Form.Label>Doctor</Form.Label>
                <Form.Control
                  as="select"
                  name="doctor_id"
                  value={currentAvailability.doctor_id}
                  onChange={handleAvailabilityChange}
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

              <Form.Group controlId="formAvailabilityDay" className="mb-3">
                <Form.Label>Day of the Week</Form.Label>
                <Form.Control
                  as="select"
                  name="day_of_week"
                  value={currentAvailability.day_of_week}
                  onChange={handleAvailabilityChange}
                  required
                >
                  <option value="">Select a day</option>
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, index) => (
                    <option key={index} value={index}>
                      {day}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="formAvailabilityStartTime" className="mb-3">
                <Form.Label>Start Time</Form.Label>
                <Form.Control
                  type="time"
                  name="start_time"
                  value={currentAvailability.start_time}
                  onChange={handleAvailabilityChange}
                  required
                />
              </Form.Group>

              <Form.Group controlId="formAvailabilityEndTime" className="mb-3">
                <Form.Label>End Time</Form.Label>
                <Form.Control
                  type="time"
                  name="end_time"
                  value={currentAvailability.end_time}
                  onChange={handleAvailabilityChange}
                  required
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="mt-3 w-100">
                {editMode ? 'Update Availability' : 'Add Availability'}
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </section>
      <div>
        <section id="users-section">
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <Card.Title className="text-center mb-4">Usuarios</Card.Title>
              <Table striped bordered hover responsive className="mt-3">
                <thead className="bg-primary text-white">
                  <tr>
                    <th className="text-center">ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="text-center">{user.id}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                      <td className="text-center">
                        {user.role === 'doctor' ? (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleChangeRole(user.id, 'user')}
                          >
                            Revert to User
                          </Button>
                        ) : (
                          // Dentro de tu componente AdminPanel, en la tabla de usuarios o doctores
                          <Button
                            className='btn btn-primary'
                            variant="btn btn-primary"
                            onClick={() => handleRoleChange(user.id, 'user')} // Aquí llamas a la función para cambiar a "usuario"
                          >
                            Convertir a Usuario
                          </Button>

                        )}
                      </td>

                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </section>
      </div>

      <div className="mb-5">
        <section id="statistics-section">
          <AppointmentChart />
        </section>
      </div>

    </div>
  );
};

export default AdminPanel;
