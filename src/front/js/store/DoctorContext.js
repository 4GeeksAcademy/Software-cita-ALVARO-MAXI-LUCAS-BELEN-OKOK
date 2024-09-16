import React, { createContext, useState, useEffect } from 'react';

const DoctorContext = createContext();

const DoctorProvider = ({ children }) => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const getToken = () => localStorage.getItem('token');

    useEffect(() => {
        const fetchDoctors = async () => {
            setLoading(true);
            const token = getToken();
            try {
                const response = await fetch(`${process.env.BACKEND_URL}/doctors`, {
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
                setDoctors(data);
            } catch (error) {
                console.error('Error fetching doctors:', error.message);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchDoctors();
    }, []);

    const addDoctor = async (doctor) => {
        const token = getToken();
        try {
            const response = await fetch(`${process.env.BACKEND_URL}/doctors`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(doctor),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            setDoctors([...doctors, data]);
        } catch (error) {
            console.error('Error adding doctor:', error.message);
            setError(error.message);
        }
    };

    const updateDoctor = async (doctor) => {
        const token = getToken();
        try {
            const response = await fetch(`${process.env.BACKEND_URL}/doctors/${doctor.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(doctor),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            setDoctors(doctors.map((d) => (d.id === doctor.id ? data : d)));
        } catch (error) {
            console.error('Error updating doctor:', error.message);
            setError(error.message);
        }
    };

    const removeDoctor = async (id) => {
        const token = getToken();
        try {
            const response = await fetch(`${process.env.BACKEND_URL}/doctors/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            setDoctors(doctors.filter((d) => d.id !== id));
        } catch (error) {
            console.error('Error removing doctor:', error.message);
            setError(error.message);
        }
    };

    return (
        <DoctorContext.Provider
            value={{
                doctors,
                addDoctor,
                updateDoctor,
                removeDoctor,
                loading,
                error,
            }}
        >
            {children}
        </DoctorContext.Provider>
    );
};

export { DoctorProvider, DoctorContext };
