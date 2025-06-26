import apiClient from './apiClient'; // Usa nosso cliente autenticado

export const getUsersRequest = () => {
    return apiClient.get('/admin/users');
};

export const updateUserStatusRequest = (userId, status) => {
    return apiClient.patch(`/admin/users/${userId}/status`, { status });
};