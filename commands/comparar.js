const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const vehicles = require('../database/vehicles.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('comparar')
        .setDescription('Compara dois veículos do GTA Online lado a lado com análise de PvP, PvE e Golpes.')
        .addStringOption(option =>
            option.setName('veiculo1')
                .setDescription('Nome do primeiro veículo (ex: krieger)')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('veiculo2')
                .setDescription('Nome do segundo veículo (ex: pariah)')
                .setRequired(true)),

    async execute(interaction) {
        await interaction.deferReply();

        const q1 = interaction.options.getString('veiculo1').toLowerCase().trim();
        const q2 = interaction.options.getString('veiculo2').toLowerCase().trim();

        const findVehicle = (query) => {
            const key = Object.keys(vehicles).find(k => k === query || vehicles[k].name.toLowerCase().includes(query));
            return key ? vehicles[key] : null;
        };

        const v1 = findVehicle(q1);
        const v2 = findVehicle(q2);

        if (!v1 || !v2) {
            return interaction.editReply({ 
                content: `❌ Um ou ambos os veículos informados (**"${q1}"** e/ou **"${q2}"**) não foram encontrados no banco de dados.` 
            });
        }

        const getBestFor = (v) => {
            const cls = (v.class || '').toLowerCase();
            if (cls.includes('super')) {
                return { pvp: 'Bom (Velocidade)', pve: 'Excelente (Fuga)', heists: 'Excelente' };
            }
            return { pvp: 'Moderado', pve: 'Bom', heists: 'Bom' };
        };

        const u1 = getBestFor(v1);
        const u2 = getBestFor(v2);

        let conclusion = `⚖️ **Análise Comparativa:**\n`;
        conclusion += `• **${v1.name}** tem velocidade máxima de **${v1.topSpeed}**.\n`;
        conclusion += `• **${v2.name}** tem velocidade máxima de **${v2.topSpeed}**.\n`;
        conclusion += `• Ambos são ótimas escolhas dependendo se você prioriza tempo de volta ou preço/estilo.`;

        const embed = new EmbedBuilder()
            .setColor('#002B49')
            .setTitle('⚖️ Comparação Avançada - GTA Online')
            .setDescription(`Comparação direta entre **${v1.name}** e **${v2.name}**`)
            .addFields(
                { 
                    name: `🏎️ ${v1.name}`, 
                    value: `**Classe:** ${v1.class}\n**Preço:** ${v1.price}\n**Velocidade:** ${v1.topSpeed}\n**Volta:** ${v1.lapTime}\n\n⚔️ **PvP:** ${u1.pvp}\n🛡️ **PvE:** ${u1.pve}\n💰 **Golpes:** ${u1.heists}`, 
                    inline: true 
                },
                { 
                    name: `🏁 ${v2.name}`, 
                    value: `**Classe:** ${v2.class}\n**Preço:** ${v2.price}\n**Velocidade:** ${v2.topSpeed}\n**Volta:** ${v2.lapTime}\n\n⚔️ **PvP:** ${u2.pvp}\n🛡️ **PvE:** ${u2.pve}\n💰 **Golpes:** ${u2.heists}`, 
                    inline: true 
                },
                {
                    name: '🧠 Conclusão Inteligente',
                    value: conclusion,
                    inline: false
                }
            )
            .setFooter({ text: 'Nexus Bot • Comparador Avançado de Veículos' })
            .setTimestamp();

        await interaction.editReply({ embeds: [embed] });
    },
};
