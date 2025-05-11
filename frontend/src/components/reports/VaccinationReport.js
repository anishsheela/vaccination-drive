import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Table, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import reportService from '../../services/reportService';
import LoadingSpinner from '../common/LoadingSpinner';
import DatePicker from 'react-datepicker';
import { formatDate, formatDateForAPI } from '../../utils/formatters';
import { FaDownload, FaFilter } from 'react-icons/fa';

const VaccinationReport = () => {
    const [loading, setLoading] = useState(false);
    const [report, setReport] = useState(null);
    const [vaccines, setVaccines] = useState([]);
    const [classes, setClasses] = useState([]);
    const [filters, setFilters] = useState({
        vaccine_name: '',
        class_name: '',
        start_date: null,
        end_date: null,
    });

    useEffect(() => {
        fetchFilterOptions();
    }, []);

    const fetchFilterOptions = async () => {
        try {
            const [vaccinesData, classesData] = await Promise.all([
                reportService.getVaccinesList(),
                reportService.getClassesList(),
            ]);

            setVaccines(vaccinesData);
            setClasses(classesData);
        } catch (error) {
            toast.error('Failed to load filter options');
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleDateChange = (date, field) => {
        setFilters(prev => ({
            ...prev,
            [field]: date,
        }));
    };

    const generateReport = async () => {
        try {
            setLoading(true);

            const filterParams = {
                ...filters,
                start_date: filters.start_date ? formatDateForAPI(filters.start_date) : undefined,
                end_date: filters.end_date ? formatDateForAPI(filters.end_date) : undefined,
            };

            // Remove undefined values
            Object.keys(filterParams).forEach(key =>
                filterParams[key] === undefined && delete filterParams[key]
            );

            const response = await reportService.getVaccinationReport(filterParams);
            setReport(response);
        } catch (error) {
            toast.error('Failed to generate report');
        } finally {
            setLoading(false);
        }
    };

    const downloadReport = async () => {
        try {
            const filterParams = {
                ...filters,
                start_date: filters.start_date ? formatDateForAPI(filters.start_date) : undefined,
                end_date: filters.end_date ? formatDateForAPI(filters.end_date) : undefined,
            };

            // Remove undefined values
            Object.keys(filterParams).forEach(key =>
                filterParams[key] === undefined && delete filterParams[key]
            );

            await reportService.downloadVaccinationReport(filterParams);
            toast.success('Report downloaded successfully');
        } catch (error) {
            toast.error('Failed to download report');
        }
    };

    return (
        <Container fluid>
            <div className="page-header">
                <h1>Vaccination Report</h1>
            </div>

            <Card className="mb-4">
                <Card.Header>
                    <h5 className="mb-0">Report Filters</h5>
                </Card.Header>
                <Card.Body>
                    <Row>
                        <Col md={3}>
                            <Form.Group className="mb-3">
                                <Form.Label>Vaccine Name</Form.Label>
                                <Form.Select
                                    name="vaccine_name"
                                    value={filters.vaccine_name}
                                    onChange={handleFilterChange}
                                >
                                    <option value="">All Vaccines</option>
                                    {vaccines.map(vaccine => (
                                        <option key={vaccine} value={vaccine}>{vaccine}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={3}>
                            <Form.Group className="mb-3">
                                <Form.Label>Class</Form.Label>
                                <Form.Select
                                    name="class_name"
                                    value={filters.class_name}
                                    onChange={handleFilterChange}
                                >
                                    <option value="">All Classes</option>
                                    {classes.map(className => (
                                        <option key={className} value={className}>{className}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={3}>
                            <Form.Group className="mb-3">
                                <Form.Label>Start Date</Form.Label>
                                <DatePicker
                                    selected={filters.start_date}
                                    onChange={(date) => handleDateChange(date, 'start_date')}
                                    dateFormat="dd/MM/yyyy"
                                    className="form-control"
                                    placeholderText="Select start date"
                                />
                            </Form.Group>
                        </Col>
                        <Col md={3}>
                            <Form.Group className="mb-3">
                                <Form.Label>End Date</Form.Label>
                                <DatePicker
                                    selected={filters.end_date}
                                    onChange={(date) => handleDateChange(date, 'end_date')}
                                    dateFormat="dd/MM/yyyy"
                                    className="form-control"
                                    placeholderText="Select end date"
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <div className="d-flex justify-content-end gap-2">
                        <Button
                            variant="primary"
                            onClick={generateReport}
                            disabled={loading}
                        >
                            <FaFilter /> {loading ? 'Generating...' : 'Generate Report'}
                        </Button>
                    </div>
                </Card.Body>
            </Card>

            {report && (
                <Card>
                    <Card.Header className="d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">Report Results ({report.count} records)</h5>
                        <Button
                            variant="success"
                            size="sm"
                            onClick={downloadReport}
                            disabled={report.count === 0}
                        >
                            <FaDownload /> Download CSV
                        </Button>
                    </Card.Header>
                    <Card.Body>
                        {report.records.length === 0 ? (
                            <p className="text-center text-muted">No records found matching the filters.</p>
                        ) : (
                            <Table responsive hover>
                                <thead>
                                <tr>
                                    <th>Student ID</th>
                                    <th>Student Name</th>
                                    <th>Class</th>
                                    <th>Section</th>
                                    <th>Vaccine Name</th>
                                    <th>Vaccination Date</th>
                                    <th>Status</th>
                                </tr>
                                </thead>
                                <tbody>
                                {report.records.map((record) => (
                                    <tr key={record.record_id}>
                                        <td>{record.student_id}</td>
                                        <td>{record.student_name}</td>
                                        <td>{record.class_name}</td>
                                        <td>{record.section}</td>
                                        <td>{record.vaccine_name}</td>
                                        <td>{formatDate(record.vaccination_date)}</td>
                                        <td>{record.status}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </Table>
                        )}
                    </Card.Body>
                </Card>
            )}
        </Container>
    );
};

export default VaccinationReport;