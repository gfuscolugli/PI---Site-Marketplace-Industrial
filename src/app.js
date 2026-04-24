const express = require('express');
const cors = require('cors');
const routes = require('./routes');

const app = express();

const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', routes);

app.get('/', (req, res) => {
  res.json({ message: 'Bem vindo à API Revalor Marketplace.' });
});

module.exports = app;
