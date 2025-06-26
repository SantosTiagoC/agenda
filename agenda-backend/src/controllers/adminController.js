const pool = require('../config/db');

// Lista todos os usuários (exceto a senha)
exports.getAllUsers = async (req, res) => {
    try {
        const [users] = await pool.query('SELECT id, name, email, role, status, created_at FROM users ORDER BY created_at DESC');
        res.status(200).json(users);
    } catch (error) {
        console.error("Erro ao buscar usuários:", error);
        res.status(500).json({ message: 'Erro no servidor ao buscar usuários.' });
    }
};

// Altera o status de um usuário específico
exports.updateUserStatus = async (req, res) => {
    const { id } = req.params; // ID do usuário a ser alterado
    const { status } = req.body; // Novo status: 'active' ou 'inactive'

    if (!status || !['active', 'inactive', 'pending'].includes(status)) {
        return res.status(400).json({ message: 'Status inválido.' });
    }

    try {
        const [result] = await pool.query(
            'UPDATE users SET status = ? WHERE id = ?',
            [status, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        res.status(200).json({ message: `Status do usuário atualizado para '${status}'.` });
    } catch (error) {
        console.error("Erro ao atualizar status do usuário:", error);
        res.status(500).json({ message: 'Erro no servidor ao atualizar status.' });
    }
};