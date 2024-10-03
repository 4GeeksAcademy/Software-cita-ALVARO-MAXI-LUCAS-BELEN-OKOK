import React from 'react';
import { Table, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';

const DateTable = ({ dates, handleShowModal, removeDate }) => {
    return (
        <div className="table-responsive">
            <Table bordered hover striped className="table-sm">
                <thead className="bg-primary text-white">
                    <tr className="text-center">
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
                    {dates.length > 0 ? (
                        dates.map((date) => (
                            <tr key={date.id} className="text-center align-middle">
                                <td>{date.id}</td>
                                <td>{date.speciality || "N/A"}</td>
                                <td>{date.doctor.name || "Unknown"}</td>
                                <td>{new Date(date.datetime).toLocaleString()}</td>
                                <td>{date.reason_for_appointment}</td>
                                <td>{date.date_type}</td>
                                <td>{date.user_id}</td>
                                <td>
                                    {/* Action Buttons with Tooltips */}
                                    <OverlayTrigger
                                        placement="top"
                                        overlay={<Tooltip id={`tooltip-edit-${date.id}`}>Edit</Tooltip>}
                                    >
                                        <Button
                                            variant="warning"
                                            size="sm"
                                            className="me-2"
                                            onClick={() => handleShowModal(date)}
                                        >
                                            <FaEdit />
                                        </Button>
                                    </OverlayTrigger>
                                    <OverlayTrigger
                                        placement="top"
                                        overlay={<Tooltip id={`tooltip-delete-${date.id}`}>Delete</Tooltip>}
                                    >
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => removeDate(date.id)}
                                        >
                                            <FaTrashAlt />
                                        </Button>
                                    </OverlayTrigger>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8" className="text-center">No appointments available</td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </div>
    );
};

export default DateTable;
