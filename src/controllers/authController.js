const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Usuario, Telefone } = require('../models');

const register = async (req, res) => {
  try {
    const { nome, email, senha, tipo, telefones } = req.body;

    if (!nome || !email || !senha || !tipo) {
      return res.status(400).json({ message: 'Todos os campos obrigatórios devem ser preenchidos.' });
    }

    if (tipo !== 'INDUSTRIA' && tipo !== 'EMPRESA') {
      return res.status(400).json({ message: 'Tipo de usuário inválido. Use INDUSTRIA ou EMPRESA.' });
    }

    const usuarioExiste = await Usuario.findOne({ where: { email } });
    if (usuarioExiste) {
      return res.status(400).json({ message: 'Email já cadastrado.' });
    }

    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(senha, salt);

    const novoUsuario = await Usuario.create({
      nome,
      email,
      senhaHash,
      tipo
    });

    if (telefones && Array.isArray(telefones)) {
      const telefoneRecords = telefones.map(numero => ({
        numero,
        usuario_id: novoUsuario.id
      }));
      await Telefone.bulkCreate(telefoneRecords);
    }

    return res.status(201).json({
      message: 'Usuário cadastrado com sucesso!',
      usuario: {
        id: novoUsuario.id,
        nome: novoUsuario.nome,
        email: novoUsuario.email,
        tipo: novoUsuario.tipo
      }
    });

  } catch (error) {
    console.error('Erro no registro:', error);
    return res.status(500).json({ message: 'Erro interno ao cadastrar usuário.' });
  }
};

const login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
    }

    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senhaHash);
    if (!senhaValida) {
      return res.status(401).json({ message: 'Senha incorreta.' });
    }

    const token = jwt.sign(
      { id: usuario.id, tipo: usuario.tipo },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    return res.status(200).json({
      message: 'Login realizado com sucesso.',
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        tipo: usuario.tipo
      }
    });

  } catch (error) {
    console.error('Erro no login:', error);
    return res.status(500).json({ message: 'Erro interno ao realizar login.' });
  }
};

module.exports = {
  register,
  login
};
