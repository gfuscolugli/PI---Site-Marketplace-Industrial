// src/services/authService.ts
import api from './api';

// Função de Login Real
export const realizarLogin = async (cnpjOuEmail: string, senha: string) => {
  try {
    // 1. Bate na porta do Back-end pedindo para entrar
    const resposta = await api.post('/auth/login', { 
      email: cnpjOuEmail, // O back-end espera a chave 'email'
      senha: senha 
    });

    // 2. O Back-end devolveu o Token! Vamos salvar ele no cofre do navegador
    localStorage.setItem('revalor-token', resposta.data.token);
    
    // 3. Salva também os dados do usuário para mostrar na tela (nome, tipo, etc)
    localStorage.setItem('revalor_usuario', JSON.stringify(resposta.data.usuario));

    return { sucesso: true };
  } catch (erro: any) {
    // Se o back-end recusar (senha errada, etc), ele cai aqui
    return { 
      sucesso: false, 
      mensagem: erro.response?.data?.message || 'Erro de conexão com o servidor.' 
    };
  }
};

// Função de Cadastro Real
export const realizarCadastro = async (usuario: any) => {
  try {
    // 1. Envia os dados do formulário de cadastro para o Back-end
    // O backend espera: { nome, email, senha, tipo, telefones }
    await api.post('/auth/register', usuario);
    
    return { sucesso: true };
  } catch (erro: any) {
    return { 
      sucesso: false, 
      mensagem: erro.response?.data?.message || 'Erro ao realizar o cadastro.' 
    };
  }
};