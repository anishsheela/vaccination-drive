import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Row, Col } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import vaccinationService from '../../services/vaccinationService';
import LoadingSpinner from '../common/LoadingSpinner';
import DatePicker from 'react-datepicker';
import { CLASSES } from '../../utils/constants';
import { formatDateForAPI } from '../../utils/formatters';
import moment from 'moment';

const DriveForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        vaccine_name: '',
        date: null,
        available_doses: '',
        applicable_classes: [],
    });

    useEffect(() => {
        if (id) {
            fetchDrive();
        }
    }, [id]);

    const fetchDrive = async () => {
        try {
            setLoading(true);
            const drive = await vaccinationService.getDrive(id);
            setFormData({
                vaccine_name: drive.vaccine_name,
                date: new Date(drive.date),
                available_doses: drive.available_doses,
                applicable_classes: drive.applicable_classes,
            });
        } catch (error) {
            toast.error('Failed to load drive details');
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

    const handleClassChange = (className) => {
        setFormData(prev => ({
            ...prev,
            applicable_classes: prev.applicable_classes.includes(className)
                ? prev.applicable_classes.filter(c => c !== className)
                : [...prev.applicable_classes, className],
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.applicable_classes.length === 0) {
            toast.error('Please select at least one applicable class');
            return;
        }

        try {
            setLoading(true);

            const dataToSubmit = {
                ...formData,
                date: formatDateForAPI(formData.date),
            };

            if (id) {
                await vaccinationService.updateDrive(id, dataToSubmit);
                toast.success('Drive updated successfully');
            } else {
                await vaccinationService.createDrive(dataToSubmit);
                toast.success('Drive created successfully');
            }

            navigate('/drives');
        } catch (error) {
            const message = error.response?.data?.error || 'Failed to save drive';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    if (loading && id) {
        return <LoadingSpinner />;
    }

    const minDate = moment().add(15, 'days').toDate();

    return (
        <Container fluid>
            <div className="page-header">
                <h1>{id ? 'Edit Vaccination Drive' : 'Add New Vaccination Drive'}</h1>
            </div>

            <Card className="form-container">
                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Vaccine Name *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="vaccine_name"
                                        value={formData.vaccine_name}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Date *</Form.Label>
                                    <DatePicker
                                        selected={formData.date}
                                        onChange={(date) => setFormData(prev => ({ ...prev, date }))}
                                        minDate={minDate}
                                        dateFormat="dd/MM/yyyy"
                                        className="form-control"
                                        required
                                    />
                                    <Form.Text className="text-muted">
                                        Drive must be scheduled at least 15 days in advance
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Available Doses *</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="available_doses"
                                        value={formData.available_doses}
                                        onChange={handleChange}
                                        min="1"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3">
                            <Form.Label>Applicable Classes *</Form.Label>
                            <div className="d-flex flex-wrap gap-2">
                                {CLASSES.map(className => (
                                    <Form.Check
                                        key={className}
                                        type="checkbox"
                                        id={`class-${className}`}
                                        label={`Class ${className}`}
                                        checked={formData.applicable_classes.includes(className)}
                                        onChange={() => handleClassChange(className)}
                                    />
                                ))}
                            </div>
                        </Form.Group>

                        <div className="d-flex justify-content-end gap-2">
                            <Button
                                variant="secondary"
                                onClick={() => navigate('/drives')}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="primary"
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? 'Saving...' : (id ? 'Update Drive' : 'Create Drive')}
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default DriveForm;