const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Conecta ou cria o banco de dados SQLite local
const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.message);
    } else {
        console.log('📦 Conectado ao banco de dados SQLite com sucesso.');
    }
});

// Cria a tabela de veículos se ela não existir
db.run(`CREATE TABLE IF NOT EXISTS veiculos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    categoria TEXT,
    preco REAL NOT NULL,
    dono TEXT
)`);

// Rota GET: Listar todos os veículos salvos no banco
app.get('/api/veiculos', (req, res) => {
    db.all(`SELECT * FROM veiculos`, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ sucesso: false, erro: err.message });
        }
        return res.json({
            sucesso: true,
            total: rows.length,
            veiculos: rows
        });
    });
});

// Rota POST: Cadastrar um novo veículo no banco de dados
app.post('/api/veiculos', (req, res) => {
    const { nome, categoria, preco, dono } = req.body;

    if (!nome || !preco) {
        return res.status(400).json({ sucesso: false, erro: 'Nome e preço são obrigatórios!' });
    }

    const query = `INSERT INTO veiculos (nome, categoria, preco, dono) VALUES (?, ?, ?, ?)`;
    db.run(query, [nome, categoria || 'Geral', parseFloat(preco), dono || 'Desconhecido'], function(err) {
        if (err) {
            return res.status(500).json({ sucesso: false, erro: err.message });
        }
        return res.status(201).json({
            sucesso: true,
            mensagem: 'Veículo cadastrado no banco de dados com sucesso!',
            veiculo: {
                id: this.lastID,
                nome,
                categoria: categoria || 'Geral',
                preco: parseFloat(preco),
                dono: dono || 'Desconhecido'
            }
        });
    });
});

app.listen(PORT, () => {
    console.log(`🚀 API com Banco de Dados rodando na porta ${PORT}`);
});
