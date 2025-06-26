require('dotenv').config();
const express = require('express');
const cors = require('cors');

// --- Importação das Rotas ---
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');
const adminRoutes = require('./routes/admin'); // <-- 1. IMPORTE AS NOVAS ROTAS DE ADMIN

// --- Serviços de Background ---
require('./services/notificationWorker'); // Inicia o agendador de tarefas

const app = express();

// --- Middlewares Essenciais ---
app.use(cors()); // Habilita o CORS para todas as requisições
app.use(express.json()); // Permite que o servidor entenda JSON no corpo das requisições

// --- Rota de Teste da API ---
app.get('/api', (req, res) => {
    res.send('API da Focus Agenda está no ar!');
});

// --- Registro das Rotas na Aplicação ---
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/admin', adminRoutes); // <-- 2. USE AS NOVAS ROTAS DE ADMIN

// --- Inicialização do Servidor ---
const PORT = process.env.API_PORT || 3001;

app.listen(PORT, () => {
    console.log(`Servidor backend rodando na porta ${PORT}`);
});