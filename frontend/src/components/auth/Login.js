import React, { useState } from 'react';
import { Form, Button, Alert, Card } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaLock, FaUser } from 'react-icons/fa';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setError('');
            setLoading(true);
            await login(username, password);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <Card className="login-form">
                <Card.Body>
                    <h2 className="login-title">School Vaccination Portal</h2>
                    <p className="text-center text-muted mb-4">Please login to continue</p>

                    {error && <Alert variant="danger">{error}</Alert>}

                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>
                                <FaUser className="me-2" />
                                Username
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>
                                <FaLock className="me-2" />
                                Password
                            </Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Button
                            variant="primary"
                            type="submit"
                            className="w-100"
                            disabled={loading}
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </Button>
                    </Form>

                    <div className="mt-3 text-center text-muted">
                        <small>Default credentials: admin / admin123</small>
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
};

export default Login;