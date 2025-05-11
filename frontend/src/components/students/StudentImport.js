import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import studentService from '../../services/studentService';
import { FaFileUpload, FaDownload } from 'react-icons/fa';

const StudentImport = () => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setResult(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!file) {
            toast.error('Please select a file');
            return;
        }

        try {
            setLoading(true);
            const response = await studentService.bulkImport(file);
            setResult(response);

            if (response.success_count > 0) {
                toast.success(`Successfully imported ${response.success_count} students`);
            }

            if (response.error_count > 0) {
                toast.warning(`Failed to import ${response.error_count} students`);
            }
        } catch (error) {
            toast.error('Failed to import students');
        } finally {
            setLoading(false);
        }
    };

    const downloadTemplate = () => {
        const csvContent = `student_id,name,class_name,section,age,gender
ST001,John Doe,5,A,10,Male
ST002,Jane Smith,5,B,10,Female
ST003,Robert Johnson,6,A,11,Male`;

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'student_import_template.csv');
        document.body.appendChild(link);
        link.click();
        link.remove();
    };

    return (
        <Container fluid>
            <div className="page-header">
                <h1>Import Students</h1>
            </div>

            <Card className="form-container">
                <Card.Body>
                    <Alert variant="info">
                        <p className="mb-0">
                            <strong>CSV Format:</strong> The CSV file should contain the following columns:
                            student_id, name, class_name, section, age (optional), gender (optional)
                        </p>
                    </Alert>

                    <div className="mb-3">
                        <Button
                            variant="outline-primary"
                            onClick={downloadTemplate}
                        >
                            <FaDownload /> Download Template
                        </Button>
                    </div>

                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Select CSV File</Form.Label>
                            <Form.Control
                                type="file"
                                accept=".csv"
                                onChange={handleFileChange}
                                required
                            />
                        </Form.Group>

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
                                disabled={loading || !file}
                            >
                                <FaFileUpload /> {loading ? 'Importing...' : 'Import Students'}
                            </Button>
                        </div>
                    </Form>

                    {result && (
                        <div className="mt-4">
                            <h5>Import Results</h5>
                            <Alert variant={result.error_count > 0 ? 'warning' : 'success'}>
                                <p>Successfully imported: {result.success_count} students</p>
                                <p>Failed to import: {result.error_count} students</p>
                            </Alert>

                            {result.errors && result.errors.length > 0 && (
                                <Card>
                                    <Card.Header>
                                        <h6 className="mb-0">Import Errors</h6>
                                    </Card.Header>
                                    <Card.Body>
                                        <Table responsive>
                                            <thead>
                                            <tr>
                                                <th>Error Description</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {result.errors.map((error, index) => (
                                                <tr key={index}>
                                                    <td>{error}</td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </Table>
                                    </Card.Body>
                                </Card>
                            )}
                        </div>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default StudentImport;