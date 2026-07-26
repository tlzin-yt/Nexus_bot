const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gunvan')
        .setDescription('Mostra informações e a localização da Van de Armas (Gun Van) do GTA Online.'),

    async execute(interaction) {
        // Criando a Embed em azul marinho com o novo link do mapa
        const embed = new EmbedBuilder()
            .setColor('#002B49')
            .setTitle('🚐 Gun Van (Van de Armas) - GTA Online')
            .setDescription('A localização da Gun Van muda diariamente no mapa de Los Santos.')
            .addFields(
                { name: '📍 Localização de Hoje', value: 'Clique no link para ver a posição exata no mapa interativo:\n🌐 [Acessar Mapa da Gun Van](https://gtamap.net/map/gtao?city=ls&layer=game&groups=gun_van)', inline: false },
                { name: '🛡️ O que ela oferece?', value: '• Armas exclusivas com desconto\n• Coletes balísticos e explosivos\n• Mudança diária de inventário', inline: false }
            )
            .setImage('https://cdn.discordapp.com/attachments/1529474596368285832/1530378142148198541/gta-v-agency-suv-service-dropoff-location-maps-quick-travel-v0-tmsu6d1lbzca1_1.png?ex=6a675576&is=6a6603f6&hm=c21de95a05e86dd908c2fd1eeeb763266813686dac841e1f313aaaf628c88e50&')
            .setFooter({ text: 'Nexus Bot • GTA Online' })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
