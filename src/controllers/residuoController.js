const { Residuo, Usuario } = require('../models');
const { Op } = require('sequelize');

// 1. Lista TODOS os resíduos (Marketplace)
const listarResiduos = async (req, res) => {
  try {
    const { estadoFisico, categorias, nome } = req.query;
    
    let filter = {};
    if (estadoFisico) filter.estadoFisico = estadoFisico;
    if (categorias) filter.categorias = { [Op.like]: `%${categorias}%` };
    if (nome) filter.nome = { [Op.like]: `%${nome}%` };

    const residuos = await Residuo.findAll({
      where: filter,
      include: [
        {
          model: Usuario,
          as: 'industria',
          attributes: ['id', 'nome', 'email']
        }
      ]
    });

    return res.status(200).json(residuos);
  } catch (error) {
    console.error('Erro ao listar resíduos:', error);
    return res.status(500).json({ message: 'Erro interno ao listar resíduos.' });
  }
};

// 2. Lista APENAS os resíduos da empresa logada
const listarMeusResiduos = async (req, res) => {
  try {
    const industria_id = req.usuarioId; // O ID vem do token de quem está logado

    const residuos = await Residuo.findAll({
      where: { industria_id }, // Filtra pelo ID da indústria
      include: [
        {
          model: Usuario,
          as: 'industria',
          attributes: ['id', 'nome', 'email']
        }
      ]
    });

    return res.status(200).json(residuos);
  } catch (error) {
    console.error('Erro ao listar meus resíduos:', error);
    return res.status(500).json({ message: 'Erro interno ao listar seus resíduos.' });
  }
};

// 3. Cria um novo resíduo
const criarResiduo = async (req, res) => {
  try {
    const industria_id = req.usuarioId; 
    const { nome, descricao, estadoFisico, categorias, pesoDisponivel, valorPorKg } = req.body;

    // Captura o nome do arquivo gerado pelo Multer middleware (se existir)
    const imagem_url = req.file ? req.file.filename : null;

    if (!nome || !estadoFisico || pesoDisponivel === undefined || valorPorKg === undefined) {
      return res.status(400).json({ message: 'Campos nome, estadoFisico, pesoDisponivel e valorPorKg são obrigatórios.' });
    }

    const novoResiduo = await Residuo.create({
      nome,
      descricao,
      estadoFisico,
      categorias,
      pesoDisponivel,
      valorPorKg,
      industria_id,
      imagem_url // Armazena a referência textual da imagem no banco de dados da Aiven
    });

    return res.status(201).json({
      message: 'Resíduo cadastrado com sucesso!',
      residuo: novoResiduo
    });
  } catch (error) {
    console.error('Erro ao criar resíduo:', error);
    return res.status(500).json({ message: 'Erro interno ao criar resíduo.' });
  }
};

module.exports = {
  listarResiduos,
  listarMeusResiduos,
  criarResiduo
};