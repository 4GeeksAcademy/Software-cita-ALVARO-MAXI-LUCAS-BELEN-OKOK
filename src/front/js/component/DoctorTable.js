import React from 'react';

const DoctorTable = ({ doctors, handleShowModal, removeDoctor }) => {
    return (
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Speciality</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {doctors.map((doctor) => (
                    <tr key={doctor.id}>
                        <td>{doctor.id}</td>
                        <td>{doctor.name}</td>
                        <td>{doctor.email}</td>
                        <td>{doctor.speciality}</td>
                        <td>
                            <button onClick={() => handleShowModal(doctor)}>Edit</button>
                            <button onClick={() => removeDoctor(doctor.id)}>Delete</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default DoctorTable;