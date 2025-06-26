const cron = require('node-cron');
const nodemailer = require('nodemailer');
const pool = require('../config/db');

// Configuração do Nodemailer (puxa do .env)
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Agenda a tarefa para rodar a cada minuto
cron.schedule('* * * * *', async () => {
    console.log('Verificando fila de notificações...');
    try {
        // Busca notificações pendentes que já passaram do horário de envio
        const [notifications] = await pool.query(
            "SELECT * FROM notifications WHERE status = 'pending' AND send_at <= NOW()"
        );

        if (notifications.length === 0) {
            return; // Nenhuma notificação para enviar
        }

        for (const notification of notifications) {
            // Busca os detalhes do usuário e do evento
            const [[user]] = await pool.query('SELECT email, name FROM users WHERE id = ?', [notification.user_id]);
            const [[event]] = await pool.query('SELECT title, start_time FROM events WHERE id = ?', [notification.event_id]);

            // Envia o e-mail
            await transporter.sendMail({
                from: `"Focus Agenda" <${process.env.EMAIL_USER}>`,
                to: user.email,
                subject: `Lembrete: ${event.title}`,
                html: `Olá, ${user.name}!<br><br>Este é um lembrete para o seu evento "<b>${event.title}</b>" que começará em breve.<br><br>Atenciosamente,<br>Equipe Focus Agenda`,
            });

            // Atualiza o status da notificação para 'sent' para não enviar de novo
            await pool.query("UPDATE notifications SET status = 'sent' WHERE id = ?", [notification.id]);
            console.log(`Notificação enviada para ${user.email}`);
        }
    } catch (error) {
        console.error('Erro no worker de notificações:', error);
    }
});