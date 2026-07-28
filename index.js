const express = require('express');
const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());

// Rota da API de veículos integrada
app.get('/api/veiculos', async (req, res) => {
    try {
        const response = await fetch('https://gtav-vehicle-database.vercel.app/api/vehicles');
        const data = await response.json();
        return res.json({
            sucesso: true,
            total: Array.isArray(data) ? data.length : 0,
            veiculos: data
        });
    } catch (error) {
        return res.status(500).json({ sucesso: false, erro: 'Erro ao carregar veículos.' });
    }
});

// Inicia o servidor web na porta exigida pelo Render
app.listen(PORT, () => {
    console.log(`🚀 Servidor e API rodando na porta ${PORT}`);
});

// A partir daqui você inicia o seu bot do Discord normalmente (ex: client.login(...))
client.login(process.env.TOKEN);
