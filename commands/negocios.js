const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('negocios')
        .setDescription('Painel interativo completo com todos os negócios e golpes do GTA Online.'),

    async execute(interaction) {
        // Evita o erro de tempo limite (interaction failed)
        await interaction.deferReply();

        const embed = new EmbedBuilder()
            .setColor('#002B49')
            .setTitle('💼 Painel de Negócios e Golpes - GTA Online')
            .setDescription('Selecione abaixo na lista qual negócio ou golpe você deseja consultar para ver lucros, tempos e links para os guias oficiais e atualizados.')
            .setTimestamp();

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('select_negocio')
            .setPlaceholder('Escolha um negócio ou golpe...')
            .addOptions([
                { label: 'Cayo Perico Heist', description: 'Lucros, alvos e guia completo.', value: 'cayo', emoji: '💰' },
                { label: 'Cluckin Bell Farm Raid', description: 'Guia do golpe acessível (R$ 500k).', value: 'cluckin', emoji: '🐔' },
                { label: 'Agencia de Seguranca', description: 'Contratos e Contrato VIP Dr. Dre.', value: 'agencia', emoji: '🏢' },
                { label: 'Boate Nightclub', description: 'Gestao de deposito, cofre e popularidade.', value: 'boate', emoji: '🕺' },
                { label: 'Bunker', description: 'Suprimentos, producao e vendas.', value: 'bunker', emoji: '🎯' },
                { label: 'Laboratorio de Acido', description: 'Lucro passivo/ativo excelente para solo.', value: 'acidlab', emoji: '🧪' },
                { label: 'Ferro Velho Salvage Yard', description: 'Roubos de carros e desmanche.', value: 'ferrovelho', emoji: '🚗' },
                { label: 'Hangar', description: 'Tráfico aéreo, cargas e funcionários.', value: 'hangar', emoji: '✈️' },
                { label: 'Auto Shop', description: 'Contratos e modificação de carros.', value: 'autoshop', emoji: '🔧' }
            ]);

        const row = new ActionRowBuilder().addComponents(selectMenu);

        await interaction.editReply({ embeds: [embed], components: [row] });
    },
};
