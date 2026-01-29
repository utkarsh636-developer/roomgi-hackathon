import React from 'react';
import { Navigate } from 'react-router-dom';
import authService from '../services/authService';

const AdminRoute = ({ children }) => {
    const user = authService.getCurrentUser();

    if (!user) {
        return <Navigate to="/admin/login" replace />;
    }

    if (user.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default AdminRoute;
