import React, { useContext, useState } from 'react';
import { DateContext } from '../store/DateContext';
import { DoctorContext } from '../store/DoctorContext';
import { AvailabilityContext } from '../store/AvailabilityContext';
import DoctorAvailability from '../component/DoctorAvailability';
import DateTable from '../component/DateTable';
import DoctorTable from '../component/DoctorTable';
import AvailabilityTable from '../component/AvailabilityTable';
import { Button, Modal, Form, Spinner, Alert, Card, Row, Col } from 'react-bootstrap';

export const AdminPanel = () => {
  const { dates, addDate, updateDate, removeDate, loading, error } = useContext(DateContext);
  const { doctors, addDoctor, updateDoctor, removeDoctor } = useContext(DoctorContext);
  const { availabilities, addAvailability, updateAvailability, removeAvailability } = useContext(AvailabilityContext);

  // Estados separados para cada modal
  const [showDateModal, setShowDateModal] = useState(false);
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);

  const [editMode, setEditMode] = useState(false);

  // Estados para cada entidad
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

  // Handlers para mostrar modales
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

  // Handlers para cerrar modales
  const handleCloseModal = () => {
    setShowDateModal(false);
    setShowDoctorModal(false);
    setShowAvailabilityModal(false);
  };

  // Handlers de cambio y submit para cada entidad
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

  const handleDateSubmit = async (e) => {
    e.preventDefault();
    if (editMode) {
      await updateDate(currentDate);
    } else {
      await addDate(currentDate);
    }
    handleCloseModal();
  };

  const handleDoctorSubmit = async (e) => {
    e.preventDefault();

    // Validaciones del formulario
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

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Admin Panel</h1>

      <Row>
        {/* Dates Management */}
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title className="text-center mb-4">Dates</Card.Title>
              <Button variant="primary" onClick={() => handleShowDateModal()}>
                Add Date
              </Button>

              {loading && <Spinner animation="border" variant="primary" className="d-block mx-auto mt-3" />}
              {error && <Alert variant="danger" className="mt-3">{error}</Alert>}

              <DateTable dates={dates} handleShowModal={handleShowDateModal} removeDate={removeDate} />
            </Card.Body>
          </Card>
        </Col>

        {/* Doctors Management */}
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title className="text-center mb-4">Doctors</Card.Title>
              <Button variant="primary" onClick={() => handleShowDoctorModal()}>
                Add Doctor
              </Button>

              {loading && <Spinner animation="border" variant="primary" className="d-block mx-auto mt-3" />}
              {error && <Alert variant="danger" className="mt-3">{error}</Alert>}

              <DoctorTable doctors={doctors} handleShowModal={handleShowDoctorModal} removeDoctor={removeDoctor} />
            </Card.Body>
          </Card>
        </Col>

        {/* Availability Management */}
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title className="text-center mb-4">Availability</Card.Title>
              <Button variant="primary" onClick={() => handleShowAvailabilityModal()}>
                Add Availability
              </Button>

              {loading && <Spinner animation="border" variant="primary" className="d-block mx-auto mt-3" />}
              {error && <Alert variant="danger" className="mt-3">{error}</Alert>}

              <AvailabilityTable availabilities={availabilities} handleShowModal={handleShowAvailabilityModal} removeAvailability={removeAvailability} />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal for Adding/Editing Date */}
      <Modal show={showDateModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? 'Edit Date' : 'Add Date'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleDateSubmit}>
            <Form.Group controlId="formSpeciality">
              <Form.Label>Speciality</Form.Label>
              <Form.Control
                type="text"
                name="speciality"
                value={currentDate.speciality || ''}
                onChange={handleDateChange}
                placeholder="Enter speciality"
                required
              />
            </Form.Group>


            <Form.Group controlId="formDoctor">
              <Form.Label>Doctor</Form.Label>
              <Form.Control
                type="text"
                name="doctor"
                value={currentDate.doctor || ''}
                onChange={handleDateChange}
                placeholder="Enter doctor"
                required
              />
            </Form.Group>

            <Form.Group controlId="formDatetime">
              <Form.Label>Datetime</Form.Label>
              <Form.Control
                type="datetime-local"
                name="datetime"
                value={currentDate.datetime || ''}
                onChange={handleDateChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formReasonForAppointment">
              <Form.Label>Reason for Appointment</Form.Label>
              <Form.Control
                type="text"
                name="reason_for_appointment"
                value={currentDate.reason_for_appointment || ''}
                onChange={handleDateChange}
                placeholder="Enter reason for appointment"
                required
              />
            </Form.Group>

            <Form.Group controlId="formDateType">
              <Form.Label>Date Type</Form.Label>
              <Form.Control
                type="text"
                name="date_type"
                value={currentDate.date_type || ''}
                onChange={handleDateChange}
                placeholder="Enter date type"
                required
              />
            </Form.Group>

            <Form.Group controlId="formUserId">
              <Form.Label>User ID</Form.Label>
              <Form.Control
                type="number"
                name="user_id"
                value={currentDate.user_id || ''}
                onChange={handleDateChange}
                placeholder="Enter user ID"
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="mt-3">
              {editMode ? 'Update Date' : 'Add Date'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal for Adding/Editing Doctor */}
      <Modal show={showDoctorModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? 'Edit Doctor' : 'Add Doctor'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleDoctorSubmit}>
            <Form.Group controlId="formName">
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

            <Form.Group controlId="formEmail">
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

            <Form.Group controlId="formSpeciality">
              <Form.Label>Speciality</Form.Label>
              <Form.Control
                type="text"
                name="speciality"
                value={currentDoctor.speciality}
                onChange={handleDoctorChange}
                placeholder="Enter doctor's speciality"
                required
              />
            </Form.Group>

            {!editMode && (
              <Form.Group controlId="formPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={currentDoctor.password}
                  onChange={handleDoctorChange}
                  placeholder="Enter doctor's password"
                  required
                />
              </Form.Group>
            )}

            <Form.Group controlId="formLastName">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                name="last_name"
                value={currentDoctor.last_name}
                onChange={handleDoctorChange}
                placeholder="Enter doctor's last name"
              />
            </Form.Group>

            <Form.Group controlId="formDocumentType">
              <Form.Label>Document Type</Form.Label>
              <Form.Control
                type="text"
                name="document_type"
                value={currentDoctor.document_type}
                onChange={handleDoctorChange}
                placeholder="Enter document type"
              />
            </Form.Group>

            <Form.Group controlId="formDocumentNumber">
              <Form.Label>Document Number</Form.Label>
              <Form.Control
                type="text"
                name="document_number"
                value={currentDoctor.document_number}
                onChange={handleDoctorChange}
                placeholder="Enter document number"
              />
            </Form.Group>

            <Form.Group controlId="formAddress">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                name="address"
                value={currentDoctor.address}
                onChange={handleDoctorChange}
                placeholder="Enter address"
              />
            </Form.Group>

            <Form.Group controlId="formPhone">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                value={currentDoctor.phone}
                onChange={handleDoctorChange}
                placeholder="Enter phone number"
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="mt-3">
              {editMode ? 'Update Doctor' : 'Add Doctor'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal for Adding/Editing Availability */}
      <Modal show={showAvailabilityModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? 'Edit Availability' : 'Add Availability'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAvailabilitySubmit}>
            <Form.Group controlId="formDoctorId">
              <Form.Label>Doctor</Form.Label>
              <Form.Control
                as="select"
                name="doctor_id"
                value={currentAvailability.doctor_id || ''}
                onChange={handleAvailabilityChange}
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
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={currentAvailability.date || ''}
                onChange={handleAvailabilityChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formStartTime">
              <Form.Label>Start Time</Form.Label>
              <Form.Control
                type="time"
                name="start_time"
                value={currentAvailability.start_time || ''}
                onChange={handleAvailabilityChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formEndTime">
              <Form.Label>End Time</Form.Label>
              <Form.Control
                type="time"
                name="end_time"
                value={currentAvailability.end_time || ''}
                onChange={handleAvailabilityChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formIsAvailable">
              <Form.Check
                type="checkbox"
                name="is_available"
                label="Is Available"
                checked={currentAvailability.is_available || false}
                onChange={handleAvailabilityChange}
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="mt-3">
              {editMode ? 'Update Availability' : 'Add Availability'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <DoctorAvailability />
    </div>
  );
};

export default AdminPanel;
