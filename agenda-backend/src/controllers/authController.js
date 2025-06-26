const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

/**
 * Registra um novo usuário. O status padrão será 'pending'.
 */
exports.register = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Por favor, forneça nome, e-mail e senha.' });
    }

    try {
        const userId = uuidv4();
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        await pool.query(
            'INSERT INTO users (id, name, email, password_hash) VALUES (?, ?, ?, ?)',
            [userId, name, email, password_hash]
        );

        res.status(201).json({ message: 'Usuário registrado com sucesso! Sua conta aguarda aprovação do administrador.', userId: userId });

    } catch (error) {
        console.error(error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Este e-mail já está em uso.' });
        }
        res.status(500).json({ message: 'Erro no servidor ao tentar registrar.' });
    }
};

/**
 * Autentica um usuário existente, mas apenas se seu status for 'active'.
 */
exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Por favor, forneça e-mail e senha.' });
    }

    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

        if (rows.length === 0) {
            return res.status(401).json({ message: 'E-mail ou senha inválidos.' });
        }

        const user = rows[0];

        // ===================================================================
        // VERIFICAÇÃO CRÍTICA DO STATUS DO USUÁRIO
        // É este bloco que impede o login de usuários não ativos.
        // ===================================================================
        if (user.status !== 'active') {
            let message = 'Sua conta não está ativa. Contate o administrador.';
            if (user.status === 'pending') {
                message = 'Sua conta ainda está pendente de aprovação.';
            } else if (user.status === 'inactive') {
                message = 'Sua conta foi desativada.';
            }
            return res.status(403).json({ message: message }); // 403 Forbidden
        }
        // ===================================================================

        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.status(401).json({ message: 'E-mail ou senha inválidos.' });
        }

        const payload = { userId: user.id, role: user.role };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.status(200).json({
            message: 'Login bem-sucedido!',
            token: token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.status
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro no servidor ao tentar fazer login.' });
    }
};