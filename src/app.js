const express = require('express');
const cors = require('cors');
const routes = require('./routes');

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

app.use('/api', routes);

app.get('/', (req, res) => {
    res.json({ message: 'Bem vindo à API Revalor Marketplace.' });
});

module.exports = app;