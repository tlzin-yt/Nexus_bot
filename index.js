// Importando o discord.js e o dotenv para gerenciar o bot e as senhas
const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

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
