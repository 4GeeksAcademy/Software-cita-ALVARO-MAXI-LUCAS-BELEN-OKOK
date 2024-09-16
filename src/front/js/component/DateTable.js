import React from 'react';

const DateTable = ({ dates, handleShowModal, removeDate }) => {
    return (
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Speciality</th>
                    <th>Doctor</th>
                    <th>Datetime</th>
                    <th>Reason for Appointment</th>
                    <th>Date Type</th>
                    <th>User ID</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {dates.map((date) => (
                    <tr key={date.id}>
                        <td>{date.id}</td>
                        <td>{date.speciality}</td>
                        <td>{date.doctor}</td>
                        <td>{date.datetime}</td>
                        <td>{date.reason_for_appointment}</td>
                        <td>{date.date_type}</td>
                        <td>{date.user_id}</td>
                        <td>
                            <button onClick={() => handleShowModal(date)}>Edit</button>
                            <button onClick={() => removeDate(date.id)}>Delete</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default DateTable;