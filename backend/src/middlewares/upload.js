const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Salva na pasta 'uploads' na raiz do projeto
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        // Cria um nome único para a imagem (Data atual + nome original)
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

module.exports = upload;