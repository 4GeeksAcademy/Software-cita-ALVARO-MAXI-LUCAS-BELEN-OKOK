import React, { createContext, useState, useEffect } from 'react';

// Crear el contexto de autenticación
export const AuthContext = createContext();

// Proveedor del contexto de autenticación
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // Función para iniciar sesión
    const login = (username, password) => {
        // Lógica de autenticación simulada
        if (username === 'admin' && password === 'admin') {
            setUser({ username });
            // Guardar el usuario en localStorage para persistencia
            localStorage.setItem('user', JSON.stringify({ username }));
        }
    };

    // Función para cerrar sesión
    const logout = () => {
        setUser(null);
        localStorage.removeItem('user'); // Remover usuario de localStorage al cerrar sesión
    };

    // Cargar el usuario desde localStorage cuando el componente se monta
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
