import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AvailabilityContext = createContext();

const AvailabilityProvider = ({ children }) => {
    const [availabilities, setAvailabilities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAvailabilities = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${process.env.BACKEND_URL}/availability`);
                setAvailabilities(response.data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchAvailabilities();
    }, []);

    const addAvailability = async (availability) => {
        try {
            const response = await axios.post(`${process.env.BACKEND_URL}/availability`, availability);
            setAvailabilities([...availabilities, response.data]);
        } catch (error) {
            setError(error.message);
        }
    };

    const updateAvailability = async (availability) => {
        try {
            const response = await axios.put(`${process.env.BACKEND_URL}/availability/${availability.id}`, availability);
            setAvailabilities(availabilities.map((a) => (a.id === availability.id ? response.data : a)));
        } catch (error) {
            setError(error.message);
        }
    };

    const removeAvailability = async (id) => {
        try {
            await axios.delete(`${process.env.BACKEND_URL}/availability/${id}`);
            setAvailabilities(availabilities.filter((a) => a.id !== id));
        } catch (error) {
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