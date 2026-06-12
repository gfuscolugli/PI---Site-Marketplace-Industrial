'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Telefone extends Model {
    static associate(models) {
      Telefone.belongsTo(models.Usuario, { foreignKey: 'usuario_id', as: 'usuario' });
    }
  }
  Telefone.init({
    numero: {
      type: DataTypes.STRING,
      allowNull: false
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Telefone',
  });
  return Telefone;
};