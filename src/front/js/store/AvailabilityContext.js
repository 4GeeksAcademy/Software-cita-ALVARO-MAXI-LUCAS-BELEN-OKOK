import React, { createContext, useState, useEffect } from 'react';

const AvailabilityContext = createContext();

const AvailabilityProvider = ({ children }) => {
    const [availabilities, setAvailabilities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getToken = () => localStorage.getItem('token');

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

    const addAvailability = async (availability) => {
        const token = getToken();
        try {
            const response = await fetch(`${process.env.BACKEND_URL}/availability`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(availability),  // Asegúrate de que availability contiene doctor_id, start_time, end_time y date
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


    const updateAvailability = async (availability) => {
        const token = getToken();
        try {
            const response = await fetch(`${process.env.BACKEND_URL}/availability/${availability.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(availability),
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

    const removeAvailability = async (id) => {
        const token = getToken();
        try {
            const response = await fetch(`${process.env.BACKEND_URL}/availability/${id}`, {
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
            }}
        >
            {children}
        </AvailabilityContext.Provider>
    );
};

export { AvailabilityProvider, AvailabilityContext };
