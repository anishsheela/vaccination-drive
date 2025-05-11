import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { toast } from 'react-toastify';
import dashboardService from '../../services/dashboardService';
import StatCard from './StatCard';
import UpcomingDrives from './UpcomingDrives';
import LoadingSpinner from '../common/LoadingSpinner';
import {
    FaUsers,
    FaSyringe,
    FaCheckCircle,
    FaCalendarAlt
} from 'react-icons/fa';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [upcomingDrives, setUpcomingDrives] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [statsData, drivesData] = await Promise.all([
                dashboardService.getStats(),
                dashboardService.getUpcomingDrives(),
            ]);

            setStats(statsData);
            setUpcomingDrives(drivesData);
        } catch (error) {
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    const vaccinationChartData = {
        labels: ['Vaccinated', 'Not Vaccinated'],
        datasets: [
            {
                data: [
                    stats?.vaccinated_students || 0,
                    (stats?.total_students || 0) - (stats?.vaccinated_students || 0),
                ],
                backgroundColor: ['#28a745', '#dc3545'],
                hoverBackgroundColor: ['#218838', '#c82333'],
            },
        ],
    };

    const drivesChartData = {
        labels: ['Completed', 'Scheduled'],
        datasets: [
            {
                label: 'Vaccination Drives',
                data: [
                    stats?.completed_drives || 0,
                    (stats?.total_drives || 0) - (stats?.completed_drives || 0),
                ],
                backgroundColor: ['#17a2b8', '#ffc107'],
            },
        ],
    };

    return (
        <Container fluid>
            <div className="page-header">
                <h1>Dashboard</h1>
            </div>

            <div className="dashboard-grid">
                <StatCard
                    icon={FaUsers}
                    title="Total Students"
                    value={stats?.total_students || 0}
                    color="primary"
                />
                <StatCard
                    icon={FaCheckCircle}
                    title="Vaccinated Students"
                    value={stats?.vaccinated_students || 0}
                    color="success"
                />
                <StatCard
                    icon={FaSyringe}
                    title="Vaccination Rate"
                    value={`${stats?.vaccination_percentage || 0}%`}
                    color="info"
                />
                <StatCard
                    icon={FaCalendarAlt}
                    title="Total Drives"
                    value={stats?.total_drives || 0}
                    color="warning"
                />
            </div>

            <Row className="mt-4">
                <Col md={6}>
                    <Card>
                        <Card.Body>
                            <Card.Title>Vaccination Status</Card.Title>
                            <div style={{ height: '300px' }}>
                                <Doughnut
                                    data={vaccinationChartData}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: {
                                                position: 'bottom',
                                            },
                                        },
                                    }}
                                />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card>
                        <Card.Body>
                            <Card.Title>Drive Status</Card.Title>
                            <div style={{ height: '300px' }}>
                                <Bar
                                    data={drivesChartData}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: {
                                                display: false,
                                            },
                                        },
                                        scales: {
                                            y: {
                                                beginAtZero: true,
                                                ticks: {
                                                    stepSize: 1,
                                                },
                                            },
                                        },
                                    }}
                                />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="mt-4">
                <Col>
                    <UpcomingDrives drives={upcomingDrives} />
                </Col>
            </Row>
        </Container>
    );
};

export default Dashboard;