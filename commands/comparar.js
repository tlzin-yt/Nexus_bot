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

        const v1 = vehicles[q1];
        const v2 = vehicles[q2];

        if (!v1 || !v2) {
            return interaction.editReply({ 
                content: `❌ Um ou ambos os veículos informados (**"${q1}"** e/ou **"${q2}"**) não foram encontrados no banco de dados. Verifique a digitação em inglês.` 
            });
        }

        // Função auxiliar para definir melhor uso com base em dados ou padrão
        const getBestFor = (v) => {
            const name = (v.name || '').toLowerCase();
            const cls = (v.class || '').toLowerCase();
            
            if (name.includes('matador') || name.includes('oppressor') || name.includes('toreador') || name.includes('deluxo')) {
                return { pvp: 'Excelente', pve: 'Excelente', heists: 'Excelente', costBenefit: 'Médio' };
            }
            if (cls.includes('super') || cls.includes('sports')) {
                return { pvp: 'Baixo (Sem blindagem/armas)', pve: 'Bom (Fuga)', heists: 'Bom', costBenefit: 'Bom' };
            }
            return { pvp: 'Moderado', pve: 'Bom', heists: 'Bom', costBenefit: 'Alto' };
        };

        const u1 = getBestFor(v1);
        const u2 = getBestFor(v2);

        // Conclusão inteligente automática
        let conclusion = `⚖️ **Análise Comparativa:**\n`;
        if (parseFloat(v1.topSpeed) > parseFloat(v2.topSpeed)) {
            conclusion += `• **${v1.name}** leva vantagem na **Velocidade Máxima** (${v1.topSpeed}), sendo superior para fugas e corridas.\n`;
        } else {
            conclusion += `• **${v2.name}** leva vantagem na **Velocidade Máxima** (${v2.topSpeed}), sendo superior para fugas e corridas.\n`;
        }
        
        conclusion += `• Para **Missões e Golpes**, avalie se prefere a agilidade de ${v1.name} ou a estabilidade de ${v2.name}.\n`;
        conclusion += `• Escolha com base no seu foco principal no jogo (corridas vs utilidade em missões).`;

        const embed = new EmbedBuilder()
            .setColor('#002B49')
            .setTitle('⚖️ Comparação Avançada - GTA Online')
            .setDescription(`Comparação direta entre **${v1.name}** e **${v2.name}**`)
            .addFields(
                { 
                    name: `🏎️ ${v1.name}`, 
                    value: `**Classe:** ${v1.class || 'N/A'}\n**Preço:** ${v1.price || 'N/A'}\n**Velocidade:** ${v1.topSpeed || 'N/A'}\n**Volta:** ${v1.lapTime || 'N/A'}\n**Loja:** ${v1.source || 'N/A'}\n\n⚔️ **PvP:** ${u1.pvp}\n🛡️ **PvE:** ${u1.pve}\n💰 **Golpes:** ${u1.heists}`, 
                    inline: true 
                },
                { 
                    name: `🏁 ${v2.name}`, 
                    value: `**Classe:** ${v2.class || 'N/A'}\n**Preço:** ${v2.price || 'N/A'}\n**Velocidade:** ${v2.topSpeed || 'N/A'}\n**Volta:** ${v2.lapTime || 'N/A'}\n**Loja:** ${v2.source || 'N/A'}\n\n⚔️ **PvP:** ${u2.pvp}\n🛡️ **PvE:** ${u2.pve}\n💰 **Golpes:** ${u2.heists}`, 
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

        if (v1.image && v2.image) {
            embed.setThumbnail(v1.image);
        }

        await interaction.editReply({ embeds: [embed] });
    },
};
