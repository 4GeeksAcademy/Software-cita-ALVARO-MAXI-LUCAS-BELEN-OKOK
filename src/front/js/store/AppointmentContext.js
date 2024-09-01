import React, { createContext, useState, useEffect } from 'react';

// Crear el contexto de citas médicas
export const AppointmentContext = createContext();

// Proveedor del contexto de citas médicas
export const AppointmentProvider = ({ children }) => {
    const [appointments, setAppointments] = useState([]);

    // Cargar citas desde localStorage al montar el componente
    useEffect(() => {
        const storedAppointments = localStorage.getItem('appointments');
        if (storedAppointments) {
            setAppointments(JSON.parse(storedAppointments));
        }
    }, []);

    // Guardar citas en localStorage cuando se actualicen
    useEffect(() => {
        localStorage.setItem('appointments', JSON.stringify(appointments));
    }, [appointments]);

    // Función para añadir una nueva cita
    const addAppointment = (appointment) => {
        setAppointments([...appointments, { ...appointment, id: Date.now() }]);
    };

    // Función para eliminar una cita
    const removeAppointment = (id) => {
        setAppointments(appointments.filter(appointment => appointment.id !== id));
    };

    return (
        <AppointmentContext.Provider value={{ appointments, addAppointment, removeAppointment }}>
            {children}
        </AppointmentContext.Provider>
    );
};
