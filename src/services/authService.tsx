// src/services/authService.ts

// Cria um atraso falso de 1 segundo para simular a internet
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Função de Login
export const realizarLogin = async (cnpj: string, senha: string) => {
  await delay(800); // Finge que foi no servidor
  
  const dadosSalvos = localStorage.getItem('revalor_usuario');
  
  if (!dadosSalvos) {
    return { sucesso: false, mensagem: 'Nenhuma conta encontrada. Cadastre sua empresa primeiro.' };
  }

  const usuarioReal = JSON.parse(dadosSalvos);

  if (cnpj === usuarioReal.documento && senha === usuarioReal.senha) {
    localStorage.setItem('revalor_auth', 'true');
    return { sucesso: true };
  }

  return { sucesso: false, mensagem: 'CNPJ ou senha incorretos.' };
};

// Função de Cadastro
export const realizarCadastro = async (usuario: any) => {
  await delay(1000); // Finge que foi no servidor
  
  localStorage.setItem('revalor_usuario', JSON.stringify(usuario));
  
  return { sucesso: true };
}