import axios from 'axios';

// Cria uma instância do Axios com a URL base do nosso backend
const apiClient = axios.create({
    baseURL: 'http://localhost:3001/api',
});

export const loginRequest = (email, password) => {
    return apiClient.post('/auth/login', { email, password });
};

export const registerRequest = (name, email, password) => {
    return apiClient.post('/auth/register', { name, email, password });
};