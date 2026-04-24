const express = require('express');
const transacaoController = require('../controllers/transacaoController');
const { verifyToken, isEmpresa } = require('../middlewares/auth');

const router = express.Router();

// Apenas EMPRESA pode iniciar checkout/transação
router.post('/checkout', verifyToken, isEmpresa, transacaoController.iniciarCheckout);

module.exports = router;
