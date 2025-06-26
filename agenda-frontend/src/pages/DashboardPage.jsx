import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { getEventsRequest, createEventRequest } from '../api/events';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { format } from 'date-fns';
import EventModal from '../components/calendar/EventModal';

export default function DashboardPage() {
    const navigate = useNavigate();
    // Pegamos o usuário do store para a saudação e para a verificação de role
    const { user, logout } = useAuthStore();
    const [events, setEvents] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newEventData, setNewEventData] = useState({});

    const fetchEvents = useCallback(async () => {
        try {
            const response = await getEventsRequest();
            const formattedEvents = response.data.map(event => ({
                id: event.id,
                title: event.title,
                start: event.start_time,
                end: event.end_time,
                color: event.color_hex,
                extendedProps: { description: event.description }
            }));
            setEvents(formattedEvents);
        } catch (error) {
            console.error("Erro ao buscar eventos:", error);
            if (error.response && error.response.status === 401) {
                logout();
                navigate('/login');
            }
        }
    }, [navigate, logout]);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleSelect = (selectInfo) => {
        const start = format(selectInfo.start, "yyyy-MM-dd'T'HH:mm");
        const end = format(selectInfo.end, "yyyy-MM-dd'T'HH:mm");
        setNewEventData({ start, end, title: '', description: '' });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setNewEventData({});
    };

    const handleSaveEvent = async () => {
        if (!newEventData.title) {
            alert("O título é obrigatório.");
            return;
        }
        try {
            await createEventRequest(newEventData);
            handleCloseModal();
            fetchEvents();
        } catch (error) {
            console.error("Erro ao salvar evento:", error);
            alert("Não foi possível salvar o evento.");
        }
    };

    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
            <header className="flex flex-wrap justify-between items-center mb-6 gap-4">
                <h1 className="text-3xl font-bold text-gray-800">Olá, {user?.name}!</h1>
                <div className="flex items-center gap-4">
                    {user?.role === 'admin' && (
                        <Link
                            to="/admin"
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
                        >
                            Painel Admin
                        </Link>
                    )}
                    <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg">
                        Sair
                    </button>
                </div>
            </header>

            <div className="bg-white p-4 rounded-lg shadow-lg">
                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView="timeGridWeek"
                    locale='pt-br'
                    buttonText={{ today: 'Hoje', month: 'Mês', week: 'Semana', day: 'Dia' }}
                    headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth,timeGridWeek,timeGridDay'
                    }}
                    events={events}
                    editable={true}
                    selectable={true}
                    select={handleSelect}
                    eventClick={(clickInfo) => {
                        alert(`Evento: ${clickInfo.event.title}\nDescrição: ${clickInfo.event.extendedProps.description || 'Nenhuma'}`);
                    }}
                />
            </div>

            <EventModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveEvent}
                eventData={newEventData}
                setEventData={setNewEventData}
            />
        </div>
    );
}