import React from 'react';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

export default function NotificationToast({ closeToast, event }) {

    const handleView = () => {
        sessionStorage.setItem(`viewed_${event.id}`, 'true');
        closeToast();
        alert(`Visualizando evento: ${event.title}`);
    };

    const formattedDate = format(new Date(event.start), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });

    return (
        <div>
            <h4 className="font-bold">Lembrete de Agendamento</h4>
            <p className="text-sm">"{event.title}"</p>
            <p className="text-sm">Começa em: {formattedDate}</p>
            <div className="flex justify-end gap-2 mt-3">
                <button onClick={closeToast} className="bg-gray-300 text-gray-800 px-3 py-1 text-xs rounded hover:bg-gray-400">
                    Fechar
                </button>
                <button onClick={handleView} className="bg-blue-500 text-white px-3 py-1 text-xs rounded hover:bg-blue-600">
                    Visualizar
                </button>
            </div>
        </div>
    );
}