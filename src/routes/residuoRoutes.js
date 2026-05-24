const express = require('express');
const residuoController = require('../controllers/residuoController');
const { verifyToken, isIndustria } = require('../middlewares/auth');

// 1. IMPORTAÇÃO: Trazendo o middleware do Multer que criamos no Passo 2
const upload = require('../middlewares/upload'); 

const router = express.Router();

// Apenas ler lista (Empresa e Industria podem)
router.get('/', verifyToken, residuoController.listarResiduos);

// Ler APENAS os resíduos da empresa logada
router.get('/meus', verifyToken, isIndustria, residuoController.listarMeusResiduos);

// Apenas INDUSTRIA pode cadastrar
// 2. ATUALIZAÇÃO: Adicionamos o upload.single('imagem') ANTES do controller
router.post('/', verifyToken, isIndustria, upload.single('imagem'), residuoController.criarResiduo);

module.exports = router;