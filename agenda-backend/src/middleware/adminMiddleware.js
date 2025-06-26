const pool = require('../config/db');

const adminMiddleware = async (req, res, next) => {
    try {
        // Este middleware roda DEPOIS do authMiddleware, então req.user já existe.
        const userId = req.user.userId;

        // Buscamos o usuário no banco para ter certeza da sua role atual.
        const [rows] = await pool.query('SELECT role FROM users WHERE id = ?', [userId]);

        if (rows.length === 0 || rows[0].role !== 'admin') {
            // Se o usuário não for encontrado ou não for admin, nega o acesso.
            return res.status(403).json({ message: 'Acesso negado. Requer privilégios de administrador.' });
        }

        // Se for admin, permite que a requisição continue.
        next();
    } catch (error) {
        console.error("Erro no middleware de admin:", error);
        res.status(500).json({ message: 'Erro interno no servidor.' });
    }
};

module.exports = adminMiddleware;