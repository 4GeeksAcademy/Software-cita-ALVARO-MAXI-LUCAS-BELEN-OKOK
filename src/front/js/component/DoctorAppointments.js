import React, { useContext, useState } from 'react';
import { AppointmentContext } from '../store/AppointmentContext';
import { Modal, Button, Form, Table, Spinner, Alert } from 'react-bootstrap';

export const DoctorAppointments = () => {
    const { doctors, addDoctor, updateDoctor, removeDoctor, loading, error } = useContext(AppointmentContext);
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentDoctor, setCurrentDoctor] = useState({ name: '', email: '', speciality: '' });

    const handleShowModal = (doctor = { name: '', email: '', speciality: '' }) => {
        setCurrentDoctor(doctor);
        setEditMode(!!doctor.id);
        setShowModal(true);
    };

    const handleCloseModal = () => setShowModal(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentDoctor({ ...currentDoctor, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editMode) {
            await updateDoctor(currentDoctor);
        } else {
            await addDoctor(currentDoctor);
        }
        handleCloseModal();
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Doctor Management</h1>
            <Button variant="primary" onClick={() => handleShowModal()}>
                Add Doctor
            </Button>

            {loading && <Spinner animation="border" variant="primary" />}
            {error && <Alert variant="danger">{error}</Alert>}

            <Table striped bordered hover className="mt-3">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Speciality</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {doctors.map((doctor, index) => (
                        <tr key={doctor.id}>
                            <td>{index + 1}</td>
                            <td>{doctor.name}</td>
                            <td>{doctor.email}</td>
                            <td>{doctor.speciality}</td>
                            <td>
                                <Button variant="warning" onClick={() => handleShowModal(doctor)}>
                                    Edit
                                </Button>{' '}
                                <Button variant="danger" onClick={() => removeDoctor(doctor.id)}>
                                    Delete
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

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
        </div>
    );
}
y
export default DoctorAppointments;
