const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bot')
        .setDescription('Mostra informações detalhadas sobre o bot e seu desenvolvedor.'),

    async execute(interaction) {
        // Data de criação oficial do bot (ajuste se preferir outro formato)
        const creationDate = '10 de Janeiro de 2024'; 
        const botName = interaction.client.user.username;

        const embed = new EmbedBuilder()
            .setColor('#002B49')
            .setTitle('🤖 Informações do Sistema - Bot')
            .setDescription('Detalhes técnicos, autoria e versão atual do bot.')
            .addFields(
                { name: '🏷️ Nome do Bot', value: `\`${botName}\``, inline: true },
                { name: '👨‍💻 Desenvolvedor', value: '<@704755507629391972>', inline: true },
                { name: '📅 Data de Criação', value: `\`${creationDate}\``, inline: false }
            )
            .setFooter({ text: 'Nexus Bot • Informações Gerais' })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
