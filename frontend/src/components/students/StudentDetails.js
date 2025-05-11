import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Table, Badge, Row, Col } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import studentService from '../../services/studentService';
import vaccinationService from '../../services/vaccinationService';
import LoadingSpinner from '../common/LoadingSpinner';
import { FaEdit, FaArrowLeft } from 'react-icons/fa';
import { formatDate } from '../../utils/formatters';

const StudentDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [student, setStudent] = useState(null);
    const [vaccinations, setVaccinations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStudentDetails();
    }, [id]);

    const fetchStudentDetails = async () => {
        try {
            const [studentData, vaccinationData] = await Promise.all([
                studentService.getStudent(id),
                vaccinationService.getVaccinationRecords(id),
            ]);

            setStudent(studentData);
            setVaccinations(vaccinationData);
        } catch (error) {
            toast.error('Failed to load student details');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    if (!student) {
        return (
            <Container>
                <p>Student not found</p>
            </Container>
        );
    }

    return (
        <Container fluid>
            <div className="page-header">
                <h1>Student Details</h1>
                <div className="table-actions">
                    <Button
                        variant="secondary"
                        onClick={() => navigate('/students')}
                    >
                        <FaArrowLeft /> Back
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => navigate(`/students/${id}/edit`)}
                    >
                        <FaEdit /> Edit
                    </Button>
                </div>
            </div>

            <Row>
                <Col md={6}>
                    <Card className="mb-4">
                        <Card.Header>
                            <h5 className="mb-0">Personal Information</h5>
                        </Card.Header>
                        <Card.Body>
                            <Table>
                                <tbody>
                                <tr>
                                    <td><strong>Student ID:</strong></td>
                                    <td>{student.student_id}</td>
                                </tr>
                                <tr>
                                    <td><strong>Name:</strong></td>
                                    <td>{student.name}</td>
                                </tr>
                                <tr>
                                    <td><strong>Class:</strong></td>
                                    <td>{student.class_name}</td>
                                </tr>
                                <tr>
                                    <td><strong>Section:</strong></td>
                                    <td>{student.section}</td>
                                </tr>
                                <tr>
                                    <td><strong>Age:</strong></td>
                                    <td>{student.age || 'N/A'}</td>
                                </tr>
                                <tr>
                                    <td><strong>Gender:</strong></td>
                                    <td>{student.gender || 'N/A'}</td>
                                </tr>
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={6}>
                    <Card className="mb-4">
                        <Card.Header>
                            <h5 className="mb-0">Vaccination History</h5>
                        </Card.Header>
                        <Card.Body>
                            {vaccinations.length === 0 ? (
                                <p className="text-muted text-center">No vaccination records found.</p>
                            ) : (
                                <Table responsive>
                                    <thead>
                                    <tr>
                                        <th>Vaccine Name</th>
                                        <th>Date</th>
                                        <th>Status</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {vaccinations.map((record) => (
                                        <tr key={record.id}>
                                            <td>{record.vaccine_name}</td>
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
                </Col>
            </Row>
        </Container>
    );
};

export default StudentDetails;