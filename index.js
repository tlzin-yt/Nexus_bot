const express = require('express');
const fs = require('fs');
const path = require('path');
const { Client, GatewayIntentBits, Collection } = require('discord.js');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());

// Rota da API de veículos
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

// Inicia o servidor web na porta do Render
app.listen(PORT, () => {
    console.log(`🚀 Servidor e API rodando na porta ${PORT}`);
});

// Configuração do Bot do Discord
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent 
    ] 
});

client.commands = new Collection();

// Carregador automático de comandos (direto da pasta commands)
const commandsPath = path.join(__dirname, 'commands');
if (fs.existsSync(commandsPath)) {
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        }
    }
}

// Ouvinte para executar os comandos quando digitados
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: '❌ Ocorreu um erro ao executar este comando!', ephemeral: true });
        } else {
            await interaction.reply({ content: '❌ Ocorreu um erro ao executar este comando!', ephemeral: true });
        }
    }
});

client.once('ready', () => {
    console.log(`🤖 Bot conectado como ${client.user.tag}`);
});

// Faz o login do bot
client.login(process.env.TOKEN);
