const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const vehicles = require('../database/vehicles.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('veiculo')
        .setDescription('Mostra as informações completas de um veículo do GTA Online.')
        .addStringOption(option =>
            option.setName('nome')
                .setDescription('Nome do veículo (ex: krieger, pariah, emerus)')
                .setRequired(true)),

    async execute(interaction) {
        const query = interaction.options.getString('nome').toLowerCase().trim();
        const vehicle = vehicles[query];

                if (!vehicle) {
            return interaction.reply({ 
                content: `❌ Veículo **"${query}"** não foi encontrado no banco de dados. Verifique se digitou o nome corretamente em inglês (ex: \`tempesta\`, \`krieger\`, \`pariah\`).`, 
                ephemeral: true 
            });
        }
 

        const embed = new EmbedBuilder()
            .setColor('#002B49')
            .setTitle(`🚗 ${vehicle.name}`)
            .setDescription(`Informações detalhadas do veículo no GTA Online.`)
            .addFields(
                { name: '📂 Classe', value: vehicle.class, inline: true },
                { name: '💵 Preço', value: vehicle.price, inline: true },
                { name: '🌐 Loja', value: vehicle.source, inline: true },
                { name: '⚡ Velocidade Máxima', value: vehicle.topSpeed, inline: true },
                { name: '⏱️ Tempo de Volta', value: vehicle.lapTime, inline: true }
            )
            .setFooter({ text: 'Nexus Bot • Banco de Dados de Veículos' })
            .setTimestamp();

        if (vehicle.image) {
            embed.setThumbnail(vehicle.image);
        }

        await interaction.reply({ embeds: [embed] });
    },
};
