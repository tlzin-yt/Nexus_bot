const { Client, GatewayIntentBits, Collection } = require('discord.js');
const http = require('http');
const fs = require('node:fs');
const path = require('node:path');
require('dotenv').config();

// Mini servidor web para manter o Render gratuito
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Nexus Bot esta online!\n');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`[WEB] Servidor web rodando na porta ${PORT}`);
});

// Criando o cliente do bot
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

// Criando uma coleção para armazenar os comandos
client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(foldersPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(foldersPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    }
}

// Evento executado quando o bot liga
client.once('ready', async () => {
    console.log(`[SUCESSO] O Nexus Bot está online e conectado como ${client.user.tag}!`);
    
    // Registra automaticamente os comandos no Discord ao ligar
    try {
        const { REST, Routes } = require('discord.js');
        const commandsData = client.commands.map(cmd => cmd.data.toJSON());
        const rest = new REST().setToken(process.env.TOKEN);

        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commandsData },
        );
        console.log('[SUCESSO] Comandos de barra (/) sincronizados automaticamente!');
    } catch (error) {
        console.error('[ERRO] Falha ao registrar comandos:', error);
    }
});

// Ouvindo interações (quando alguém usa um comando de barra /)
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: '❌ Houve um erro ao executar este comando!', ephemeral: true });
        } else {
            await interaction.reply({ content: '❌ Houve um erro ao executar este comando!', ephemeral: true });
        }
    }
});

client.login(process.env.TOKEN);
