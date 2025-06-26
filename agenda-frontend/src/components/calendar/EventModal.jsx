import React from 'react';

export default function EventModal({ isOpen, onClose, onSave, eventData, setEventData }) {
    if (!isOpen) return null;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEventData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave();
    };

    return (
        // Fundo escuro semi-transparente
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            {/* Container do Modal */}
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg mx-4">
                <h2 className="text-xl font-bold mb-4">Adicionar Novo Evento</h2>
                <form onSubmit={handleSubmit}>
                    {/* Campo de Título */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Título</label>
                        <input type="text" name="title" value={eventData.title || ''} onChange={handleInputChange} required className="w-full px-3 py-2 border rounded-lg" />
                    </div>

                    {/* Campos de Data e Hora */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Início</label>
                            <input type="datetime-local" name="start" value={eventData.start || ''} onChange={handleInputChange} required className="w-full px-3 py-2 border rounded-lg" />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Fim</label>
                            <input type="datetime-local" name="end" value={eventData.end || ''} onChange={handleInputChange} required className="w-full px-3 py-2 border rounded-lg" />
                        </div>
                    </div>

                    {/* Campo de Descrição */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Descrição (opcional)</label>
                        <textarea name="description" value={eventData.description || ''} onChange={handleInputChange} rows="3" className="w-full px-3 py-2 border rounded-lg"></textarea>
                    </div>

                    {/* Botões de Ação */}
                    <div className="flex justify-end gap-4">
                        <button type="button" onClick={onClose} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg">
                            Cancelar
                        </button>
                        <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg">
                            Salvar Evento
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}