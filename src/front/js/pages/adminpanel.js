import React, { useContext, useState } from 'react';
import { DateContext } from '../store/DateContext';
import { DoctorContext } from '../store/DoctorContext';
import { AvailabilityContext } from '../store/AvailabilityContext';
import DoctorAvailability from '../component/DoctorAvailability';
import DateTable from '../component/DateTable';
import DoctorTable from '../component/DoctorTable';
import AvailabilityTable from '../component/AvailabilityTable';
import { Button, Modal, Form, Spinner, Alert } from 'react-bootstrap';

export const AdminPanel = () => {
  const { dates, addDate, updateDate, removeDate, loading, error } = useContext(DateContext);
  const { doctors, addDoctor, updateDoctor, removeDoctor } = useContext(DoctorContext);
  const { availabilities, addAvailability, updateAvailability, removeAvailability } = useContext(AvailabilityContext);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentDate, setCurrentDate] = useState({ speciality: '', doctor: '', datetime: '', reason_for_appointment: '', date_type: '', user_id: '' });
  const [currentDoctor, setCurrentDoctor] = useState({ name: '', email: '', speciality: '' });
  const [currentAvailability, setCurrentAvailability] = useState({ doctor_id: '', date: '', start_time: '', end_time: '', is_available: true });

  const handleShowModal = (date = { speciality: '', doctor: '', datetime: '', reason_for_appointment: '', date_type: '', user_id: '' }) => {
    setCurrentDate(date);
    setEditMode(!!date.id);
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentDate({ ...currentDate, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editMode) {
      await updateDate(currentDate);
    } else {
      await addDate(currentDate);
    }
    handleCloseModal();
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Admin Panel</h1>

      {/* Dates Management */}
      <h2 className="text-center mb-4">Dates</h2>
      <Button variant="primary" onClick={() => handleShowModal()}>
        Add Date
      </Button>

      {loading && <Spinner animation="border" variant="primary" />}
      {error && <Alert variant="danger">{error}</Alert>}

      <DateTable dates={dates} handleShowModal={handleShowModal} removeDate={removeDate} />

      {/* Modal for Adding/Editing Date */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? 'Edit Date' : 'Add Date'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formSpeciality">
              <Form.Label>Speciality</Form.Label>
              <Form.Control
                type="text"
                name="speciality"
                value={currentDate.speciality}
                onChange={handleChange}
                placeholder="Enter speciality"
                required
              />
            </Form.Group>

            <Form.Group controlId="formDoctor">
              <Form.Label>Doctor</Form.Label>
              <Form.Control
                type="text"
                name="doctor"
                value={currentDate.doctor}
                onChange={handleChange}
                placeholder="Enter doctor"
                required
              />
            </Form.Group>

            <Form.Group controlId="formDatetime">
              <Form.Label>Datetime</Form.Label>
              <Form.Control
                type="datetime-local"
                name="datetime"
                value={currentDate.datetime}
                onChange={handleChange}
                placeholder="Enter datetime"
                required
              />
            </Form.Group>

            <Form.Group controlId="formReasonForAppointment">
              <Form.Label>Reason for Appointment</Form.Label>
              <Form.Control
                type="text"
                name="reason_for_appointment"
                value={currentDate.reason_for_appointment}
                onChange={handleChange}
                placeholder="Enter reason for appointment"
                required
              />
            </Form.Group>

            <Form.Group controlId="formDateType">
              <Form.Label>Date Type</Form.Label>
              <Form.Control
                type="text"
                name="date_type"
                value={currentDate.date_type}
                onChange={handleChange}
                placeholder="Enter date type"
                required
              />
            </Form.Group>

            <Form.Group controlId="formUserId">
              <Form.Label>User ID</Form.Label>
              <Form.Control
                type="number"
                name="user_id"
                value={currentDate.user_id}
                onChange={handleChange}
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

      {/* Doctors Management */}
      <h2 className="text-center mb-4">Doctors</h2>
      <Button variant="primary" onClick={() => handleShowModal(doctor = { name: '', email: '', speciality: '' })}>
        Add Doctor
      </Button>

      {loading && <Spinner animation="border" variant="primary" />}
      {error && <Alert variant="danger">{error}</Alert>}

      <DoctorTable doctors={doctors} handleShowModal={handleShowModal} removeDoctor={removeDoctor} />

      {/* Modal for Adding/Editing Doctor */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? 'Edit Doctor' : 'Add Doctor'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={currentDoctor.name}
                onChange={handleChange}
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
                onChange={handleChange}
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
                onChange={handleChange}
                placeholder="Enter doctor's speciality"
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="mt-3">
              {editMode ? 'Update Doctor' : 'Add Doctor'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Availability Management */}
      <h2 className="text-center mb-4">Availability</h2>
      <Button variant="primary" onClick={() => handleShowModal(availability = { doctor_id: '', date: '', start_time: '', end_time: '', is_available: true })}>
        Add Availability
      </Button>

      {loading && <Spinner animation="border" variant="primary" />}
      {error && <Alert variant="danger">{error}</Alert>}

      <AvailabilityTable availabilities={availabilities} handleShowModal={handleShowModal} removeAvailability={removeAvailability} />

      {/* Modal for Adding/Editing Availability */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? 'Edit Availability' : 'Add Availability'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formDoctorId">
              <Form.Label>Doctor ID</Form.Label>
              <Form.Control
                type="number"
                name="doctor_id"
                value={currentAvailability.doctor_id}
                onChange={handleChange}
                placeholder="Enter doctor ID"
                required
              />
            </Form.Group>

            <Form.Group controlId="formDate">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={currentAvailability.date}
                onChange={handleChange}
                placeholder="Enter date"
                required
              />
            </Form.Group>

            <Form.Group controlId="formStartTime">
              <Form.Label>Start Time</Form.Label>
              <Form.Control
                type="time"
                name="start_time"
                value={currentAvailability.start_time}
                onChange={handleChange}
                placeholder="Enter start time"
                required
              />
            </Form.Group>

            <Form.Group controlId="formEndTime">
              <Form.Label>End Time</Form.Label>
              <Form.Control
                type="time"
                name="end_time"
                value={currentAvailability.end_time}
                onChange={handleChange}
                placeholder="Enter end time"
                required
              />
            </Form.Group>

            <Form.Group controlId="formIsAvailable">
              <Form.Label>Is Available</Form.Label>
              <Form.Control
                type="checkbox"
                name="is_available"
                checked={currentAvailability.is_available}
                onChange={handleChange}
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
}

export default AdminPanel;