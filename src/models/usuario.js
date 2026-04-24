'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Usuario extends Model {
    static associate(models) {
      Usuario.hasMany(models.Telefone, { foreignKey: 'usuario_id', as: 'telefones' });
      Usuario.hasMany(models.Residuo, { foreignKey: 'industria_id', as: 'residuos' });
      Usuario.hasMany(models.Transacao, { foreignKey: 'empresa_id', as: 'compras' });
    }
  }
  Usuario.init({
    nome: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    senhaHash: {
      type: DataTypes.STRING,
      allowNull: false
    },
    tipo: {
      type: DataTypes.ENUM('INDUSTRIA', 'EMPRESA'),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Usuario',
  });
  return Usuario;
};