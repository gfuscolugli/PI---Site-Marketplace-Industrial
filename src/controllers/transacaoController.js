const { Transacao, Residuo } = require('../models');
const transacaoService = require('../services/transacaoService');

const iniciarCheckout = async (req, res) => {
  try {
    const empresa_id = req.usuarioId;
    const { residuo_id, pesoComprado } = req.body;

    if (!residuo_id || !pesoComprado) {
      return res.status(400).json({ message: 'residuo_id e pesoComprado são obrigatórios.' });
    }

    // A regra de negócio e cálulo fica isolada no service
    const calculo = await transacaoService.calcularTransacao(residuo_id, pesoComprado);

    // Cria a transação no banco
    const novaTransacao = await Transacao.create({
      pesoComprado,
      valorBruto: calculo.valorBruto,
      taxaPlataforma: transacaoService.TAXA_PLATAFORMA,
      valorTotal: calculo.valorTotal,
      status: 'CRIADA',
      empresa_id,
      residuo_id
    });

    // Opcional: Abater o peso disponível do resíduo ou deixar em "Reserva"
    calculo.residuo.pesoDisponivel -= pesoComprado;
    await calculo.residuo.save();

    return res.status(201).json({
      message: 'Transação iniciada com sucesso!',
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

module.exports = {
  iniciarCheckout
};
