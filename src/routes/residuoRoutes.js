const express = require('express');
const residuoController = require('../controllers/residuoController');
const { verifyToken, isIndustria } = require('../middlewares/auth');

const router = express.Router();

// Apenas ler lista (Empresa e Industria podem)
router.get('/', verifyToken, residuoController.listarResiduos);

// Ler APENAS os resíduos da empresa logada
router.get('/meus', verifyToken, isIndustria, residuoController.listarMeusResiduos);

// Apenas INDUSTRIA pode cadastrar
router.post('/', verifyToken, isIndustria, residuoController.criarResiduo);

module.exports = router;