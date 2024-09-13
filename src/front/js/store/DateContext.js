import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const DateContext = createContext();

const DateProvider = ({ children }) => {
    const [dates, setDates] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDates = async () => {
            setLoading(true);
            try {
                const response = await axios.get('api/dates');
                setDates(response.data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchDates();
    }, []);

    const addDate = async (date) => {
        try {
            const response = await axios.post('api/dates', date);
            setDates([...dates, response.data]);
        } catch (error) {
            setError(error.message);
        }
    };

    const updateDate = async (date) => {
        try {
            const response = await axios.put(`api/dates/${date.id}`, date);
            setDates(dates.map((d) => (d.id === date.id ? response.data : d)));
        } catch (error) {
            setError(error.message);
        }
    };

    const removeDate = async (id) => {
        try {
            await axios.delete(`api/dates/${id}`);
            setDates(dates.filter((d) => d.id !== id));
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <DateContext.Provider
            value={{
                dates,
                addDate,
                updateDate,
                removeDate,
                loading,
                error,
            }}
        >
            {children}
        </DateContext.Provider>
    );
};

export { DateProvider, DateContext };