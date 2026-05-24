const express = require('express');
const cors = require('cors');
const routes = require('./routes');
// ALTERAÇÃO 1: Importando o 'path' do Node.js para trabalhar com os caminhos de pastas
const path = require('path'); 

const app = express();

// Configuração robusta do CORS adicionada aqui
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ALTERAÇÃO 2: Configurando a pasta 'uploads' como estática (pública) para o Front-end conseguir ler as imagens
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api', routes);

app.get('/', (req, res) => {
    res.json({ message: 'Bem vindo à API Revalor Marketplace.' });
});

module.exports = app;