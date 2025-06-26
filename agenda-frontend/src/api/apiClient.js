import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const apiClient = axios.create({
    baseURL: 'http://localhost:3001/api',
});

// Interceptor que adiciona o token de autenticação em cada requisição
apiClient.interceptors.request.use(
    (config) => {
        const { token } = useAuthStore.getState();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default apiClient;