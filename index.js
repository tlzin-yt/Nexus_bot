// Importando o discord.js, o dotenv e o http para criar um mini servidor web
const { Client, GatewayIntentBits } = require('discord.js');
const http = require('http');
require('dotenv').config();

// Criando um mini servidor web para atender às exigências do plano gratuito do Render
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Nexus Bot esta online!\n');
});

// Pegando a porta que o Render definir ou usando a porta 3000 por padrão
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`[WEB] Servidor web rodando na porta ${PORT}`);
});

// Criando a instância do bot com as intenções necessárias
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

// Evento executado quando o bot estiver online e pronto
client.once('ready', () => {
    console.log(`[SUCESSO] O Nexus Bot está online e conectado como ${client.user.tag}!`);
});

// Fazendo o bot entrar no Discord usando o Token secreto do arquivo .env
client.login(process.env.TOKEN);

