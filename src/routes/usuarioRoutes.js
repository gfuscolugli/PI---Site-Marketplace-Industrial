const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

// Importa o middleware do multer que vocês já criaram
const upload = require('../middlewares/upload');

// Rota PUT para receber a imagem. O front-end vai enviar o arquivo no campo chamado "logo"
router.put('/:id/logo', upload.single('logo'), usuarioController.uploadLogo);
router.put('/:id', usuarioController.atualizarDados);

module.exports = router;
