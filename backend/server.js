require('dotenv').config();
const app = require('./src/app');
const { sequelize } = require('./src/models');

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexão com o banco de dados estabelecida com sucesso.');

    // --- INÍCIO DO BYPASS PARA CORRIGIR O ERRO DO MYSQL ---
    // 1. Desliga a trava de segurança do MySQL rapidamente
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0;');
    
    // 2. Força as colunas a aceitarem valores vazios (NULL) na marra
    await sequelize.query('ALTER TABLE `Transacaos` MODIFY `empresa_id` INTEGER NULL;');
    await sequelize.query('ALTER TABLE `Transacaos` MODIFY `residuo_id` INTEGER NULL;');
    
    // 3. Liga a trava de segurança de novo
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1;');
    // --- FIM DO BYPASS ---

    // 4. Agora sim, roda o Sequelize livremente com o alter: true!
    await sequelize.sync();
    
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error('Não foi possível conectar ao banco de dados:', error);
  }
};

startServer();