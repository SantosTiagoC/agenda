const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    // Pega o token do header da requisição
    const authHeader = req.header('Authorization');

    // Verifica se o header de autorização existe
    if (!authHeader) {
        return res.status(401).json({ message: 'Acesso negado. Nenhum token fornecido.' });
    }

    // O token geralmente vem no formato "Bearer <token>"
    // Nós queremos apenas a parte do token
    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Acesso negado. Token mal formatado.' });
    }

    try {
        // Verifica e decodifica o token usando a sua chave secreta
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Adiciona o payload decodificado (que contém o userId) ao objeto da requisição
        // para que as próximas rotas possam usá-lo
        req.user = decoded;

        // Continua para a próxima função (o controller da rota)
        next();
    } catch (error) {
        res.status(400).json({ message: 'Token inválido.' });
    }
};