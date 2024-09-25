import React, { useEffect, useState } from "react";

export const NextDate = () => {
  const [dates, setDates] = useState([]); // Estado para almacenar los datos de fechas
  const [error, setError] = useState(null); // Estado para manejar errores

  // Función para obtener el token del localStorage
  const getToken = () => localStorage.getItem("token");

  useEffect(() => {
    const token = getToken();
  
    const getUserDate = async () => {
      try {
        const response = await fetch(`${process.env.BACKEND_URL}/private/dates`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
  
        // Verifica si la respuesta es correcta
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        // Convierte la respuesta a JSON
        const data = await response.json();
  
        // Accede a la clave 'dates' del objeto data
        setDates(data.dates); // Actualiza el estado con los datos obtenidos
      } catch (error) {
        console.error("Error fetching dates:", error.message);
        setError(error.message); // Actualiza el estado de error
      }
    };
  
    getUserDate();
  }, []);
  

  return (
    <div>
      {error ? (
        // Muestra el mensaje de error si hay un problema al obtener los datos
        <p>Error fetching dates: {error}</p>
      ) : (
        // Renderiza los datos obtenidos
        <ul>
          {dates.length > 0 ? (
            // Mapea y muestra cada fecha obtenida en la respuesta
            dates.map((date, index) => (
              <li key={index}>
                {typeof date === "object"
                  ? JSON.stringify(date) // Si date es un objeto, lo muestra como string
                  : date}
              </li>
            ))
          ) : (
            // Mensaje si no hay datos disponibles
            <li>No dates available</li>
          )}
        </ul>
      )}
    </div>
  );
};