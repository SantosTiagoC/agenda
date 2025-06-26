import apiClient from './apiClient';

// Esta função você já tem
export const getEventsRequest = () => {
    return apiClient.get('/events');
};

// Adicione esta nova função para criar um evento
export const createEventRequest = (eventData) => {
    // O backend espera 'start_time' e 'end_time'
    const payload = {
        title: eventData.title,
        description: eventData.description,
        start_time: eventData.start,
        end_time: eventData.end,
        color_hex: eventData.color, // Adicionaremos a cor no futuro
    };
    return apiClient.post('/events', payload);
};