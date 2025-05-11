import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Table, Badge, Row, Col } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import vaccinationService from '../../services/vaccinationService';
import LoadingSpinner from '../common/LoadingSpinner';
import { FaEdit, FaArrowLeft } from 'react-icons/fa';
import { formatDate } from '../../utils/formatters';

const DriveDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [drive, setDrive] = useState(null);
    const [vaccinations, setVaccinations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDriveDetails();
    }, [id]);

    const fetchDriveDetails = async () => {
        try {
            const [driveData, vaccinationData] = await Promise.all([
                vaccinationService.getDrive(id),
                vaccinationService.getVaccinationRecords(null, id),
            ]);

            setDrive(driveData);
            setVaccinations(vaccinationData);
        } catch (error) {
            toast.error('Failed to load drive details');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    if (!drive) {
        return (
            <Container>
                <p>Drive not found</p>
            </Container>
        );
    }

    return (
        <Container fluid>
            <div className="page-header">
                <h1>Vaccination Drive Details</h1>
                <div className="table-actions">
                    <Button
                        variant="secondary"
                        onClick={() => navigate('/drives')}
                    >
                        <FaArrowLeft /> Back
                    </Button>
                    {drive.status !== 'Completed' && (
                        <Button
                            variant="primary"
                            onClick={() => navigate(`/drives/${id}/edit`)}
                        >
                            <FaEdit /> Edit
                        </Button>
                    )}
                </div>
            </div>

            <Row>
                <Col md={6}>
                    <Card className="mb-4">
                        <Card.Header>
                            <h5 className="mb-0">Drive Information</h5>
                        </Card.Header>
                        <Card.Body>
                            <Table>
                                <tbody>
                                <tr>
                                    <td><strong>Vaccine Name:</strong></td>
                                    <td>{drive.vaccine_name}</td>
                                </tr>
                                <tr>
                                    <td><strong>Date:</strong></td>
                                    <td>{formatDate(drive.date)}</td>
                                </tr>
                                <tr>
                                    <td><strong>Total Doses:</strong></td>
                                    <td>{drive.available_doses}</td>
                                </tr>
                                <tr>
                                    <td><strong>Used Doses:</strong></td>
                                    <td>{drive.used_doses}</td>
                                </tr>
                                <tr>
                                    <td><strong>Available Doses:</strong></td>
                                    <td>{drive.available_doses - drive.used_doses}</td>
                                </tr>
                                <tr>
                                    <td><strong>Applicable Classes:</strong></td>
                                    <td>{drive.applicable_classes.join(', ')}</td>
                                </tr>
                                <tr>
                                    <td><strong>Status:</strong></td>
                                    <td>
                                        <Badge bg={
                                            drive.status === 'Scheduled' ? 'primary' :
                                                drive.status === 'Completed' ? 'success' : 'danger'
                                        }>
                                            {drive.status}
                                        </Badge>
                                    </td>
                                </tr>
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={6}>
                    <Card className="mb-4">
                        <Card.Header>
                            <h5 className="mb-0">Statistics</h5>
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                <Col sm={6}>
                                    <div className="text-center">
                                        <h3>{drive.used_doses}</h3>
                                        <p className="text-muted">Students Vaccinated</p>
                                    </div>
                                </Col>
                                <Col sm={6}>
                                    <div className="text-center">
                                        <h3>{((drive.used_doses / drive.available_doses) * 100).toFixed(1)}%</h3>
                                        <p className="text-muted">Completion Rate</p>
                                    </div>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Card>
                <Card.Header>
                    <h5 className="mb-0">Vaccinated Students</h5>
                </Card.Header>
                <Card.Body>
                    {vaccinations.length === 0 ? (
                        <p className="text-muted text-center">No students vaccinated yet.</p>
                    ) : (
                        <Table responsive>
                            <thead>
                            <tr>
                                <th>Student ID</th>
                                <th>Student Name</th>
                                <th>Date</th>
                                <th>Status</th>
                            </tr>
                            </thead>
                            <tbody>
                            {vaccinations.map((record) => (
                                <tr key={record.id}>
                                    <td>{record.student_id}</td>
                                    <td>{record.student_name}</td>
                                    <td>{formatDate(record.date)}</td>
                                    <td>
                                        <Badge bg="success">{record.status}</Badge>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default DriveDetails;