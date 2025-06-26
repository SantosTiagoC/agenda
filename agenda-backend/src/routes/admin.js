const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Aplica os dois middlewares em todas as rotas deste arquivo.
// Primeiro, verifica se está logado (auth), depois se é admin (admin).
router.use(authMiddleware, adminMiddleware);

// Rota para listar todos os usuários
// GET /api/admin/users
router.get('/users', adminController.getAllUsers);

// Rota para alterar o status de um usuário
// PATCH /api/admin/users/:id/status
router.patch('/users/:id/status', adminController.updateUserStatus);

module.exports = router;