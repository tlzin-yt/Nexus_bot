const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ComponentType } = require('discord.js');

const BUSINESS_DATA = {
    cayo: { name: 'Cayo Perico Heist', profit: 1350000, time: 60, type: 'Golpe' },
    cluckin: { name: 'Cluckin\' Bell Farm Raid', profit: 500000, time: 45, type: 'Golpe' },
    agencia: { name: 'Agência (Dr. Dre Contract)', profit: 1000000, time: 75, type: 'Contrato VIP' },
    boate: { name: 'Boate (Nightclub - Depósito Full)', profit: 400000, time: 120, type: 'Passivo/Venda' },
    bunker: { name: 'Bunker (Venda Distante)', profit: 1050000, time: 140, type: 'Negócio' },
    acidlab: { name: 'Laboratório de Ácido', profit: 335000, time: 180, type: 'Passivo/Venda' },
    ferrovelho: { name: 'Ferro-Velho (Salvage Yard)', profit: 350000, time: 30, type: 'Roubo' },
    hangar: { name: 'Hangar (Carga de Narcóticos/Químicos)', profit: 850000, time: 90, type: 'Contrabando' },
    escritorio: { name: 'Escritório (Exportação de Veículos)', profit: 80000, time: 20, type: 'Veículos' },
    autoshop: { name: 'Auto Shop (Contratos)', profit: 250000, time: 25, type: 'Contrato' },
    documentos: { name: 'Oficina de Falsificação de Documentos', profit: 90000, time: 180, type: 'MC Business' },
    dinheiro: { name: 'Fábrica de Dinheiro Falso', profit: 160000, time: 180, type: 'MC Business' },
    metanfetamina: { name: 'Laboratório de Metanfetamina', profit: 230000, time: 180, type: 'MC Business' },
    cocaina: { name: 'Plantação de Cocaína', profit: 420000, time: 180, type: 'MC Business' },
    maconha: { name: 'Plantação de Maconha', profit: 150000, time: 180, type: 'MC Business' }
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('planejar')
        .setDescription('Planejador financeiro inteligente com painel interativo para o GTA Online.'),

    async execute(interaction) {
        // Criação do Modal (Painel de Formulário na tela) para capturar os valores sem digitar no chat
        const modal = new ModalBuilder()
            .setCustomId('modal_planejar_' + interaction.user.id)
            .setTitle('💼 Planejador Financeiro - GTA Online');

        const moneyInput = new TextInputBuilder()
            .setCustomId('current_money')
            .setLabel('Quanto dinheiro você possui atualmente?')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('Ex: 1500000 (Apenas números)')
            .setRequired(true);

        const targetInput = new TextInputBuilder()
            .setCustomId('target_price')
            .setLabel('Quanto custa o item que deseja comprar?')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('Ex: 8500000 (Apenas números)')
            .setRequired(true);

        modal.addComponents(
            new ActionRowBuilder().addComponents(moneyInput),
            new ActionRowBuilder().addComponents(targetInput)
        );

        // Exibe o painel modal para o usuário
        await interaction.showModal(modal);

        try {
            // Aguarda o envio do formulário (Modal Submit)
            const modalInteraction = await interaction.awaitModalSubmit({
                filter: i => i.customId === 'modal_planejar_' + interaction.user.id && i.user.id === interaction.user.id,
                time: 120000
            });

            const currentMoney = parseFloat(modalInteraction.fields.getTextInputValue('current_money').replace(/[^0-9.]/g, '')) || 0;
            const targetPrice = parseFloat(modalInteraction.fields.getTextInputValue('target_price').replace(/[^0-9.]/g, '')) || 0;
            const moneyNeeded = Math.max(0, targetPrice - currentMoney);

            // Cria o menu de seleção múltipla dos negócios
            const selectMenu = new StringSelectMenuBuilder()
                .setCustomId('select_negocios_multi_' + interaction.user.id)
                .setPlaceholder('Selecione todos os negócios que você possui...')
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

            const response = await modalInteraction.reply({
                content: `🎯 Meta Definida: **$${targetPrice.toLocaleString()}** | Saldo Atual: **$${currentMoney.toLocaleString()}**\n📉 Falta: **$${moneyNeeded.toLocaleString()}**\n\n🏢 **Passo Final:** Selecione abaixo **todos os negócios** que você possui no menu multiselect:`,
                components: [row],
                fetchReply: true
            });

            // Coletor para processar as opções do menu selecionadas
            const collectorMenu = response.createMessageComponentCollector({
                componentType: ComponentType.StringSelect,
                time: 60000
            });

            collectorMenu.on('collect', async i => {
                if (i.user.id !== interaction.user.id) {
                    return i.reply({ content: '❌ Apenas quem iniciou o comando pode selecionar.', ephemeral: true });
                }

                await i.deferUpdate();
                collectorMenu.stop();

                const selectedKeys = i.values;
                let totalEstimatedProfitPerHour = 0;
                let userBusinesses = selectedKeys.map(key => {
                    const b = BUSINESS_DATA[key];
                    const profitPerHour = (b.profit / b.time) * 60;
                    return { key, ...b, profitPerHour };
                }).sort((a, b) => b.profitPerHour - a.profitPerHour);

                userBusinesses.forEach(b => {
                    totalEstimatedProfitPerHour += b.profitPerHour;
                });

                const hoursNeeded = totalEstimatedProfitPerHour > 0 ? moneyNeeded / totalEstimatedProfitPerHour : 0;
                const totalMinutesNeeded = Math.round(hoursNeeded * 60);

                let executionPlan = [];
                let accumulatedSimulatedProfit = 0;

                while (accumulatedSimulatedProfit < moneyNeeded && userBusinesses.length > 0) {
                    for (let b of userBusinesses) {
                        if (accumulatedSimulatedProfit >= moneyNeeded) break;
                        let existing = executionPlan.find(item => item.name === b.name);
                        if (existing) {
                            existing.count += 1;
                        } else {
                            executionPlan.push({ name: b.name, count: 1, profit: b.profit });
                        }
                        accumulatedSimulatedProfit += b.profit;
                    }
                    if (totalEstimatedProfitPerHour <= 0) break;
                }

                const planSummary = executionPlan.map(item => `• **${item.count}x** - ${item.name} (Gera acumulado de $${(item.count * item.profit).toLocaleString()})`).join('\n');
                const recommendedOrder = userBusinesses.map((b, index) => `${index + 1}. ${b.name}`).join(' ➔ ');

                const resultEmbed = new EmbedBuilder()
                    .setColor('#002B49')
                    .setTitle('📊 Plano Financeiro Inteligente - GTA Online')
                    .setDescription('Estratégia otimizada calculada através do painel interativo.')
                    .addFields(
                        { name: '📉 Dinheiro Faltante', value: `**$${moneyNeeded.toLocaleString()}** (Meta: $${targetPrice.toLocaleString()})`, inline: false },
                        { name: '📈 Rentabilidade Global', value: `Lucro estimado de **$${Math.round(totalEstimatedProfitPerHour).toLocaleString()} por hora** de gameplay ativa.`, inline: false },
                        { name: '⏱️ Tempo Estimado para a Meta', value: `Aprox. **${Math.floor(totalMinutesNeeded / 60)} horas e ${totalMinutesNeeded % 60} minutos** jogando de forma eficiente.`, inline: false },
                        { name: '🔄 Atividades Recomendadas (Quantidades)', value: planSummary || 'Nenhum negócio selecionado.', inline: false },
                        { name: '📋 Ordem de Execução Eficiente', value: recommendedOrder || 'Nenhuma ordem definida.', inline: false },
                        { name: '💡 Dicas de Ouro para Otimizar', value: '• **Aproveite Cooldowns:** Faça Cayo Perico ou Contratos da Agência enquanto seus negócios passivos (Boate, Acid Lab e Bunker) produzem no fundo.\n• **Sessões Convite:** Sempre faça missões de venda e preparação em sessões somente para convidados para evitar griefers.\n• **Priorize o Acid Lab e Cayo:** São atualmente as fontes de maior retorno financeiro para jogadores solo.', inline: false }
                    )
                    .setFooter({ text: 'Nexus Bot • Planejador Financeiro Avançado' })
                    .setTimestamp();

                await i.editReply({ content: '✅ **Planejamento concluído com painel interativo!**', embeds: [resultEmbed], components: [] });
            });

        } catch (err) {
            // Caso o modal expire (tempo esgotado)
            return;
        }
    },
};
