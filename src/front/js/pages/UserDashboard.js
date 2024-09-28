import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../store/AuthContext';
import { Container, Row, Col, Card, Table, Alert, Button, Modal, Form } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const UserDashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [appointmentStats, setAppointmentStats] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        if (user) {
            fetchUserAppointments();
            fetchAppointmentStatistics();
            fetchNotifications();
        }
    }, [user]);

    // Fetch appointments for the logged-in user
    const fetchUserAppointments = async () => {
        try {
            const response = await fetch(`${process.env.BACKEND_URL}/private/dates`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            const data = await response.json();

            if (response.ok) {
                setAppointments(data.dates);
            } else {
                setError(data.message || "Error loading appointments");
            }
        } catch (error) {
            setError('Error fetching appointments');
        } finally {
            setLoading(false);
        }
    };

    // Fetch appointment statistics for the chart
    const fetchAppointmentStatistics = async () => {
        try {
            const response = await fetch(`${process.env.BACKEND_URL}/api/statistics`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            const data = await response.json();

            if (response.ok) {
                setAppointmentStats(data);
            } else {
                setError(data.message || "Error loading statistics");
            }
        } catch (error) {
            setError('Error fetching statistics');
        }
    };

    // Fetch notifications
    const fetchNotifications = async () => {
        try {
            const response = await fetch(`${process.env.BACKEND_URL}/notifications`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            const data = await response.json();

            if (response.ok) {
                setNotifications(data);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    // Prepare data for the chart
    const chartData = {
        labels: appointmentStats.map(stat => stat.month),
        datasets: [
            {
                label: 'Appointments per Month',
                data: appointmentStats.map(stat => stat.appointments),
                borderColor: '#007bff',
                backgroundColor: 'rgba(0, 123, 255, 0.5)',
                fill: true,
            },
        ],
    };

    // Handle edit modal open
    const handleEdit = (appointment) => {
        setSelectedAppointment({ ...appointment });
        setShowEditModal(true);
    };

    // Handle save changes
    const handleSaveChanges = async () => {
        try {
            const response = await fetch(`${process.env.BACKEND_URL}/dates/${selectedAppointment.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(selectedAppointment),
            });

            if (response.ok) {
                alert('Cita actualizada con éxito');
                setShowEditModal(false);
                fetchUserAppointments();  // Refetch appointments to refresh the list
            } else {
                alert('Error al actualizar la cita');
            }
        } catch (error) {
            console.error('Error al actualizar la cita:', error);
        }
    };

    // Handle input changes in the edit modal
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSelectedAppointment({ ...selectedAppointment, [name]: value });
    };

    return (
        <Container className="mt-5">
            <h2 className="text-center">👁️ Bienvenido, {user?.name}!</h2>



            {/* Section for Notifications */}
            <Row className="mb-4">
                <Col>
                    <Card>
                        <Card.Header>🔔 Notificaciones</Card.Header>
                        <Card.Body>
                            {notifications.length > 0 ? (
                                <ul>
                                    {notifications.map((notification, index) => (
                                        <li key={index}>{notification.message}</li>
                                    ))}
                                </ul>
                            ) : (
                                <Alert variant="info">No tienes notificaciones pendientes.</Alert>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Upcoming Appointments */}
            <Row className="mb-4">
                <Col>
                    <Card>
                        <Card.Header>📅 Próximas Citas</Card.Header>
                        <Card.Body>
                            {loading ? (
                                <Alert variant="info">Loading appointments...</Alert>
                            ) : error ? (
                                <Alert variant="danger">{error}</Alert>
                            ) : (
                                <Table striped bordered hover responsive>
                                    <thead>
                                        <tr>
                                            <th>Fecha</th>
                                            <th>Doctor</th>
                                            <th>Razón</th>
                                            <th>Estatus</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {appointments.length > 0 ? (
                                            appointments.map(appointment => (
                                                <tr key={appointment.id}>
                                                    <td>{new Date(appointment.datetime).toLocaleDateString()}</td>
                                                    <td>{appointment.doctor_name || 'Desconocido'}</td> {/* Usa appointment.doctor_name */}
                                                    <td>{appointment.reason_for_appointment}</td>
                                                    <td>{appointment.status || 'Pendiente'}</td>
                                                    <td>
                                                        <Button variant="warning" size="sm" onClick={() => handleEdit(appointment)}>Editar</Button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="text-center">No hay citas próximas</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Appointment Statistics Chart */}
            <Row className="mb-4">
                <Col>
                    <Card>
                        <Card.Header>📊 Estadísticas Mensuales de Citas</Card.Header>
                        <Card.Body>
                            <Line data={chartData} />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Edit Appointment Modal */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Editar Cita</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Doctor</Form.Label>
                            <Form.Control
                                type="text"
                                name="doctor"
                                value={selectedAppointment?.doctor_name || ''}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Fecha y Hora</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                name="datetime"
                                value={selectedAppointment ? new Date(selectedAppointment.datetime).toISOString().slice(0, 16) : ''}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Razón</Form.Label>
                            <Form.Control
                                type="text"
                                name="reason_for_appointment"
                                value={selectedAppointment?.reason_for_appointment || ''}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>Cancelar</Button>
                    <Button variant="primary" onClick={handleSaveChanges}>Guardar Cambios</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default UserDashboard;
