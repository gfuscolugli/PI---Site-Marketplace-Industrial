const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const path = require('path'); 

const app = express();

// Configuração corrigida: aceita as duas portas que o Vite pode usar
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurando a pasta 'uploads' como estática
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api', routes);

app.get('/', (req, res) => {
    res.json({ message: 'Bem vindo à API Revalor Marketplace.' });
});

module.exports = app;