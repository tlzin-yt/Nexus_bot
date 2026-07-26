const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('meta')
        .setDescription('Calcula quanto falta para atingir uma meta de dinheiro no GTA Online.')
        .addNumberOption(option =>
            option.setName('atual')
                .setDescription('Quanto dinheiro você tem no banco atualmente')
                .setRequired(true))
        .addNumberOption(option =>
            option.setName('alvo')
                .setDescription('Quanto custa o item que você quer comprar')
                .setRequired(true)),

    async execute(interaction) {
        const atual = interaction.options.getNumber('atual');
        const alvo = interaction.options.getNumber('alvo');
        const falta = alvo - atual;

        const embed = new EmbedBuilder()
            .setColor('#FFA500')
            .setTitle('🎯 Calculadora de Meta - GTA Online')
            .addFields(
                { name: '🏦 Dinheiro Atual', value: `$${atual.toLocaleString('pt-BR')}`, inline: true },
                { name: '🛒 Valor do Item', value: `$${alvo.toLocaleString('pt-BR')}`, inline: true },
                { name: '⏳ Falta Juntar', value: falta > 0 ? `$${falta.toLocaleString('pt-BR')}` : '🎉 Meta batida! Você já tem o dinheiro!', inline: false }
            )
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};

