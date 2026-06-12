const { Residuo } = require('../models');

const TAXA_PLATAFORMA = 0.05; // 5%

const calcularTransacao = async (residuo_id, pesoDesejado) => {
  const residuo = await Residuo.findByPk(residuo_id);
  if (!residuo) {
    throw new Error('Resíduo não encontrado.');
  }

  if (pesoDesejado <= 0 || pesoDesejado > residuo.pesoDisponivel) {
    throw new Error('Peso desejado inválido ou maior que o disponível.');
  }

  // =========================================================================
  // MATEMÁTICA CORRIGIDA: Transforma a Tonelada (pesoDesejado) em Quilos (* 1000)
  // antes de multiplicar pelo preço base (valorPorKg).
  // =========================================================================
  const valorBruto = (pesoDesejado * 1000) * residuo.valorPorKg;
  const valorTaxa = valorBruto * TAXA_PLATAFORMA;
  const valorTotal = valorBruto + valorTaxa;

  return {
    residuo,
    valorBruto,
    valorTaxa,
    valorTotal
  };
};

module.exports = {
  calcularTransacao,
  TAXA_PLATAFORMA
};