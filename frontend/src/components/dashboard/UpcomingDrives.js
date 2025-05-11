import React from 'react';
import { Card, Table, Badge, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../../utils/formatters';
import { FaEye } from 'react-icons/fa';

const UpcomingDrives = ({ drives }) => {
    const navigate = useNavigate();

    return (
        <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Upcoming Vaccination Drives</h5>
                <Button
                    variant="primary"
                    size="sm"
                    onClick={() => navigate('/drives')}
                >
                    View All
                </Button>
            </Card.Header>
            <Card.Body>
                {drives.length === 0 ? (
                    <p className="text-muted text-center">No upcoming drives scheduled.</p>
                ) : (
                    <Table responsive hover>
                        <thead>
                        <tr>
                            <th>Vaccine Name</th>
                            <th>Date</th>
                            <th>Available Doses</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {drives.map((drive) => (
                            <tr key={drive.id}>
                                <td>{drive.vaccine_name}</td>
                                <td>{formatDate(drive.date)}</td>
                                <td>{drive.available_doses - drive.used_doses}</td>
                                <td>
                                    <Badge bg="primary">{drive.status}</Badge>
                                </td>
                                <td>
                                    <Button
                                        variant="outline-primary"
                                        size="sm"
                                        onClick={() => navigate(`/drives/${drive.id}`)}
                                    >
                                        <FaEye /> View
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                )}
            </Card.Body>
        </Card>
    );
};

export default UpcomingDrives;