import React, { createContext, useState, useEffect } from 'react';

export const RegisterContext = createContext();

export const RegisterProvider = ({ children }) => {
    const [registerError, setRegisterError] = useState(null);
    const [registered, setRegistered] = useState(false);

    // Función para registrar un nuevo usuario
    const register = async (name, last_name, document_type, document_number, address, email, password, phone) => {
        try {
            const response =  await fetch(process.env.BACKEND_URL + '/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    last_name,
                    document_type,
                    document_number,
                    address,
                    email,
                    password,
                    phone,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setRegistered(true);
                return true;  // Devuelve éxito
            } else {
                setRegisterError(data.message);
                return false;  // Devuelve fracaso
            }
        } catch (error) {
            console.error('Error durante el registro:', error);
            return false;
        }
    };

    return (
        <RegisterContext.Provider value={{ registerError, registered, register }}>
            {children}
        </RegisterContext.Provider>
    );
};