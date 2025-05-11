import React from 'react';
import { Card } from 'react-bootstrap';

const StatCard = ({ icon: Icon, title, value, color = 'primary' }) => {
    return (
        <Card className="stat-card">
            <Card.Body>
                <div className={`text-${color}`}>
                    <Icon className="stat-icon" />
                </div>
                <div className="stat-value">{value}</div>
                <div className="stat-label">{title}</div>
            </Card.Body>
        </Card>
    );
};

export default StatCard;