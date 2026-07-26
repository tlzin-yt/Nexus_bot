const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mapa')
        .setDescription('Abre o painel interativo com links para os mapas dos colecionáveis e locais do GTA Online.'),

    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor('#002B49')
            .setTitle('🗺️ Painel de Mapas e Colecionáveis - GTA Online')
            .setDescription('Clique nos botões abaixo para abrir diretamente o mapa interativo oficial com a localização de cada item no jogo.')
            .addFields(
                { name: '📍 Locais Diários & Utilidades', value: '• Gun Van\n• Stash House\n• G\'s Cache', inline: true },
                { name: '🧩 Colecionáveis & Outros', value: '• Action Figures\n• Playing Cards\n• Movie Props\n• Snowmen\n• LD Organics', inline: true }
            )
            .setFooter({ text: 'Nexus Bot • Mapa Interativo de GTA Online' })
            .setTimestamp();

        // Linha 1 de Botões
        const row1 = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setLabel('Gun Van').setStyle(ButtonStyle.Link).setURL('https://gtaweb.eu/gta-o-map/world/ls/-1.1394,15,3#l=gun-van'),
            new ButtonBuilder().setLabel('Stash House').setStyle(ButtonStyle.Link).setURL('https://gtaweb.eu/gta-o-map/world/ls/-1.1394,15,3#l=stash-house'),
            new ButtonBuilder().setLabel('G\'s Cache').setStyle(ButtonStyle.Link).setURL('https://gtaweb.eu/gta-o-map/world/ls/-1.1394,15,3#l=gs-cache'),
            new ButtonBuilder().setLabel('Treasure Hunt').setStyle(ButtonStyle.Link).setURL('https://gtaweb.eu/gta-o-map/world/ls/-1.1394,15,3#l=treasure-hunt')
        );

        // Linha 2 de Botões
        const row2 = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setLabel('Signal Jammers').setStyle(ButtonStyle.Link).setURL('https://gtaweb.eu/gta-o-map/world/ls/-1.1394,15,3#l=signal-jammer'),
            new ButtonBuilder().setLabel('Action Figures').setStyle(ButtonStyle.Link).setURL('https://gtaweb.eu/gta-o-map/world/ls/-1.1394,15,3#l=action-figure'),
            new ButtonBuilder().setLabel('Playing Cards').setStyle(ButtonStyle.Link).setURL('https://gtaweb.eu/gta-o-map/world/ls/-1.1394,15,3#l=playing-card'),
            new ButtonBuilder().setLabel('Movie Props').setStyle(ButtonStyle.Link).setURL('https://gtaweb.eu/gta-o-map/world/ls/-1.1394,15,3#l=movie-prop')
        );

        // Linha 3 de Botões
        const row3 = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setLabel('LD Organics').setStyle(ButtonStyle.Link).setURL('https://gtaweb.eu/gta-o-map/world/ls/-1.1394,15,3#l=ld-organics-product'),
            new ButtonBuilder().setLabel('Snowmen').setStyle(ButtonStyle.Link).setURL('https://gtaweb.eu/gta-o-map/world/ls/-1.1394,15,3#l=snowman'),
            new ButtonBuilder().setLabel('Daily Collectibles').setStyle(ButtonStyle.Link).setURL('https://gtaweb.eu/gta-o-map/world/ls/-1.1394,15,3')
        );

        await interaction.reply({ embeds: [embed], components: [row1, row2, row3] });
    },
};
