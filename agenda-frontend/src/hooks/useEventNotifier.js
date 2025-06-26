import { useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import NotificationToast from '../components/calendar/NotificationToast';

export const useEventNotifier = (events) => {
    const notifiedEvents = useRef(new Set());

    useEffect(() => {
        const checkUpcomingEvents = () => {
            const now = new Date();
            const oneDayFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

            const upcomingEvents = events.filter(event => {
                const eventStart = new Date(event.start);
                return eventStart > now && eventStart <= oneDayFromNow;
            });

            upcomingEvents.forEach(event => {
                const toastId = `event-toast-${event.id}`;
                const isViewed = sessionStorage.getItem(`viewed_${event.id}`);

                if (!toast.isActive(toastId) && !isViewed) {
                    toast(<NotificationToast event={event} />, {
                        toastId: toastId,
                        onClose: () => { /* Apenas fecha, não marca como visto */ }
                    });
                }
            });
        };

        // Roda a verificação a cada 5 minutos
        const intervalId = setInterval(checkUpcomingEvents, 300000);

        // Roda uma vez logo ao carregar a página
        checkUpcomingEvents();

        return () => clearInterval(intervalId);
    }, [events]);
};