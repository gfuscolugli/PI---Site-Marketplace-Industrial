// src/services/api.tsx
import axios from 'axios';
import type { ProdutoMarketplace } from '../types';

// ==========================================
// 1. O MOTOR REAL (Conexão com o seu Back-end)
// ==========================================
const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Garanta que seu Back-end está rodando na 3000
});

api.interceptors.request.use(async config => {
  const token = localStorage.getItem('revalor-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api; 

// ==========================================
// 2. FUNÇÕES REAIS (Lendo e Gravando no MySQL)
// ==========================================

export const getProdutosMarketplace = async (): Promise<ProdutoMarketplace[]> => {
  try {
    // Busca TODOS os resíduos à venda (ajuste a rota '/residuos' conforme seu Back-end)
    const response = await api.get('/residuos'); 
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar marketplace:", error);
    return []; // Retorna vazio para não quebrar a tela
  }
};

export const getMeusResiduos = async () => {
  try {
    // Busca apenas os resíduos da empresa logada
    const response = await api.get('/residuos/meus'); 
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar meus resíduos:", error);
    return [];
  }
};

export const adicionarResiduo = async (dados: any) => {
  try {
    // Envia o novo resíduo para o banco de dados
    const response = await api.post('/residuos', dados);
    return response.data;
  } catch (error) {
    console.error("Erro ao adicionar resíduo:", error);
    throw error; // Lança o erro para a tela avisar o usuário
  }
};

export const getTransacoes = async () => {
  try {
    // Busca o histórico de compras/vendas
    const response = await api.get('/transacoes');
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar transações:", error);
    return [];
  }
};