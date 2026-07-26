const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ComponentType } = require('discord.js');

// Dados médios atualizados dos negócios do GTA Online (Lucro médio, tempo em minutos e cooldown em minutos)
const BUSINESS_DATA = {
    cayo: { name: 'Cayo Perico Heist', profit: 1350000, time: 60, cooldown: 48, type: 'Golpe' },
    cluckin: { name: 'Cluckin\' Bell Farm Raid', profit: 500000, time: 45, cooldown: 60, type: 'Golpe' },
    agencia: { name: 'Agência (Dr. Dre Contract)', profit: 1000000, time: 75, cooldown: 0, type: 'Contrato VIP' },
    boate: { name: 'Boate (Nightclub - Depósito Full)', profit: 400000, time: 120, cooldown: 0, type: 'Passivo/Venda' },
    bunker: { name: 'Bunker (Venda Distante)', profit: 1050000, time: 140, cooldown: 0, type: 'Negócio' },
    acidlab: { name: 'Laboratório de Ácido', profit: 335000, time: 180, cooldown: 0, type: 'Passivo/Venda' },
    ferrovelho: { name: 'Ferro-Velho (Salvage Yard)', profit: 350000, time: 30, cooldown: 0, type: 'Roubo' },
    hangar: { name: 'Hangar (Carga de Narcóticos/Químicos)', profit: 850000, time: 90, cooldown: 0, type: 'Contrabando' },
    escritorio: { name: 'Escritório (Exportação de Veículos)', profit: 80000, time: 20, cooldown: 20, type: 'Veículos' },
    autoshop: { name: 'Auto Shop (Contratos)', profit: 250000, time: 25, cooldown: 0, type: 'Contrato' },
    documentos: { name: 'Oficina de Falsificação de Documentos', profit: 90000, time: 180, cooldown: 0, type: 'MC Business' },
    dinheiro: { name: 'Fábrica de Dinheiro Falso', profit: 160000, time: 180, cooldown: 0, type: 'MC Business' },
    metanfetamina: { name: 'Laboratório de Metanfetamina', profit: 230000, time: 180, cooldown: 0, type: 'MC Business' },
    cocaina: { name: 'Plantação de Cocaína', profit: 420000, time: 180, cooldown: 0, type: 'MC Business' },
    maconha: { name: 'Plantação de Maconha', profit: 150000, time: 180, cooldown: 0, type: 'MC Business' }
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('planejar')
        .setDescription('Planejador financeiro inteligente para alcançar suas metas no GTA Online.'),

    async execute(interaction) {
        await interaction.deferReply();

        const userId = interaction.user.id;

        // Passo 1: Perguntar quanto dinheiro o usuário possui
        await interaction.editReply({
            content: '💰 **Passo 1/3:** Digita no chat quanto dinheiro você possui atualmente no GTA Online (apenas números,ex: `1500000` ou `500000`).',
            embeds: [],
            components: []
        });

        const filterMoney = m => m.author.id === userId;
        const collectedMoney = await interaction.channel.awaitMessages({ filter: filterMoney, max: 1, time: 60000, errors: ['time'] })
            .catch(() => null);

        if (!collectedMoney) {
            return interaction.editReply({ content: '⏱️ Tempo esgotado! Execute o comando `/planejar` novamente.', components: [] });
        }

        const currentMoney = parseFloat(collectedMoney.first().content.replace(/[^0-9.]/g, '')) || 0;
        await collectedMoney.first().delete().catch(() => {});

        // Passo 2: Perguntar o preço do item desejado
        await interaction.editReply({
            content: `💵 Dinheiro atual registrado: **$${currentMoney.toLocaleString()}**\n\n🎯 **Passo 2/3:** Quanto custa o item, veículo ou imóvel que você deseja comprar? (Digite apenas números).`
        });

        const collectedTarget = await interaction.channel.awaitMessages({ filter: filterMoney, max: 1, time: 60000, errors: ['time'] })
            .catch(() => null);

        if (!collectedTarget) {
            return interaction.editReply({ content: '⏱️ Tempo esgotado! Execute o comando `/planejar` novamente.', components: [] });
        }

        const targetPrice = parseFloat(collectedTarget.first().content.replace(/[^0-9.]/g, '')) || 0;
        await collectedTarget.first().delete().catch(() => {});

        const moneyNeeded = Math.max(0, targetPrice - currentMoney);

        // Passo 3: Seleção múltipla dos negócios
        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('select_negocios_multi')
            .setPlaceholder('Selecione os negócios que você possui...')
            .setMinValues(1)
            .setMaxValues(Object.keys(BUSINESS_DATA).length)
            .addOptions(
                Object.entries(BUSINESS_DATA).map(([key, data]) => ({
                    label: data.name,
                    description: `Lucro médio: ~$${data.profit.toLocaleString()} | Tempo: ${data.time} min`,
                    value: key
                }))
            );

        const row = new ActionRowBuilder().addComponents(selectMenu);

        const promptStep3 = await interaction.editReply({
            content: `🎯 Meta: **$${targetPrice.toLocaleString()}** | Falta: **$${moneyNeeded.toLocaleString()}**\n\n🏢 **Passo 3/3:** Selecione abaixo **todos os negócios** que você possui no menu multiselect e clique em confirmar/fora:`,
            components: [row]
        });

        const collectorMenu = promptStep3.createMessageComponentCollector({
            componentType: ComponentType.StringSelect,
            time: 60000
        });

        collectorMenu.on('collect', async i => {
            if (i.user.id !== userId) {
                return i.reply({ content: '❌ Apenas quem iniciou o comando pode selecionar.', ephemeral: true });
            }

            await i.deferUpdate();
            collectorMenu.stop();

            const selectedKeys = i.values;
            
            // Cálculo da estratégia inteligente
            let totalEstimatedProfitPerHour = 0;
            let strategyDetails = [];

            // Ordena os negócios por rentabilidade por hora para priorizar os melhores
            const userBusinesses = selectedKeys.map(key => {
                const b = BUSINESS_DATA[key];
                const profitPerHour = (b.profit / b.time) * 60;
                return { key, ...b, profitPerHour };
            }).sort((a, b) => b.profitPerHour - a.profitPerHour);

            userBusinesses.forEach(b => {
                totalEstimatedProfitPerHour += b.profitPerHour;
                strategyDetails.push(`• **${b.name}**: Rende aprox. **$${b.profit.toLocaleString()}** a cada ${b.time} min (~$${Math.round(b.profitPerHour).toLocaleString()}/h)`);
            });

            // Horas e tempo estimado para atingir a meta
            const hoursNeeded = totalEstimatedProfitPerHour > 0 ? moneyNeeded / totalEstimatedProfitPerHour : 0;
            const totalMinutesNeeded = Math.round(hoursNeeded * 60);
            
            // Quantas vezes fazer cada atividade principal selecionada para atingir o valor
            let executionPlan = [];
            let accumulatedSimulatedProfit = 0;
            
            // Simulação de distribuição inteligente de tarefas
            while (accumulatedSimulatedProfit < moneyNeeded && userBusinesses.length > 0) {
                for (let b of userBusinesses) {
                    if (accumulatedSimulatedProfit >= moneyNeeded) break;
                    let existing = executionPlan.find(item => item.name === b.name);
                    if (existing) {
                        existing.count += 1;
                    } else {
                        executionPlan.push({ name: b.name, count: 1, profit: b.profit, time: b.time });
                    }
                    accumulatedSimulatedProfit += b.profit;
                }
                // Evitar loop infinito se não houver lucro
                if (totalEstimatedProfitPerHour <= 0) break;
            }

            const planSummary = executionPlan.map(item => `• **${item.count}x** - ${item.name} (Gera acumulado de $${(item.count * item.profit).toLocaleString()})`).join('\n');
            const recommendedOrder = userBusinesses.map((b, index) => `${index + 1}. ${b.name}`).join(' ➔ ');

            const resultEmbed = new EmbedBuilder()
                .setColor('#002B49')
                .setTitle('📊 Plano Financeiro Inteligente - GTA Online')
                .setDescription('Aqui está a estratégia otimizada calculada com base no seu capital e nos negócios disponíveis.')
                .addFields(
                    { name: '📉 Dinheiro Faltante', value: `**$${moneyNeeded.toLocaleString()}** (Meta: $${targetPrice.toLocaleString()})`, inline: false },
                    { name: '📈 Rentabilidade Global', value: `Lucro estimado de **$${Math.round(totalEstimatedProfitPerHour).toLocaleString()} por hora** de gameplay ativa.`, inline: false },
                    { name: '⏱️ Tempo Estimado para a Meta', value: `Aprox. **${Math.floor(totalMinutesNeeded / 60)} horas e ${totalMinutesNeeded % 60} minutos** jogando de forma eficiente.`, inline: false },
                    { name: '🔄 Atividades Recomendadas (Quantidades)', value: planSummary || 'Nenhum negócio lucrativo selecionado.', inline: false },
                    { name: '📋 Ordem de Execução Eficiente', value: recommendedOrder || 'Nenhuma ordem definida.', inline: false },
                    { name: '💡 Dicas de Ouro para Otimizar', value: '• **Aproveite Cooldowns:** Faça Cayo Perico ou Contratos da Agência enquanto seus negócios passivos (Boate, Acid Lab e Bunker) produzem no fundo.\n• **Sessões Convite:** Sempre faça missões de venda e preparação em sessões somente para convidados para evitar griefer/PvP indesejado.\n• **Priorize o Acid Lab e Cayo:** São atualmente as fontes de maior retorno financeiro para jogadores solo.', inline: false }
                )
                .setFooter({ text: 'Nexus Bot • Planejador Financeiro Avançado' })
                .setTimestamp();

            await i.editReply({ content: '✅ **Planejamento concluído com sucesso!**', embeds: [resultEmbed], components: [] });
        });
    },
};
