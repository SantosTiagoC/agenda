import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const ProtectedRoute = ({ children }) => {
    const { token } = useAuthStore();

    // Se não houver token, redireciona para a página de login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Se houver token, renderiza o componente filho (a página protegida)
    return children;
};

export default ProtectedRoute;