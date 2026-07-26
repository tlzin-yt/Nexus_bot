const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dividir')
        .setDescription('Calcula a divisão de dinheiro de um golpe do GTA Online.')
        .addNumberOption(option =>
            option.setName('total')
                .setDescription('Valor total ganho no golpe')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('jogadores')
                .setDescription('Quantidade de jogadores participando')
                .setRequired(true))
        .addNumberOption(option =>
            option.setName('porcentagem_lider')
                .setDescription('Porcentagem do líder (ex: 40 para 40%)')
                .setRequired(true)),

    async execute(interaction) {
        const total = interaction.options.getNumber('total');
        const jogadores = interaction.options.getInteger('jogadores');
        const pctLider = interaction.options.getNumber('porcentagem_lider');

        if (pctLider >= 100 || pctLider <= 0) {
            return interaction.reply({ content: '❌ A porcentagem do líder deve estar entre 1 e 99.', ephemeral: true });
        }

        const valorLider = (total * pctLider) / 100;
        const restoValor = total - valorLider;
        const membrosRestantes = jogadores - 1;

        let valorPorMembro = 0;
        if (membrosRestantes > 0) {
            valorPorMembro = restoValor / membrosRestantes;
        }

        const embed = new EmbedBuilder()
            .setColor('#00FF00')
            .setTitle('💵 Calculadora de Divisão - GTA Online')
            .addFields(
                { name: '💰 Faturamento Total', value: `$${total.toLocaleString('pt-BR')}`, inline: false },
                { name: '👑 Líder', value: `${pctLider}% (=\$${valorLider.toLocaleString('pt-BR')})`, inline: true },
                { name: `👥 Demais Membros (${membrosRestantes} jog.)`, value: `=\$${valorPorMembro.toLocaleString('pt-BR')} cada`, inline: true }
            )
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};

