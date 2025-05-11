import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import LoadingSpinner from './components/common/LoadingSpinner';

const PrivateRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <LoadingSpinner />;
    }

    return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;