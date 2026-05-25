'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Usuario extends Model {
    static associate(models) {
      Usuario.hasMany(models.Telefone, { foreignKey: 'usuario_id', as: 'telefones' });
      Usuario.hasMany(models.Residuo, { foreignKey: 'industria_id', as: 'residuos' });
      Usuario.hasMany(models.Transacao, { foreignKey: 'empresa_id', as: 'compras' });
      
      // ADIÇÃO EXTRA: Associação para mapear todas as movimentações financeiras gerais do usuário
      Usuario.hasMany(models.Transacao, { foreignKey: 'usuario_id', as: 'transacoes' });
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
    },
    // =========================================================================
    // PASSO 1A: ADIÇÃO DO CAMPO SALDO NO MODELO DE USUÁRIO
    // =========================================================================
    saldo: {
      type: DataTypes.DECIMAL(10, 2), // Permite armazenar valores monetários precisos (ex: 99999999.99)
      allowNull: false,
      defaultValue: 0.00             // Garante que toda nova conta cadastrada comece com R$ 0,00
    }
  }, {
    sequelize,
    modelName: 'Usuario',
  });
  return Usuario;
};