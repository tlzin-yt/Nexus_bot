const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bonus')
        .setDescription('Mostra os eventos, descontos e bônus da semana atual no GTA Online.'),

    async execute(interaction) {
        // Criando a Embed em azul marinho com o link oficial da Rockstar
        const embed = new EmbedBuilder()
            .setColor('#002B49')
            .setTitle('🌟 Bônus e Descontos Semanais - GTA Online')
            .setDescription('O GTA Online é atualizado **toda quinta-feira** com novos bônus, veículos e eventos especiais.')
            .addFields(
                { name: '📰 Eventos e Novidades Oficiais', value: 'Clique no link para ler o artigo oficial da Rockstar Games com todos os bônus da semana:\n🌐 [Ver Newswire Oficial da Rockstar](https://www.rockstargames.com/gta-online)', inline: false },
                { name: '🚗 O que costuma mudar?', value: '• Modos com pagamento 2x ou 3x (GTA$ e RP)\n• Descontos em imóveis, veículos e armas\n• Novos carros nos concessionários e no Cassino', inline: false }
            )
            .setFooter({ text: 'Nexus Bot • Atualizações semanais' })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
