'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Transacao extends Model {
    static associate(models) {
      Transacao.belongsTo(models.Usuario, { foreignKey: 'empresa_id', as: 'empresa' });
      Transacao.belongsTo(models.Residuo, { foreignKey: 'residuo_id', as: 'residuo' });
      
      // =========================================================================
      // PASSO 1B (ADIÇÃO): Ligação genérica para o dono da transação na carteira
      // =========================================================================
      Transacao.belongsTo(models.Usuario, { foreignKey: 'usuario_id', as: 'usuario' });
    }
  }
  Transacao.init({
    // =========================================================================
    // PASSO 1B (ADIÇÃO): Diferencia Marketplace de Movimentação Financeira
    // =========================================================================
    tipo: {
      type: DataTypes.ENUM('COMPRA', 'VENDA', 'DEPOSITO', 'SAQUE'),
      allowNull: false,
      defaultValue: 'COMPRA'
    },
    // =========================================================================
    // PASSO 1B (ADIÇÃO): Descrição para o extrato (Ex: "Depósito PIX")
    // =========================================================================
    descricao: {
      type: DataTypes.STRING,
      allowNull: true
    },
    pesoComprado: {
      type: DataTypes.FLOAT,
      allowNull: true // ALTERADO PARA TRUE: Um depósito/saque não tem peso
    },
    valorBruto: {
      type: DataTypes.FLOAT,
      allowNull: true // ALTERADO PARA TRUE
    },
    taxaPlataforma: {
      type: DataTypes.FLOAT,
      allowNull: true // ALTERADO PARA TRUE
    },
    valorTotal: {
      type: DataTypes.FLOAT,
      allowNull: false // MANTIDO: Toda transação (marketplace ou carteira) tem valor
    },
    status: {
      // ALTERADO: Inclui status financeiros ('PENDENTE', 'CANCELADO')
      type: DataTypes.ENUM('CRIADA', 'EM_TRANSPORTE', 'CONCLUIDA', 'PENDENTE', 'CANCELADO'),
      allowNull: false,
      defaultValue: 'CRIADA'
    },
    empresa_id: {
      type: DataTypes.INTEGER,
      allowNull: true // ALTERADO PARA TRUE: Depósitos e saques não usam este campo
    },
    residuo_id: {
      type: DataTypes.INTEGER,
      allowNull: true // ALTERADO PARA TRUE: Depósitos e saques não usam este campo
    },
    // =========================================================================
    // PASSO 1B (ADIÇÃO): Identificador de quem está depositando/sacando
    // =========================================================================
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Transacao',
  });
  return Transacao;
};