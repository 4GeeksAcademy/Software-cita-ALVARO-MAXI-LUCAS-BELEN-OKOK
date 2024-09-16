import React from 'react';
import { Table, Button } from 'react-bootstrap';

const DoctorTable = ({ doctors, handleShowModal, removeDoctor }) => {
    return (
        <>
            {doctors.length > 0 ? (
                <Table striped bordered hover responsive className="mt-3">
                    <thead className="bg-primary text-white">
                        <tr>
                            <th className="text-center">ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Speciality</th>
                            <th className="text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {doctors.map((doctor) => (
                            <tr key={doctor.id}>
                                <td className="text-center">{doctor.id}</td>
                                <td>{doctor.name}</td>
                                <td>{doctor.email}</td>
                                <td>{doctor.speciality}</td>
                                <td className="text-center">
                                    <Button
                                        variant="warning"
                                        size="sm"
                                        className="me-2"
                                        onClick={() => handleShowModal(doctor)}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => removeDoctor(doctor.id)}
                                    >
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            ) : (
                <p className="text-center mt-3">No doctors available. Please add a doctor.</p>
            )}
        </>
    );
};

export default DoctorTable;
