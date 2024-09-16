import React, { createContext, useState, useEffect } from 'react';

export const AppointmentContext = createContext();

export const AppointmentProvider = ({ children }) => {
    const [appointments, setAppointments] = useState([]);
    const [availability, setAvailability] = useState([]);
    const [doctors, setDoctors] = useState([]);  // Nuevo estado para los doctores
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getToken = () => localStorage.getItem('token'); // Extract token retrieval logic

    const getAppointments = async () => {
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
        const token = getToken();
        try {
            const response = await fetch(`${process.env.BACKEND_URL}/dates`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
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
        const token = getToken();
        try {
            await fetch(`${process.env.BACKEND_URL}/dates/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setAppointments(appointments.filter(appointment => appointment.id !== id));
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    const getAvailability = async () => {
        setLoading(true);
        const token = getToken();
        try {
            const response = await fetch(`${process.env.BACKEND_URL}/availability`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
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
            console.log(data);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };
    const addDoctor = async (doctor) => {
        setLoading(true);
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
            const data = await response.json();
            setDoctors([...doctors, data.doctor]);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    const updateDoctor = async (doctor) => {
        setLoading(true);
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
            const data = await response.json();
            setDoctors(doctors.map(d => (d.id === doctor.id ? data.doctor : d)));
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    const removeDoctor = async (id) => {
        setLoading(true);
        const token = getToken();
        try {
            await fetch(`${process.env.BACKEND_URL}/doctors/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setDoctors(doctors.filter(doctor => doctor.id !== id));
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
                getAvailability,
                addDoctor,
                updateDoctor,
                removeDoctor

            }}
        >
            {children}
        </AppointmentContext.Provider>
    );
};
