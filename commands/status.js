const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('status')
        .setDescription('Mostra as estatísticas e o desempenho atual do bot.'),

    async execute(interaction) {
        // Calcula o tempo online (Uptime) em segundos, minutos, horas e dias
        const totalSeconds = (clientInstance || interaction.client).uptime / 1000;
        const days = Math.floor(totalSeconds / 86400);
        const hours = Math.floor(totalSeconds / 3600) % 24;
        const minutes = Math.floor(totalSeconds / 60) % 60;
        const seconds = Math.floor(totalSeconds % 60);

        const uptimeString = `${days}d ${hours}h ${minutes}m ${seconds}s`;
        const ping = interaction.client.ws.ping;
        const totalServers = interaction.client.guilds.cache.size;

        const embed = new EmbedBuilder()
            .setColor('#002B49')
            .setTitle('📊 Status do Sistema - Nexus Bot')
            .setDescription('Monitoramento em tempo real da performance e conexão do bot.')
            .addFields(
                { name: '🏓 Latência / Ping', value: `\`${ping}ms\``, inline: true },
                { name: '⏱️ Tempo Online', value: `\`${uptimeString}\``, inline: true },
                { name: '🌐 Servidores Ativos', value: `\`${totalServers} servidores\``, inline: true }
            )
            .setFooter({ text: 'Nexus Bot • Monitoramento de Sistema' })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
