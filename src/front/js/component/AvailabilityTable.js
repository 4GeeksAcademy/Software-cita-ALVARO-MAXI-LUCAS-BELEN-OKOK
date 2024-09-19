import React from 'react';

// Función para convertir day_of_week (número) a su representación textual
const getDayOfWeek = (day) => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return days[day] || 'Invalid day';
};

const AvailabilityTable = ({ availabilities, handleShowModal, removeAvailability }) => {
    return (
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Doctor ID</th>
                    <th>Day of Week</th>
                    <th>Start Time</th>
                    <th>End Time</th>
                    <th>Is Available</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {availabilities.map((availability) => (
                    <tr key={availability.id}>
                        <td>{availability.id}</td>
                        <td>{availability.doctor_id}</td>
                        <td>{getDayOfWeek(availability.day_of_week)}</td>
                        <td>{availability.start_time}</td>
                        <td>{availability.end_time}</td>
                        <td>{availability.is_available ? 'Yes' : 'No'}</td>
                        <td>
                            <button onClick={() => handleShowModal(availability)}>Edit</button>
                            <button onClick={() => removeAvailability(availability.id)}>Delete</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default AvailabilityTable;
