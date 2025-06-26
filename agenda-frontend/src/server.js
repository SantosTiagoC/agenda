require('dotenv').config();
const express = require('express');
const cors = require('cors'); // <-- Garanta que o cors está sendo importado
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');

const app = express();

// =================================================================
// HABILITA O CORS PARA TODAS AS REQUISIÇÕES
// Esta linha é a solução para o seu erro.
app.use(cors());
// =================================================================

app.use(express.json());

app.get('/api', (req, res) => {
    res.send('API da Focus Agenda está funcionando!');
});

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);

const PORT = process.env.API_PORT || 3001;

app.listen(PORT, () => {
    console.log(`Servidor backend rodando na porta ${PORT}`);
});