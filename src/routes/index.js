const express = require('express');
const authRoutes = require('./authRoutes');
const residuoRoutes = require('./residuoRoutes');
const transacaoRoutes = require('./transacaoRoutes');
const usuarioRoutes = require('./usuarioRoutes'); // <-- IMPORTAÇÃO DA NOVA ROTA

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/residuos', residuoRoutes);
router.use('/transacoes', transacaoRoutes);
router.use('/usuarios', usuarioRoutes); // <-- REGISTRO DA ROTA NO SISTEMA

module.exports = router;