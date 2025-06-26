import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const AdminProtectedRoute = ({ children }) => {
    const { token, user } = useAuthStore.getState(); // Usar getState aqui para garantir o valor mais atual

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (user?.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default AdminProtectedRoute;