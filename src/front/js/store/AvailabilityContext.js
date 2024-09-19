import React, { createContext, useState, useEffect } from 'react';

const AvailabilityContext = createContext();

const AvailabilityProvider = ({ children }) => {
    const [availabilities, setAvailabilities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getToken = () => localStorage.getItem('token');



    // Definir getAvailabilityByDate en el archivo donde está implementada

    const getAvailabilityByDate = async (doctorId, selectedDate) => {
        try {
            // Asegurarse de que la fecha esté en formato 'YYYY-MM-DD'
            const formattedDate = selectedDate.toISOString().split('T')[0];  // Formato YYYY-MM-DD

            const response = await fetch(`${process.env.BACKEND_URL}/doctor/${doctorId}/availability-by-date?date=${formattedDate}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error(`Error fetching availability. Status: ${response.status}`);
            }

            const availability = await response.json();
            return availability;
        } catch (error) {
            console.error('Error fetching availability:', error);
            return [];
        }
    };



    // Obtener todas las disponibilidades de todos los doctores
    useEffect(() => {
        const token = getToken();
        const fetchAvailabilities = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${process.env.BACKEND_URL}/availability`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                setAvailabilities(data);
            } catch (error) {
                console.error('Error fetching availabilities:', error.message);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchAvailabilities();
    }, []);

    // Agregar disponibilidad
    const addAvailability = async (availability) => {
        const token = getToken();
        try {
            const response = await fetch(`${process.env.BACKEND_URL}/doctor/${availability.doctor_id}/availability`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    day_of_week: availability.day_of_week,
                    start_time: availability.start_time,
                    end_time: availability.end_time,
                }),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            setAvailabilities([...availabilities, data]);
        } catch (error) {
            console.error('Error adding availability:', error.message);
            setError(error.message);
        }
    };

    // Actualizar disponibilidad
    const updateAvailability = async (availability) => {
        const token = getToken();
        try {
            const response = await fetch(`${process.env.BACKEND_URL}/doctor/${availability.doctor_id}/availability/${availability.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    day_of_week: availability.day_of_week,
                    start_time: availability.start_time,
                    end_time: availability.end_time,
                }),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            setAvailabilities(availabilities.map((a) => (a.id === availability.id ? data : a)));
        } catch (error) {
            console.error('Error updating availability:', error.message);
            setError(error.message);
        }
    };

    // Eliminar disponibilidad
    const removeAvailability = async (id) => {
        const token = getToken();
        try {
            const response = await fetch(`${process.env.BACKEND_URL}/doctor/availability/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            setAvailabilities(availabilities.filter((a) => a.id !== id));
        } catch (error) {
            console.error('Error removing availability:', error.message);
            setError(error.message);
        }
    };

    return (
        <AvailabilityContext.Provider
            value={{
                availabilities,
                addAvailability,
                updateAvailability,
                removeAvailability,
                loading,
                error,
                getAvailabilityByDate
            }}
        >
            {children}
        </AvailabilityContext.Provider>
    );
};

export { AvailabilityProvider, AvailabilityContext };
