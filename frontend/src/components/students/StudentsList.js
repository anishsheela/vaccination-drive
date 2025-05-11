import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Button, Form, Pagination } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import studentService from '../../services/studentService';
import LoadingSpinner from '../common/LoadingSpinner';
import { FaPlus, FaEdit, FaTrash, FaEye, FaFileImport } from 'react-icons/fa';

const StudentsList = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchStudents();
    }, [currentPage, searchTerm]);

    const fetchStudents = async () => {
        try {
            const response = await studentService.getStudents(currentPage, 10, searchTerm);
            setStudents(response.students);
            setTotalPages(response.pages);
        } catch (error) {
            toast.error('Failed to load students');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(1);
        fetchStudents();
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this student?')) {
            try {
                await studentService.deleteStudent(id);
                toast.success('Student deleted successfully');
                fetchStudents();
            } catch (error) {
                toast.error('Failed to delete student');
            }
        }
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <Container fluid>
            <div className="page-header">
                <h1>Students</h1>
                <div className="table-actions">
                    <Button
                        variant="success"
                        onClick={() => navigate('/students/import')}
                    >
                        <FaFileImport /> Import CSV
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => navigate('/students/add')}
                    >
                        <FaPlus /> Add Student
                    </Button>
                </div>
            </div>

            <Card className="data-table">
                <Card.Body>
                    <Form onSubmit={handleSearch} className="mb-3">
                        <Form.Group className="d-flex">
                            <Form.Control
                                type="text"
                                placeholder="Search by name, ID, or class..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Button type="submit" variant="primary" className="ms-2">
                                Search
                            </Button>
                        </Form.Group>
                    </Form>

                    <Table responsive hover>
                        <thead>
                        <tr>
                            <th>Student ID</th>
                            <th>Name</th>
                            <th>Class</th>
                            <th>Section</th>
                            <th>Age</th>
                            <th>Gender</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {students.map((student) => (
                            <tr key={student.id}>
                                <td>{student.student_id}</td>
                                <td>{student.name}</td>
                                <td>{student.class_name}</td>
                                <td>{student.section}</td>
                                <td>{student.age}</td>
                                <td>{student.gender}</td>
                                <td>
                                    <div className="d-flex gap-2">
                                        <Button
                                            variant="outline-primary"
                                            size="sm"
                                            onClick={() => navigate(`/students/${student.id}`)}
                                        >
                                            <FaEye />
                                        </Button>
                                        <Button
                                            variant="outline-warning"
                                            size="sm"
                                            onClick={() => navigate(`/students/${student.id}/edit`)}
                                        >
                                            <FaEdit />
                                        </Button>
                                        <Button
                                            variant="outline-danger"
                                            size="sm"
                                            onClick={() => handleDelete(student.id)}
                                        >
                                            <FaTrash />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>

                    {students.length === 0 && (
                        <p className="text-center text-muted">No students found.</p>
                    )}

                    {totalPages > 1 && (
                        <Pagination className="justify-content-center">
                            <Pagination.First
                                onClick={() => setCurrentPage(1)}
                                disabled={currentPage === 1}
                            />
                            <Pagination.Prev
                                onClick={() => setCurrentPage(currentPage - 1)}
                                disabled={currentPage === 1}
                            />

                            {[...Array(totalPages)].map((_, index) => (
                                <Pagination.Item
                                    key={index + 1}
                                    active={index + 1 === currentPage}
                                    onClick={() => setCurrentPage(index + 1)}
                                >
                                    {index + 1}
                                </Pagination.Item>
                            ))}

                            <Pagination.Next
                                onClick={() => setCurrentPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            />
                            <Pagination.Last
                                onClick={() => setCurrentPage(totalPages)}
                                disabled={currentPage === totalPages}
                            />
                        </Pagination>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default StudentsList;