import React, { createContext, useState, useEffect } from 'react';

export const AppointmentContext = createContext();

export const AppointmentProvider = ({ children }) => {
    const [appointments, setAppointments] = useState([]);
    const [appointmentsError, setAppointmentsError] = useState(null);
    const [availability, setAvailability] = useState([]);
    const [doctors, setDoctors] = useState([]);  // Nuevo estado para los doctores
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const appointment = async (speciality, doctor, datetime, reason_for_appointment, date_type) => {
        try {
            const response = await fetch(process.env.BACKEND_URL + '/dates', {
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

        const headers = {
            'Content-Type': 'application/json',
        };

        // Solo incluir el token si existe
        const token = getToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        // Verifica si el usuario está autenticado o no, y ajusta el `user_id` si es necesario
        const formattedAppointment = {
            ...appointment,
            user_id: appointment.user_id ? appointment.user_id : null,  // Si no hay user_id, envía null
        };

        try {
            const response = await fetch(`${process.env.BACKEND_URL}/dates`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(formattedAppointment),
            });
            const data = await response.json();

            if (response.ok) {
                setAppointments([...appointments, data]);
            } else {
                console.error('Error adding appointment:', data.message);
            }
        } catch (error) {
            console.error('Error adding appointment:', error.message);
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
        try {
            const response = await fetch(`${process.env.BACKEND_URL}/doctors`);
            if (!response.ok) {
                const errorData = await response.json();
                console.log("Error al obtener doctores:", errorData);
                throw new Error(`Error: ${response.status}`);
            }
            const data = await response.json();
            setDoctors(data);
        } catch (error) {
            console.error('Error fetching doctors:', error);
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
