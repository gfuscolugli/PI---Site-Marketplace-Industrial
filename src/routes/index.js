const express = require('express');
const authRoutes = require('./authRoutes');
const residuoRoutes = require('./residuoRoutes');
const transacaoRoutes = require('./transacaoRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/residuos', residuoRoutes);
router.use('/transacoes', transacaoRoutes);

module.exports = router;
