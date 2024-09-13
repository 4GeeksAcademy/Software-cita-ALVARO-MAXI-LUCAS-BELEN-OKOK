import React from 'react';

const AvailabilityTable = ({ availabilities, handleShowModal, removeAvailability }) => {
    return (
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Doctor ID</th>
                    <th>Date</th>
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
                        <td>{availability.date}</td>
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