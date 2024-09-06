import React, { createContext, useState, useEffect } from 'react';

export const AppointmentContext = createContext();

export const AppointmentProvider = ({ children }) => {
    const [appointments, setAppointments] = useState([]);
    const [availability, setAvailability] = useState([]);
    const [doctors, setDoctors] = useState([]);  // Nuevo estado para los doctores
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getAppointments = async () => {
        setLoading(true);
        // Obtén el token JWT desde donde lo almacenes, por ejemplo, localStorage
        const token = localStorage.getItem('token');  // Asegúrate de que el token esté en localStorage
        try {
            const response = await fetch(process.env.BACKEND_URL + '/dates', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },

            });
            const data = await response.json();
            setAppointments(data);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    const addAppointment = async (appointment) => {
        setLoading(true);
        try {
            const response = await fetch(process.env.BACKEND_URL + '/dates', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(appointment),
            });
            const data = await response.json();
            setAppointments([...appointments, data]);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    const removeAppointment = async (id) => {
        setLoading(true);
        try {
            await fetch(process.env.BACKEND_URL + `/dates/${id}`, { method: 'DELETE' });
            setAppointments(appointments.filter(appointment => appointment.id !== id));
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    const getAvailability = async () => {
        setLoading(true);
        try {
            const response = await fetch(process.env.BACKEND_URL + '/availability', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            const data = await response.json();
            setAvailability(data);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    const getDoctors = async () => {
        setLoading(true);
        try {
            // Obtén el token JWT desde donde lo almacenes, por ejemplo, localStorage
            const token = localStorage.getItem('token');  // Asegúrate de que el token esté en localStorage

            const response = await fetch(process.env.BACKEND_URL + '/doctors', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`  // Agrega el token al encabezado
                },
            });

            // Verifica si la respuesta fue exitosa
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            setDoctors(data);
            console.log(data)
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        getAppointments();
        getAvailability();
        getDoctors();  // Llamar a la función para obtener doctores
    }, []);

    return (
        <AppointmentContext.Provider
            value={{
                appointments,
                availability,
                doctors,
                loading,
                error,
                addAppointment,
                removeAppointment,
                getDoctors,
                getAvailability
            }}
        >
            {children}
        </AppointmentContext.Provider>
    );
};
