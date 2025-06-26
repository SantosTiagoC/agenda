const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const authMiddleware = require('../middleware/authMiddleware');

// IMPORTANTE: Aplica o middleware de autenticação a TODAS as rotas deste arquivo
// Ninguém conseguirá acessar as rotas de eventos sem um token válido.
router.use(authMiddleware);

// Rota para criar um novo evento
// POST /api/events/
router.post('/', eventController.createEvent);

// Rota para buscar todos os eventos do usuário logado
// GET /api/events/
router.get('/', eventController.getEvents);

// Rota para atualizar um evento específico
// PUT /api/events/:id
router.put('/:id', eventController.updateEvent);

// Rota para deletar um evento específico
// DELETE /api/events/:id
router.delete('/:id', eventController.deleteEvent);

module.exports = router;