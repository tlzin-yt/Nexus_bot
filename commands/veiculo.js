const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const vehicles = require('../database/vehicles.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('veiculo')
        .setDescription('Mostra as informações completas de um veículo do GTA Online.')
        .addStringOption(option =>
            option.setName('nome')
                .setDescription('Nome do veículo (ex: tempesta, krieger, pariah)')
                .setRequired(true)),

    async execute(interaction) {
        // Evita que o Discord dê erro de tempo excedido enquanto busca
        await interaction.deferReply();

        const query = interaction.options.getString('nome').toLowerCase().trim();
        const vehicle = vehicles[query];

        if (!vehicle) {
            return interaction.editReply({ 
                content: `❌ Veículo **"${query}"** não foi encontrado no banco de dados. Verifique se digitou o nome corretamente em inglês (ex: \`tempesta\`, \`krieger\`, \`pariah\`).` 
            });
        }

        const embed = new EmbedBuilder()
            .setColor('#002B49')
            .setTitle(`🚗 ${vehicle.name || 'Veículo'}`)
            .setDescription(`Informações detalhadas do veículo no GTA Online.`)
            .addFields(
                { name: '📂 Classe', value: vehicle.class || 'Desconhecida', inline: true },
                { name: '💵 Preço', value: vehicle.price || 'Indisponível', inline: true },
                { name: '🌐 Loja', value: vehicle.source || 'Indisponível', inline: true },
                { name: '⚡ Velocidade Máxima', value: vehicle.topSpeed || 'Não testada', inline: true },
                { name: '⏱️ Tempo de Volta', value: vehicle.lapTime || 'Não testado', inline: true }
            )
            .setFooter({ text: 'Nexus Bot • Banco de Dados de Veículos' })
            .setTimestamp();

        if (vehicle.image) {
            embed.setThumbnail(vehicle.image);
        }

        await interaction.editReply({ embeds: [embed] });
    },
};

