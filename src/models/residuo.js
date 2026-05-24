'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Residuo extends Model {
    static associate(models) {
      Residuo.belongsTo(models.Usuario, { foreignKey: 'industria_id', as: 'industria' });
      Residuo.hasMany(models.Transacao, { foreignKey: 'residuo_id', as: 'transacoes' });
    }
  }
  Residuo.init({
    nome: {
      type: DataTypes.STRING,
      allowNull: false
    },
    descricao: {
      type: DataTypes.TEXT
    },
    estadoFisico: {
      type: DataTypes.STRING,
      allowNull: false
    },
    categorias: {
      type: DataTypes.STRING
    },
    pesoDisponivel: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    valorPorKg: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    industria_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    // --- NOVO CAMPO DA IMAGEM ADICIONADO AQUI ---
    imagem_url: {
      type: DataTypes.STRING,
      allowNull: true // Deixamos como true para não obrigar que todo resíduo tenha foto
    }
  }, {
    sequelize,
    modelName: 'Residuo',
  });
  return Residuo;
};