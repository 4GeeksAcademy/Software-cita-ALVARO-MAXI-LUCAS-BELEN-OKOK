import React, { useState, useContext, useEffect } from 'react';
import { Container, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { AppointmentContext } from '../store/AppointmentContext';

export const DoctorAvailability = () => {
    const { availability, getAvailability, doctors } = useContext(AppointmentContext);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [availableTimes, setAvailableTimes] = useState([]);

    useEffect(() => {
        getAvailability();
    }, []);

    const handleDoctorChange = (e) => {
        setSelectedDoctor(e.target.value);
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    useEffect(() => {
        if (selectedDoctor && selectedDate) {
            const doctorAvailability = availability.find(doc => doc.doctorId === selectedDoctor);
            if (doctorAvailability) {
                const selectedDateStr = selectedDate.toISOString().split('T')[0];
                const timesForDate = doctorAvailability.times[selectedDateStr] || [];
                setAvailableTimes(timesForDate);
            }
        }
    }, [selectedDoctor, selectedDate, availability]);

    return (
        <Container className="mt-4 availability-container">
            <h2>Disponibilidad de los doctores</h2>

            <Form>
                <Form.Group controlId="formDoctor">
                    <Form.Label>Doctor</Form.Label>
                    <Form.Control
                        as="select"
                        name="doctor"
                        value={selectedDoctor}
                        onChange={handleDoctorChange}
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
                    <Form.Label>Fecha</Form.Label>
                    <Form.Control
                        type="date"
                        name="date"
                        value={selectedDate}
                        onChange={(e) => handleDateChange(new Date(e.target.value))}
                    />
                </Form.Group>

                <Button variant="primary" type="submit" className="mt-3">
                    Ver disponibilidad
                </Button>
            </Form>

            {availableTimes.length > 0 && (
                <div>
                    <h3>Horarios disponibles para el doctor {selectedDoctor}</h3>
                    <ul>
                        {availableTimes.map((time) => (
                            <li key={time}>{time}</li>
                        ))}
                    </ul>
                </div>
            )}
        </Container>
    );
};

export default DoctorAvailability;