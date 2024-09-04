import React, { createContext, useState, useEffect } from 'react';

// Crear el contexto de citas médicas
export const AppointmentContext = createContext();

// Proveedor del contexto de citas médicas
export const AppointmentProvider = ({ children }) => {
    const [appointments, setAppointments] = useState([]);
    const [appointmentsError, setAppointmentsError] = useState(null);


    const appointment = async (speciality, doctor, datetime, reason_for_appointment, date_type) => {
        try {
            const response =  await fetch(process.env.BACKEND_URL + '/dates', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    speciality,
                    doctor,
                    datetime,
                    reason_for_appointment,
                    date_type
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setAppointments(true);
                return true;  // Devuelve éxito
            } else {
                setAppointmentsError(data.message);
                return false;  // Devuelve fracaso
            }
        } catch (error) {
            console.error('Error durante la obtención de cita', error);
            return false;
        }
    };

   
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
        <AppointmentContext.Provider value={{ appointment, addAppointment, removeAppointment, appointmentsError }}>
            {children}
        </AppointmentContext.Provider>
    );
};
