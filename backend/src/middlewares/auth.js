const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ message: 'Nenhum token fornecido.' });

  const bearerToken = token.split(' ')[1] || token;

  try {
    const decoded = jwt.verify(bearerToken, process.env.JWT_SECRET);
    req.usuarioId = decoded.id;
    req.usuarioTipo = decoded.tipo;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Acesso não autorizado. Token inválido.' });
  }
};

const isIndustria = (req, res, next) => {
  if (req.usuarioTipo !== 'INDUSTRIA') {
    return res.status(403).json({ message: 'Acesso negado. Requer perfil INDUSTRIA.' });
  }
  next();
};

const isEmpresa = (req, res, next) => {
  if (req.usuarioTipo !== 'EMPRESA') {
    return res.status(403).json({ message: 'Acesso negado. Requer perfil EMPRESA.' });
  }
  next();
};

module.exports = {
  verifyToken,
  isIndustria,
  isEmpresa
};
