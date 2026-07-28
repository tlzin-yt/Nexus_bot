const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

let veiculosDB = [
    { id: 1, nome: 'Ocelot Pariah', categoria: 'Esportivo', preco: 1420000, dono: 'Tlzin' },
    { id: 2, nome: 'Pegassi Toreador', categoria: 'Combativo', preco: 3660000, dono: 'Tlzin' }
];

app.get('/api/veiculos', (req, res) => {
    return res.json({
        sucesso: true,
        total: veiculosDB.length,
        veiculos: veiculosDB
    });
});

app.post('/api/veiculos', (req, res) => {
    const { nome, categoria, preco, dono } = req.body;

    if (!nome || !preco) {
        return res.status(400).json({ sucesso: false, erro: 'Nome e preço são obrigatórios!' });
    }

    const novoVeiculo = {
        id: veiculosDB.length + 1,
        nome,
        categoria: categoria || 'Geral',
        preco: parseFloat(preco),
        dono: dono || 'Desconhecido'
    };

    veiculosDB.push(novoVeiculo);

    return res.status(201).json({
        sucesso: true,
        mensagem: 'Veículo cadastrado com sucesso!',
        veiculo: novoVeiculo
    });
});

app.listen(PORT, () => {
    console.log(`🚀 API rodando na porta ${PORT}`);
});
