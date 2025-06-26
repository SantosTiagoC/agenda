const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');

/**
 * Cria um novo evento e agenda uma notificação por e-mail.
 */
exports.createEvent = async (req, res) => {
    const { title, description, start_time, end_time, color_hex } = req.body;
    const user_id = req.user.userId;

    if (!title || !start_time || !end_time) {
        return res.status(400).json({ message: 'Título, data de início e data de fim são obrigatórios.' });
    }

    try {
        const eventId = uuidv4();

        // 1. Salva o evento no banco de dados
        await pool.query(
            'INSERT INTO events (id, user_id, title, description, start_time, end_time, color_hex) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [eventId, user_id, title, description, start_time, end_time, color_hex]
        );

        // --- NOVA ADIÇÃO: Agenda a notificação ---
        // Vamos agendar um lembrete para 15 minutos antes do evento
        const eventStartTime = new Date(start_time);
        const notificationTime = new Date(eventStartTime.getTime() - 15 * 60 * 1000); // 15 minutos em milissegundos

        await pool.query(
            'INSERT INTO notifications (user_id, event_id, type, send_at, status) VALUES (?, ?, ?, ?, ?)',
            [user_id, eventId, 'email', notificationTime, 'pending']
        );
        // --- FIM DA NOVA ADIÇÃO ---

        res.status(201).json({ message: 'Evento criado e notificação agendada com sucesso!', eventId: eventId });

    } catch (error) {
        console.error("Erro ao criar evento:", error);
        res.status(500).json({ message: 'Erro no servidor ao criar evento.' });
    }
};

/**
 * Busca todos os eventos do usuário autenticado.
 */
exports.getEvents = async (req, res) => {
    const user_id = req.user.userId;
    const { start, end } = req.query;

    try {
        let query = 'SELECT * FROM events WHERE user_id = ?';
        const params = [user_id];

        if (start && end) {
            query += ' AND start_time >= ? AND end_time <= ?';
            params.push(start, end);
        }

        const [events] = await pool.query(query, params);
        res.status(200).json(events);
    } catch (error) {
        console.error("Erro ao buscar eventos:", error);
        res.status(500).json({ message: 'Erro no servidor ao buscar eventos.' });
    }
};

/**
 * Atualiza um evento específico.
 */
exports.updateEvent = async (req, res) => {
    const { id } = req.params;
    const user_id = req.user.userId;
    const { title, description, start_time, end_time, color_hex } = req.body;

    try {
        const [result] = await pool.query(
            'UPDATE events SET title = ?, description = ?, start_time = ?, end_time = ?, color_hex = ? WHERE id = ? AND user_id = ?',
            [title, description, start_time, end_time, color_hex, id, user_id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Evento não encontrado ou você não tem permissão para editá-lo.' });
        }
        res.status(200).json({ message: 'Evento atualizado com sucesso!' });
    } catch (error) {
        console.error("Erro ao atualizar evento:", error);
        res.status(500).json({ message: 'Erro no servidor ao atualizar evento.' });
    }
};

/**
 * Deleta um evento específico.
 */
exports.deleteEvent = async (req, res) => {
    const { id } = req.params;
    const user_id = req.user.userId;

    try {
        const [result] = await pool.query('DELETE FROM events WHERE id = ? AND user_id = ?', [id, user_id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Evento não encontrado ou você não tem permissão para deletá-lo.' });
        }
        res.status(200).json({ message: 'Evento deletado com sucesso!' });
    } catch (error) {
        console.error("Erro ao deletar evento:", error);
        res.status(500).json({ message: 'Erro no servidor ao deletar evento.' });
    }
};