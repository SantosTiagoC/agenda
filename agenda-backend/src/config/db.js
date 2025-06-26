const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,

    // ===============================================================
    // ADICIONE ESTA LINHA PARA HABILITAR A CONEXÃO SEGURA (SSL)
    ssl: { rejectUnauthorized: false },
    // ===============================================================

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

console.log('Pool de conexões com o MySQL configurado com SSL.');

module.exports = pool;