import React, { createContext, useState, useEffect } from 'react';

// Crear el contexto de testimonios
export const TestimonialContext = createContext();

// Proveedor del contexto de testimonios
export const TestimonialProvider = ({ children }) => {
    const [testimonials, setTestimonials] = useState([]);

    // Cargar testimonios desde localStorage al montar el componente
    useEffect(() => {
        const storedTestimonials = localStorage.getItem('testimonials');
        if (storedTestimonials) {
            setTestimonials(JSON.parse(storedTestimonials));
        } else {
            // Testimonios iniciales si no hay nada en localStorage
            setTestimonials([
                { id: 1, name: 'Maxi Romero', message: 'Excelente servicio, muy recomendado' },
                { id: 2, name: 'Belen Gallardo', message: 'Me sentí muy cómoda durante la consulta' }
            ]);
        }
    }, []);

    // Guardar testimonios en localStorage cuando se actualicen
    useEffect(() => {
        localStorage.setItem('testimonials', JSON.stringify(testimonials));
    }, [testimonials]);

    // Función para añadir un nuevo testimonio
    const addTestimonial = (testimonial) => {
        setTestimonials([...testimonials, { ...testimonial, id: Date.now() }]);
    };

    return (
        <TestimonialContext.Provider value={{ testimonials, addTestimonial }}>
            {children}
        </TestimonialContext.Provider>
    );
};
