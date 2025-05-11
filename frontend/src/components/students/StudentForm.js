import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Row, Col } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import studentService from '../../services/studentService';
import LoadingSpinner from '../common/LoadingSpinner';
import { CLASSES, SECTIONS, GENDERS } from '../../utils/constants';

const StudentForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        student_id: '',
        name: '',
        class_name: '',
        section: '',
        age: '',
        gender: '',
    });

    useEffect(() => {
        if (id) {
            fetchStudent();
        }
    }, [id]);

    const fetchStudent = async () => {
        try {
            setLoading(true);
            const student = await studentService.getStudent(id);
            setFormData({
                student_id: student.student_id,
                name: student.name,
                class_name: student.class_name,
                section: student.section,
                age: student.age || '',
                gender: student.gender || '',
            });
        } catch (error) {
            toast.error('Failed to load student details');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            if (id) {
                await studentService.updateStudent(id, formData);
                toast.success('Student updated successfully');
            } else {
                await studentService.createStudent(formData);
                toast.success('Student created successfully');
            }

            navigate('/students');
        } catch (error) {
            const message = error.response?.data?.error || 'Failed to save student';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    if (loading && id) {
        return <LoadingSpinner />;
    }

    return (
        <Container fluid>
            <div className="page-header">
                <h1>{id ? 'Edit Student' : 'Add New Student'}</h1>
            </div>

            <Card className="form-container">
                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Student ID *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="student_id"
                                        value={formData.student_id}
                                        onChange={handleChange}
                                        required
                                        disabled={!!id}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Name *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={3}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Class *</Form.Label>
                                    <Form.Select
                                        name="class_name"
                                        value={formData.class_name}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select Class</option>
                                        {CLASSES.map(cls => (
                                            <option key={cls} value={cls}>{cls}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Section *</Form.Label>
                                    <Form.Select
                                        name="section"
                                        value={formData.section}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select Section</option>
                                        {SECTIONS.map(section => (
                                            <option key={section} value={section}>{section}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Age</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="age"
                                        value={formData.age}
                                        onChange={handleChange}
                                        min="4"
                                        max="20"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Gender</Form.Label>
                                    <Form.Select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                    >
                                        <option value="">Select Gender</option>
                                        {GENDERS.map(gender => (
                                            <option key={gender} value={gender}>{gender}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>

                        <div className="d-flex justify-content-end gap-2">
                            <Button
                                variant="secondary"
                                onClick={() => navigate('/students')}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="primary"
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? 'Saving...' : (id ? 'Update Student' : 'Create Student')}
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default StudentForm;