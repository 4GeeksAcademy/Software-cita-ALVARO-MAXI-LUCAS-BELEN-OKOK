import React, { createContext, useState, useEffect } from 'react';

const DateContext = createContext();

const DateProvider = ({ children }) => {
    const [dates, setDates] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getToken = () => localStorage.getItem('token'); // Extract token retrieval logic

    useEffect(() => {
        const fetchDates = async () => {
            setLoading(true);
            const token = getToken();
            try {
                const response = await fetch(`${process.env.BACKEND_URL}/dates`, {
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
                setDates(data);
            } catch (error) {
                console.error('Error fetching dates:', error.message);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchDates();
    }, []);

    const addDate = async (date) => {
        const token = getToken();

        try {

            const response = await fetch(`${process.env.BACKEND_URL}/dates`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(date),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            setDates([...dates, data]);
        } catch (error) {
            console.error('Error adding date:', error.message);
            setError(error.message);
        }
    };

    const updateDate = async (date) => {
        const token = getToken();
        try {
            const response = await fetch(`${process.env.BACKEND_URL}/dates/${date.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(date),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            setDates(dates.map((d) => (d.id === date.id ? data : d)));
        } catch (error) {
            console.error('Error updating date:', error.message);
            setError(error.message);
        }
    };

    const removeDate = async (id) => {
        const token = getToken();
        try {
            const response = await fetch(`${process.env.BACKEND_URL}/dates/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            setDates(dates.filter((d) => d.id !== id));
        } catch (error) {
            console.error('Error removing date:', error.message);
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
