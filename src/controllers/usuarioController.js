const { Usuario } = require('../models');

// Função dedicada para fazer o upload e atualizar o logo da empresa
const uploadLogo = async (req, res) => {
    try {
        // 1. Verifica se a imagem foi processada e enviada pelo multer
        if (!req.file) {
            return res.status(400).json({ erro: 'Nenhum arquivo de imagem foi enviado.' });
        }

        // 2. Captura o ID do usuário através da URL da requisição
        const usuarioId = req.params.id; 

        // 3. Monta o caminho exato que será salvo no banco de dados.
        const caminhoLogo = `/uploads/${req.file.filename}`;

        // 4. Faz a atualização apenas da coluna 'logo_url' para o usuário específico
        const [linhasAtualizadas] = await Usuario.update(
            { logo_url: caminhoLogo },
            { where: { id: usuarioId } }
        );

        // 5. Validação de segurança: se retornou 0, o usuário não existe no banco
        if (linhasAtualizadas === 0) {
            return res.status(404).json({ erro: 'Usuário não encontrado.' });
        }

        // 6. Retorna uma resposta de sucesso enviando a nova URL
        return res.status(200).json({ 
            mensagem: 'Logo da empresa atualizado com sucesso!',
            logo_url: caminhoLogo
        });

    } catch (erro) {
        console.error('Erro no uploadLogo:', erro);
        return res.status(500).json({ erro: 'Erro interno ao tentar salvar o logo.' });
    }
};

// NOVA FUNÇÃO: Atualizar dados de texto (ex: Nome da Empresa)
const atualizarDados = async (req, res) => {
    try {
        const usuarioId = req.params.id;
        const { nome } = req.body; // Pega o novo nome enviado pelo Front-end

        // Faz o UPDATE do nome no banco de dados
        const [linhasAtualizadas] = await Usuario.update(
            { nome },
            { where: { id: usuarioId } }
        );

        // Se nenhuma linha foi alterada, o usuário não existe
        if (linhasAtualizadas === 0) {
            return res.status(404).json({ erro: 'Nenhum dado alterado ou usuário não encontrado.' });
        }

        // Retorna o sucesso e o novo nome
        return res.status(200).json({ 
            mensagem: 'Dados atualizados com sucesso!',
            nome: nome
        });

    } catch (erro) {
        console.error('Erro no atualizarDados:', erro);
        return res.status(500).json({ erro: 'Erro interno ao tentar atualizar dados.' });
    }
};

// Exporta as funções para serem usadas nas rotas
module.exports = {
    uploadLogo,
    atualizarDados
};