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
        await interaction.deferReply();

        const query = interaction.options.getString('nome').toLowerCase().trim();
        
        // Busca exata ou por aproximação no JSON
        let vehicleKey = Object.keys(vehicles).find(k => k === query || vehicles[k].name.toLowerCase().includes(query));
        let vehicle = vehicleKey ? vehicles[vehicleKey] : null;

        if (!vehicle) {
            return interaction.editReply({ 
                content: `❌ Veículo **"${query}"** não foi encontrado no banco de dados. Tente pesquisar por: \`tempesta\`, \`krieger\`, \`pariah\`, \`emerus\` ou \`zentorno\`.` 
            });
        }

        const embed = new EmbedBuilder()
            .setColor('#002B49')
            .setTitle(`🚗 ${vehicle.name}`)
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
