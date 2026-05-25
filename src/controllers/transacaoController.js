const models = require('../models');

// O seu sistema usa 'Usuario' para representar a empresa logada.
const Transacao = models.Transacao || models.transacao;
const Residuo = models.Residuo || models.residuo;
const Usuario = models.Usuario || models.usuario;

const transacaoService = require('../services/transacaoService');
const { MercadoPagoConfig, Payment } = require('mercadopago');
const { Op } = require('sequelize');

const iniciarCheckout = async (req, res) => {
  try {
    const empresa_id = req.usuarioId; // ID de quem está comprando
    const { residuo_id, pesoComprado } = req.body;

    if (!residuo_id || !pesoComprado) {
      return res.status(400).json({ message: 'residuo_id e pesoComprado são obrigatórios.' });
    }

    // 1. Busca o resíduo direto da fonte no banco
    const residuoNoBanco = await Residuo.findByPk(residuo_id);
    
    if (!residuoNoBanco) {
      return res.status(404).json({ message: 'Resíduo não encontrado no sistema.' });
    }

    // =========================================================================
    // O MISTÉRIO RESOLVIDO: O dono do resíduo fica na coluna industria_id
    // =========================================================================
    const donoDoResiduo = residuoNoBanco.industria_id;

    if (!donoDoResiduo) {
      return res.status(400).json({ 
        message: 'Erro interno: Resíduo sem dono (industria_id não encontrado).' 
      });
    }

    // Trava de Auto-Boicote
    if (String(empresa_id) === String(donoDoResiduo)) {
      return res.status(400).json({ message: 'Você não pode comprar um resíduo publicado pela sua própria empresa.' });
    }
    // =========================================================================

    const calculo = await transacaoService.calcularTransacao(residuo_id, pesoComprado);

    // 2. CRIA A TRANSAÇÃO PARA O COMPRADOR (SAÍDA)
    const novaTransacao = await Transacao.create({
      pesoComprado,
      valorBruto: calculo.valorBruto,
      taxaPlataforma: transacaoService.TAXA_PLATAFORMA,
      valorTotal: calculo.valorTotal,
      status: 'CONCLUIDA',
      tipo: 'COMPRA',
      empresa_id: empresa_id, 
      usuario_id: empresa_id, // Preenche ambos para o front-end achar fácil
      residuo_id
    });

    // 3. CRIA A TRANSAÇÃO PARA O VENDEDOR (ENTRADA)
    await Transacao.create({
      pesoComprado,
      valorBruto: calculo.valorBruto,
      taxaPlataforma: transacaoService.TAXA_PLATAFORMA,
      valorTotal: calculo.valorTotal,
      status: 'CONCLUIDA',
      tipo: 'VENDA', 
      empresa_id: donoDoResiduo, 
      usuario_id: donoDoResiduo, 
      residuo_id
    });

    // 4. ATUALIZA O ESTOQUE DO RESÍDUO
    calculo.residuo.pesoDisponivel -= pesoComprado;
    await calculo.residuo.save();

    // 5. DEBITA O SALDO DO COMPRADOR
    const usuarioComprador = await Usuario.findByPk(empresa_id);
    if (!usuarioComprador) {
      return res.status(404).json({ message: 'Usuário comprador não encontrado.' });
    }
    usuarioComprador.saldo = Number(usuarioComprador.saldo || 0) - Number(calculo.valorTotal);
    await usuarioComprador.save();

    // 6. CREDITA O SALDO DO VENDEDOR
    const usuarioVendedor = await Usuario.findByPk(donoDoResiduo);
    if (!usuarioVendedor) {
      return res.status(404).json({ message: 'Usuário vendedor não encontrado.' });
    }
    usuarioVendedor.saldo = Number(usuarioVendedor.saldo || 0) + Number(calculo.valorTotal);
    await usuarioVendedor.save();

    return res.status(201).json({
      message: 'Transação concluída com sucesso!',
      transacao: novaTransacao 
    });

  } catch (error) {
    console.error('Erro ao iniciar checkout:', error);
    if (error.message === 'Resíduo não encontrado.' || error.message === 'Peso desejado inválido ou maior que o disponível.') {
        return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Erro interno ao iniciar transação.' });
  }
};

const listarMinhasTransacoes = async (req, res) => {
  try {
    const id = req.usuarioId; 
    const transacoes = await Transacao.findAll({
      where: {
        [Op.or]: [
          { usuario_id: id },
          { empresa_id: id }
        ]
      },
      include: [
        {
          model: Residuo,
          as: 'residuo', 
          attributes: ['nome'] 
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    return res.status(200).json(transacoes);
  } catch (error) {
    console.error('Erro ao listar transações:', error);
    return res.status(500).json({ message: 'Erro interno ao buscar histórico.' });
  }
};

const processarFinanceiro = async (req, res) => {
  try {
    const { tipo, valor, metodo } = req.body;
    const emailTeste = "teste@revalor.com.br"; 

    if (tipo === 'DEPOSITO' && metodo === 'PIX') {
      const client = new MercadoPagoConfig({ accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN });
      const payment = new Payment(client);

      const respostaMP = await payment.create({
        body: {
          transaction_amount: Number(valor),
          description: 'Depósito - Carteira Revalor',
          payment_method_id: 'pix',
          payer: {
            email: emailTeste,
            first_name: "Guilherme",
            last_name: "Fusco",
            identification: {
              type: "CPF",
              number: "19119119100" 
            }
          }
        }
      });

      return res.json({
        message: 'PIX gerado com sucesso!',
        qr_code: respostaMP.point_of_interaction.transaction_data.qr_code,
        qr_code_base64: respostaMP.point_of_interaction.transaction_data.qr_code_base64,
        id_pagamento: respostaMP.id
      });
    }

    return res.status(400).json({ 
      message: `A função de ${tipo} via ${metodo} será implementada em breve!` 
    });

  } catch (error) {
    console.error('Erro ao conectar com Mercado Pago:', error);
    res.status(500).json({ message: 'Erro interno ao processar transação financeira.' });
  }
};

const simularPagamentoTeste = async (req, res) => {
  try {
    const id = req.usuarioId; 
    const { valor } = req.body;

    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    usuario.saldo = Number(usuario.saldo || 0) + Number(valor);
    await usuario.save();

    return res.status(200).json({ 
      message: 'Pagamento simulado com sucesso! Dinheiro na conta.',
      novoSaldo: usuario.saldo
    });
  } catch (error) {
    console.error('Erro ao simular pagamento:', error);
    return res.status(500).json({ message: 'Erro interno ao simular.' });
  }
};

const buscarSaldoEmpresa = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.usuarioId);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }
    return res.status(200).json({ saldo: usuario.saldo || 0 });
  } catch (error) {
    console.error('Erro ao buscar saldo:', error);
    return res.status(500).json({ message: 'Erro interno ao buscar saldo.' });
  }
};

module.exports = {
  iniciarCheckout,
  listarMinhasTransacoes,
  processarFinanceiro,
  simularPagamentoTeste,
  buscarSaldoEmpresa 
};