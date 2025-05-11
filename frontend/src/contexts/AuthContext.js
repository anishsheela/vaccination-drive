import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');

            if (token && storedUser) {
                try {
                    setUser(JSON.parse(storedUser));
                    const currentUser = await authService.getCurrentUser();
                    setUser(currentUser);
                } catch (error) {
                    console.error('Failed to fetch current user:', error);
                    logout();
                }
            }

            setLoading(false);
        };

        initAuth();
    }, []);

    const login = async (username, password) => {
        try {
            const response = await authService.login(username, password);
            localStorage.setItem('token', response.access_token);
            localStorage.setItem('user', JSON.stringify(response.user));
            setUser(response.user);
            toast.success('Login successful!');
            navigate('/');
            return response.user;
        } catch (error) {
            const message = error.response?.data?.error || 'Login failed';
            toast.error(message);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/login');
        toast.info('Logged out successfully');
    };

    const value = {
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};