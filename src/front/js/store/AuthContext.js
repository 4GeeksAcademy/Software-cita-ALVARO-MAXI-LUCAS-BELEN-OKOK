import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // Función para iniciar sesión
    const login = async (email, password) => {
        try {
            const response = await fetch(process.env.BACKEND_URL +'/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // Guardar el token JWT en localStorage
                localStorage.setItem('token', data.token);
                
                // Establecer el usuario en el estado (asumimos que recibes el usuario en la respuesta)
                setUser(data.user);  
                
                // Guardar el usuario en localStorage para persistencia
                localStorage.setItem('user', JSON.stringify(data.user));
                
                return true;  // Devuelve éxito
            } else {
                console.error('Login failed:', data.message);
                return false;  // Devuelve fracaso
            }
        } catch (error) {
            console.error('Error during login:', error);
            return false;
        }
    };

    // Función para cerrar sesión
    const logout = () => {
        setUser(null);
        localStorage.removeItem('token'); // Remover el token de localStorage
        localStorage.removeItem('user');  // Remover el usuario de localStorage
    };

    // Cargar el usuario desde localStorage cuando el componente se monta
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');
        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
