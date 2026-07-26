const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const vehicles = require('../database/vehicles.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('comparar')
        .setDescription('Compara dois veículos do GTA Online lado a lado.')
        .addStringOption(option =>
            option.setName('veiculo1')
                .setDescription('Nome do primeiro veículo (ex: krieger)')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('veiculo2')
                .setDescription('Nome do segundo veículo (ex: emerus)')
                .setRequired(true)),

    async execute(interaction) {
        await interaction.deferReply();

        const q1 = interaction.options.getString('veiculo1').toLowerCase().trim();
        const q2 = interaction.options.getString('veiculo2').toLowerCase().trim();

        const v1 = vehicles[q1];
        const v2 = vehicles[q2];

        if (!v1 || !v2) {
            return interaction.editReply({ 
                content: `❌ Um ou ambos os veículos informados não foram encontrados no banco de dados.` 
            });
        }

        const embed = new EmbedBuilder()
            .setColor('#002B49')
            .setTitle('⚖️ Comparação de Veículos - GTA Online')
            .setDescription(`Comparando **${v1.name}** vs **${v2.name}**`)
            .addFields(
                { name: `🏎️ ${v1.name}`, value: `**Classe:** ${v1.class}\n**Preço:** ${v1.price}\n**Velocidade:** ${v1.topSpeed}\n**Volta:** ${v1.lapTime}`, inline: true },
                { name: `🏁 ${v2.name}`, value: `**Classe:** ${v2.class}\n**Preço:** ${v2.price}\n**Velocidade:** ${v2.topSpeed}\n**Volta:** ${v2.lapTime}`, inline: true }
            )
            .setFooter({ text: 'Nexus Bot • Comparador de Veículos' })
            .setTimestamp();

        await interaction.editReply({ embeds: [embed] });
    },
};
