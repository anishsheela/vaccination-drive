import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { toast } from 'react-toastify';
import vaccinationService from '../../services/vaccinationService';
import studentService from '../../services/studentService';
import LoadingSpinner from '../common/LoadingSpinner';
import { formatDate } from '../../utils/formatters';

const RecordVaccination = () => {
    const [loading, setLoading] = useState(false);
    const [students, setStudents] = useState([]);
    const [drives, setDrives] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState('');
    const [selectedDrive, setSelectedDrive] = useState('');
    const [studentDetails, setStudentDetails] = useState(null);
    const [driveDetails, setDriveDetails] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [searching, setSearching] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchTerm.length >= 2) {
                searchStudents();
            } else if (searchTerm.length === 0) {
                setStudents([]);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    useEffect(() => {
        if (selectedStudent) {
            const student = students.find(s => s.id.toString() === selectedStudent);
            setStudentDetails(student);
        } else {
            setStudentDetails(null);
        }
    }, [selectedStudent, students]);

    useEffect(() => {
        if (selectedDrive) {
            const drive = drives.find(d => d.id.toString() === selectedDrive);
            setDriveDetails(drive);
        } else {
            setDriveDetails(null);
        }
    }, [selectedDrive, drives]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const drivesResponse = await vaccinationService.getDrives(1, 100, 'Scheduled');
            console.log('Drives response:', drivesResponse);
            setDrives(drivesResponse.drives || []);
        } catch (error) {
            console.error('Error fetching drives:', error);
            toast.error('Failed to load vaccination drives');
        } finally {
            setLoading(false);
        }
    };

    const searchStudents = async () => {
        try {
            setSearching(true);
            const response = await studentService.getStudents(1, 20, searchTerm);
            console.log('Students response:', response);
            setStudents(response.students || []);
        } catch (error) {
            console.error('Error searching students:', error);
            toast.error('Failed to search students');
        } finally {
            setSearching(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            await vaccinationService.recordVaccination({
                student_id: parseInt(selectedStudent),
                drive_id: parseInt(selectedDrive),
            });

            toast.success('Vaccination recorded successfully');

            // Reset form
            setSelectedStudent('');
            setSelectedDrive('');
            setSearchTerm('');
            setStudentDetails(null);
            setDriveDetails(null);
            setStudents([]);

            // Refresh drives to update available doses
            fetchData();
        } catch (error) {
            const message = error.response?.data?.error || 'Failed to record vaccination';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const isEligible = () => {
        if (!studentDetails || !driveDetails) return false;
        return driveDetails.applicable_classes.includes(studentDetails.class_name);
    };

    // Check if a drive has available doses
    const hasAvailableDoses = (drive) => {
        if (!drive) return false;
        return (drive.available_doses - drive.used_doses) > 0;
    };

    if (loading && drives.length === 0) {
        return <LoadingSpinner />;
    }

    return (
        <Container fluid>
            <div className="page-header">
                <h1>Record Vaccination</h1>
            </div>

            <Card className="form-container">
                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Search Student *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Search by name or ID (minimum 2 characters)..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    {searching && <div className="text-muted mt-1">Searching...</div>}
                                    {searchTerm.length > 0 && searchTerm.length < 2 && (
                                        <div className="text-muted mt-1">Type at least 2 characters to search</div>
                                    )}
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Select Student *</Form.Label>
                                    <Form.Select
                                        value={selectedStudent}
                                        onChange={(e) => setSelectedStudent(e.target.value)}
                                        required
                                        disabled={students.length === 0}
                                    >
                                        <option value="">
                                            {students.length === 0
                                                ? "Search for a student first"
                                                : "-- Select Student --"}
                                        </option>
                                        {students.map(student => (
                                            <option key={student.id} value={student.id}>
                                                {student.student_id} - {student.name} (Class {student.class_name}-{student.section})
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>

                                {studentDetails && (
                                    <Alert variant="info">
                                        <strong>Student Details:</strong><br />
                                        Name: {studentDetails.name}<br />
                                        Class: {studentDetails.class_name} Section: {studentDetails.section}<br />
                                        Age: {studentDetails.age || 'N/A'}
                                    </Alert>
                                )}
                            </Col>

                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Select Vaccination Drive *</Form.Label>
                                    <Form.Select
                                        value={selectedDrive}
                                        onChange={(e) => setSelectedDrive(e.target.value)}
                                        required
                                        disabled={drives.length === 0}
                                    >
                                        <option value="">
                                            {drives.length === 0
                                                ? "No vaccination drives available"
                                                : "-- Select Drive --"}
                                        </option>
                                        {drives.map(drive => (
                                            <option key={drive.id} value={drive.id}>
                                                {drive.vaccine_name} - {formatDate(drive.date)}
                                                ({drive.available_doses - drive.used_doses} doses available)
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>

                                {driveDetails && (
                                    <Alert variant="info">
                                        <strong>Drive Details:</strong><br />
                                        Vaccine: {driveDetails.vaccine_name}<br />
                                        Date: {formatDate(driveDetails.date)}<br />
                                        Available Doses: {driveDetails.available_doses - driveDetails.used_doses}<br />
                                        Applicable Classes: {driveDetails.applicable_classes.join(', ')}
                                    </Alert>
                                )}
                            </Col>
                        </Row>

                        {selectedStudent && selectedDrive && studentDetails && driveDetails && !isEligible() && (
                            <Alert variant="warning">
                                This student's class ({studentDetails.class_name}) is not eligible for this vaccination drive.
                                Eligible classes: {driveDetails.applicable_classes.join(', ')}
                            </Alert>
                        )}

                        {selectedStudent && selectedDrive && driveDetails && !hasAvailableDoses(driveDetails) && (
                            <Alert variant="danger">
                                No doses available for this vaccination drive.
                            </Alert>
                        )}

                        {drives.length === 0 && (
                            <Alert variant="info">
                                No scheduled vaccination drives available. Please create a vaccination drive first.
                            </Alert>
                        )}

                        <div className="d-flex justify-content-end gap-2">
                            <Button
                                variant="primary"
                                type="submit"
                                disabled={
                                    loading ||
                                    !selectedStudent ||
                                    !selectedDrive ||
                                    !studentDetails ||
                                    !driveDetails ||
                                    !isEligible() ||
                                    !hasAvailableDoses(driveDetails)
                                }
                            >
                                {loading ? 'Recording...' : 'Record Vaccination'}
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default RecordVaccination;