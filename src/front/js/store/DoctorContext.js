import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const DoctorContext = createContext();

const DoctorProvider = ({ children }) => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDoctors = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${process.env.BACKEND_URL}/doctors`);
                setDoctors(response.data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchDoctors();
    }, []);

    const addDoctor = async (doctor) => {
        try {
            const response = await axios.post(`${process.env.BACKEND_URL}/doctors`, doctor);
            setDoctors([...doctors, response.data]);
        } catch (error) {
            setError(error.message);
        }
    };

    const updateDoctor = async (doctor) => {
        try {
            const response = await axios.put(`${process.env.BACKEND_URL}/api/doctors/${doctor.id}`, doctor);
            setDoctors(doctors.map((d) => (d.id === doctor.id ? response.data : d)));
        } catch (error) {
            setError(error.message);
        }
    };

    const removeDoctor = async (id) => {
        try {
            await axios.delete(`${process.env.BACKEND_URL}/api/doctors/${doctor.id}`);;
            setDoctors(doctors.filter((d) => d.id !== id));
        } catch (error) {
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