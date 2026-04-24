'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Transacao extends Model {
    static associate(models) {
      Transacao.belongsTo(models.Usuario, { foreignKey: 'empresa_id', as: 'empresa' });
      Transacao.belongsTo(models.Residuo, { foreignKey: 'residuo_id', as: 'residuo' });
    }
  }
  Transacao.init({
    pesoComprado: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    valorBruto: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    taxaPlataforma: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    valorTotal: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('CRIADA', 'EM_TRANSPORTE', 'CONCLUIDA'),
      allowNull: false,
      defaultValue: 'CRIADA'
    },
    empresa_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    residuo_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Transacao',
  });
  return Transacao;
};