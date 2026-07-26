const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ComponentType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('negocios')
        .setDescription('Painel interativo completo com todos os negócios e golpes do GTA Online.'),

    async execute(interaction) {
        await interaction.deferReply();

        const embed = new EmbedBuilder()
            .setColor('#002B49')
            .setTitle('💼 Painel de Negócios e Golpes - GTA Online')
            .setDescription('Selecione abaixo na lista qual negócio ou golpe você deseja consultar para ver lucros, tempos e links para os guias oficiais e atualizados.')
            .setTimestamp();

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('select_negocio_' + interaction.id) // ID único para evitar conflitos
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

        const response = await interaction.editReply({ embeds: [embed], components: [row] });

        // Coletor exclusivo para esta mensagem (evita qualquer erro de timeout global)
        const collector = response.createMessageComponentCollector({
            componentType: ComponentType.StringSelect,
            time: 300_000 // 5 minutos de durabilidade do painel
        });

        collector.on('collect', async i => {
            if (i.user.id !== interaction.user.id) {
                return i.reply({ content: '❌ Apenas quem usou o comando pode interagir com este painel.', ephemeral: true });
            }

            await i.deferUpdate();

            const choice = i.values[0];
            let newEmbed = new EmbedBuilder().setColor('#002B49').setTimestamp();

            if (choice === 'cayo') {
                newEmbed.setTitle('💰 Golpe de Cayo Perico - Guia & Estatísticas')
                    .setDescription('Consulte o guia detalhado e atualizado no [GTABase - Cayo Perico Guide](https://www.gtabase.com/gta-online/heists/the-cayo-perico-heist) ou no [Newswire da Rockstar](https://www.rockstargames.com/gta-online).')
                    .addFields(
                        { name: '💵 Lucro Médio', value: '$1.2M - $1.5M', inline: true },
                        { name: '🏆 Lucro Máximo', value: 'Aprox. $1.9M', inline: true },
                        { name: '⏱️ Tempo de Preparação', value: '45 a 60 minutos', inline: true },
                        { name: '⏳ Cooldown', value: '48 min (Solo) / 144 min (Se repetir solo)', inline: true },
                        { name: '💎 Alvos Principais', value: 'Panther Statue ou Madrazo Files', inline: false },
                        { name: '💡 Dicas', value: 'Abordagem pelo túnel de drenagem com Kosatka/Longfin.', inline: false });
            } 
            else if (choice === 'cluckin') {
                newEmbed.setTitle('🐔 Cluckin\' Bell Farm Raid - Guia')
                    .setDescription('Guia oficial e estratégias em [IGN GTA Online Guides](https://www.ign.com/wikis/gta-5/The_Cluckin_Bell_Farm_Raid).')
                    .addFields(
                        { name: '💵 Pagamento', value: '$500.000 fixo', inline: true },
                        { name: '⏱️ Tempo Médio', value: '45 a 50 minutos', inline: true },
                        { name: '🚀 Estratégia', value: 'Missões diretas e rápidas, ótimo para iniciantes.', inline: false });
            }
            else if (choice === 'agencia') {
                newEmbed.setTitle('🏢 Agência de Segurança - Painel')
                    .setDescription('Informações completas em [GTABase - The Contract](https://www.gtabase.com/gta-online/dlc/the-contract).')
                    .addFields(
                        { name: '🎵 Contrato VIP (Dr. Dre)', value: 'Pagamento de $1.000.000 (1h a 1h30m de duração).', inline: false },
                        { name: '📝 Contratos', value: 'Gera até $20.000/dia passivo no cofre.', inline: false });
            }
            else if (choice === 'boate') {
                newEmbed.setTitle('🕺 Boate (Nightclub) - Gestão de Lucros')
                    .setDescription('Guia de rendimento passivo em [GTABase Nightclubs](https://www.gtabase.com/gta-online/guides/gta-online-nightclub-guide-all-profits-popularity).')
                    .addFields(
                        { name: '💰 Cofre', value: 'Até $250.000 mantendo alta popularidade.', inline: true },
                        { name: '📦 Depósito', value: 'Produção automática vinculada a outros negócios.', inline: true });
            }
            else if (choice === 'bunker') {
                newEmbed.setTitle('🎯 Bunker - Armas e Suprimentos')
                    .setDescription('Estratégias de comércio de armas em [GTABase Gunrunning](https://www.gtabase.com/gta-online/businesses/bunker).')
                    .addFields(
                        { name: '⏱️ Produção', value: '2h20m por barra cheia de suprimentos.', inline: true },
                        { name: '💵 Valor de Venda', value: 'Até $1.050.000 (venda distante).', inline: true });
            }
            else if (choice === 'acidlab') {
                newEmbed.setTitle('🧪 Laboratório de Ácido (Acid Lab)')
                    .setDescription('Detalhes da expansão Los Santos Drug Wars em [Rockstar Newswire](https://www.rockstargames.com/gta-online/los-santos-drug-wars).')
                    .addFields(
                        { name: '💵 Valor Máximo', value: 'Aprox. $335.000', inline: true },
                        { name: '📈 Lucro', value: 'Excelente retorno de tempo e investimento para solos.', inline: true });
            }
            else if (choice === 'ferrovelho') {
                newEmbed.setTitle('🚗 Ferro-Velho (Salvage Yard)')
                    .setDescription('Guia de roubos em [GTABase Salvage Yard](https://www.gtabase.com/gta-online/businesses/salvage-yard).')
                    .addFields(
                        { name: '💵 Pagamento', value: '$300.000 a $400.000 por veículo roubado.', inline: true },
                        { name: '🛠️ Guinchos', value: 'Faça os reboques para aumentar o cofre passivo.', inline: true });
            }
            else if (choice === 'hangar') {
                newEmbed.setTitle('✈️ Hangar - Tráfico Aéreo e Terrestre')
                    .setDescription('Estratégias de contrabando em [GTABase Smuggler\'s Run](https://www.gtabase.com/gta-online/businesses/hangar).')
                    .addFields(
                        { name: '📦 Melhores Cargas', value: 'Chemicals e Narcotics para maiores bônus.', inline: true },
                        { name: '🐓 Funcionário', value: 'Contrate o Rooster para buscar caixas automaticamente.', inline: true });
            }
            else if (choice === 'autoshop') {
                newEmbed.setTitle('🔧 Auto Shop - Contratos & Serviços')
                    .setDescription('Guia de contratos em [GTABase Los Santos Tuners](https://www.gtabase.com/gta-online/businesses/auto-shop).')
                    .addFields(
                        { name: '💵 Pagamento', value: '$150.000 a $300.000 por contrato.', inline: true },
                        { name: '⭐ Melhor Missão', value: 'The Union Depository Contract.', inline: true });
            }

            await i.editReply({ embeds: [newEmbed], components: [row] });
        });
    },
};
