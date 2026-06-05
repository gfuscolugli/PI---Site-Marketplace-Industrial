'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Transacaos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      pesoComprado: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      valorBruto: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      taxaPlataforma: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      valorTotal: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('CRIADA', 'EM_TRANSPORTE', 'CONCLUIDA'),
        allowNull: false,
        defaultValue: 'CRIADA'
      },
      empresa_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Usuarios',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      residuo_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Residuos',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Transacaos');
  }
};