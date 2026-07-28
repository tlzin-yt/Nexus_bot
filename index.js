const express = require('express');
const { Client, GatewayIntentBits } = require('discord.js'); // Certifique-se de importar o Client

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());

// Inicializa o cliente do Discord (adicione os intents que seu bot usa)
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

// Rota da API de veículos integrada
app.get('/api/veiculos', async (req, res) => {
    try {
        const response = await fetch('https://gtav-vehicle-database.vercel.app/api/vehicles');
        const data = await response.json();
        return res.json({
            sucesso: true,
            total: Array.isArray(data) ? data.length : 0,
            veiculos: data
        });
    } catch (error) {
        return res.status(500).json({ sucesso: false, erro: 'Erro ao carregar veículos.' });
    }
});

// Inicia o servidor web na porta exigida pelo Render
app.listen(PORT, () => {
    console.log(`🚀 Servidor e API rodando na porta ${PORT}`);
});

// Evento quando o bot estiver pronto (opcional, mas bom para saber)
client.once('ready', () => {
    console.log(`🤖 Bot conectado como ${client.user.tag}`);
});

// Faz o login do bot usando o token do ambiente
client.login(process.env.TOKEN);
