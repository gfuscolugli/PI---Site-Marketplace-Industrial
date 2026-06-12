const express = require('express');
const transacaoController = require('../controllers/transacaoController');
const { verifyToken} = require('../middlewares/auth');

const router = express.Router();

router.post('/checkout', verifyToken, transacaoController.iniciarCheckout);
router.get('/', verifyToken, transacaoController.listarMinhasTransacoes);
// Rota para o Front-end puxar o saldo da Empresa
router.get('/saldo', verifyToken, transacaoController.buscarSaldoEmpresa);
router.post('/financeiro', verifyToken, transacaoController.processarFinanceiro);

// =========================================================================
// Rota que o botão "Simular Pagamento" do Front-end vai chamar
// =========================================================================
router.post('/simular-pagamento', verifyToken, transacaoController.simularPagamentoTeste);

module.exports = router;