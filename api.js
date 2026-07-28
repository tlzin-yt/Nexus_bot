const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Rota para buscar todos os veículos de GTA Online direto da base da comunidade
app.get('/api/veiculos', async (req, res) => {
    try {
        // Usando fetch nativo do Node.js para puxar os dados da API pública do GTA V
        const response = await fetch('https://gtav-vehicle-database.vercel.app/api/vehicles');
        const data = await response.json();

        return res.json({
            sucesso: true,
            total: Array.isArray(data) ? data.length : 0,
            veiculos: data
        });
    } catch (error) {
        return res.status(500).json({
            sucesso: false,
            erro: 'Não foi possível carregar a lista de veículos no momento.'
        });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 API de veículos do GTA rodando na porta ${PORT}`);
});
