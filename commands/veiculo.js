const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('veiculo')
        .setDescription('Busca informações de qualquer veículo do GTA Online na API')
        .addStringOption(option =>
            option.setName('nome')
                .setDescription('Nome do veículo que você quer procurar')
                .setRequired(true)),

    async execute(interaction) {
        // Deixa o bot "pensando" para evitar o erro de timeout de 3 segundos do Discord
        await interaction.deferReply();

        const nomePesquisado = interaction.options.getString('nome').toLowerCase();

        try {
            // Puxa os dados da sua própria API rodando no Render (ou use localhost se estiver testando local)
            const respostaApi = await fetch('https://nexus-bot-55ha.onrender.com/api/veiculos');
            const dados = await respostaApi.json();

            if (!dados.sucesso || !dados.veiculos) {
                return interaction.editReply('❌ Erro ao se conectar com a base de dados dos veículos.');
            }

            // Procura o veículo na lista completa da API (procura por partes do nome)
            const veiculoEncontrado = dados.veiculos.find(v => 
                v.nome.toLowerCase().includes(nomePesquisado)
            );

            if (!veiculoEncontrado) {
                return interaction.editReply(`❌ O veículo **"${nomePesquisado}"** não foi encontrado na base de dados geral.`);
            }

            // Formata o preço para o padrão em dinheiro (Ex: $1,420,000)
            const precoFormatado = veiculoEncontrado.preco 
                ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(veiculoEncontrado.preco) 
                : 'Preço indisponível';

            // Cria um Embed bonito para enviar no chat
            const embed = new EmbedBuilder()
                .setTitle(`🚗 ${veiculoEncontrado.nome}`)
                .setColor('#00FF00')
                .addFields(
                    { name: 'Categoria', value: veiculoEncontrado.categoria || 'Geral', inline: true },
                    { name: 'Preço', value: precoFormatado, inline: true },
                    { name: 'Loja / Fabricante', value: veiculoEncontrado.fabricante || 'Desconhecido', inline: true }
                )
                .setTimestamp();

            return interaction.editReply({ embeds: [embed] });

        } catch (error) {
            console.error(error);
            return interaction.editReply('❌ Ocorreu um erro ao tentar buscar o veículo.');
        }
    },
};
