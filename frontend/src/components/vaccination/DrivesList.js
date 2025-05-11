import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Button, Badge, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import vaccinationService from '../../services/vaccinationService';
import LoadingSpinner from '../common/LoadingSpinner';
import { FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { formatDate } from '../../utils/formatters';
import { DRIVE_STATUS } from '../../utils/constants';

const DrivesList = () => {
    const [drives, setDrives] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [statusFilter, setStatusFilter] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchDrives();
    }, [currentPage, statusFilter]);

    const fetchDrives = async () => {
        try {
            const response = await vaccinationService.getDrives(currentPage, 10, statusFilter);
            setDrives(response.drives);
            setTotalPages(response.pages);
        } catch (error) {
            toast.error('Failed to load vaccination drives');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this vaccination drive?')) {
            try {
                await vaccinationService.deleteDrive(id);
                toast.success('Vaccination drive deleted successfully');
                fetchDrives();
            } catch (error) {
                const message = error.response?.data?.error || 'Failed to delete drive';
                toast.error(message);
            }
        }
    };

    const getStatusBadgeVariant = (status) => {
        switch (status) {
            case DRIVE_STATUS.SCHEDULED:
                return 'primary';
            case DRIVE_STATUS.COMPLETED:
                return 'success';
            case DRIVE_STATUS.CANCELLED:
                return 'danger';
            default:
                return 'secondary';
        }
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <Container fluid>
            <div className="page-header">
                <h1>Vaccination Drives</h1>
                <Button
                    variant="primary"
                    onClick={() => navigate('/drives/add')}
                >
                    <FaPlus /> Add Drive
                </Button>
            </div>

            <Card className="data-table">
                <Card.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Filter by Status</Form.Label>
                        <Form.Select
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value);
                                setCurrentPage(1);
                            }}
                        >
                            <option value="">All Status</option>
                            {Object.values(DRIVE_STATUS).map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <Table responsive hover>
                        <thead>
                        <tr>
                            <th>Vaccine Name</th>
                            <th>Date</th>
                            <th>Available/Total Doses</th>
                            <th>Applicable Classes</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {drives.map((drive) => (
                            <tr key={drive.id}>
                                <td>{drive.vaccine_name}</td>
                                <td>{formatDate(drive.date)}</td>
                                <td>{drive.available_doses - drive.used_doses}/{drive.available_doses}</td>
                                <td>{drive.applicable_classes.join(', ')}</td>
                                <td>
                                    <Badge bg={getStatusBadgeVariant(drive.status)}>
                                        {drive.status}
                                    </Badge>
                                </td>
                                <td>
                                    <div className="d-flex gap-2">
                                        <Button
                                            variant="outline-primary"
                                            size="sm"
                                            onClick={() => navigate(`/drives/${drive.id}`)}
                                        >
                                            <FaEye />
                                        </Button>
                                        <Button
                                            variant="outline-warning"
                                            size="sm"
                                            onClick={() => navigate(`/drives/${drive.id}/edit`)}
                                            disabled={drive.status === DRIVE_STATUS.COMPLETED}
                                        >
                                            <FaEdit />
                                        </Button>
                                        <Button
                                            variant="outline-danger"
                                            size="sm"
                                            onClick={() => handleDelete(drive.id)}
                                            disabled={drive.status === DRIVE_STATUS.COMPLETED}
                                        >
                                            <FaTrash />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>

                    {drives.length === 0 && (
                        <p className="text-center text-muted">No vaccination drives found.</p>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default DrivesList;