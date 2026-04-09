// src/services/api.ts
import type { ProdutoMarketplace } from '../types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getProdutosMarketplace = async (): Promise<ProdutoMarketplace[]> => {
  await delay(1000); 

  // Aqui estamos simulando o retorno de um SQL como:
  
  return [
    {
      id_residuo: 1,
      nome_residuo: 'Aparas de Plástico PEAD',
      descricao: 'Plástico de alta densidade triturado',
      estado_fisico: 'Sólido',
      quantidade: 8.50,
      unidade_medida: 'Toneladas',
      nome_industria: 'Indústria ABC Ltda',
      endereco_industria: 'Rua Industrial, 100',
      nome_categoria: 'Plástico',
      classe_risco: 'Classe B',
      imagem_url: 'https://images.unsplash.com/photo-1605600659873-d808a1d14b2c?auto=format&fit=crop&q=80&w=800',
      preco_base: 2100.00
    },
    {
      id_residuo: 2,
      nome_residuo: 'Fardos de Sucata de Alumínio',
      descricao: 'Sucata metálica compactada',
      estado_fisico: 'Sólido',
      quantidade: 3.50,
      unidade_medida: 'Toneladas',
      nome_industria: 'Metalúrgica XYZ',
      endereco_industria: 'Av. das Indústrias, 500',
      nome_categoria: 'Metal',
      classe_risco: 'Classe B',
      imagem_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=800',
      preco_base: 4200.00
    }
  ];
};

export const getMeusResiduos = async () => {
  await delay(800); // Simula o tempo do servidor

  // Quando o backend estiver pronto:
  // return fetch('http://localhost:8080/api/industria/meus-residuos').then(res => res.json());

  return [
    {
      id: 1,
      titulo: 'Entulho de Concreto Britado (RCC)',
      categoria: 'CONSTRUÇÃO CIVIL',
      norma: 'CONAMA A',
      estado_fisico: 'Sólido',
      volume_ton: 15.0,
      volume_kg: 15000,
      interesse: 85,
      status: 'Ativo',
      imagem: 'https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?auto=format&fit=crop&q=80&w=800'
    }
  ];
};

export const adicionarResiduo = async (dados: any) => {
  await delay(800);
  
  return {
    id: Math.random(), 
    titulo: dados.titulo,
    categoria: 'NOVO MATERIAL',
    norma: 'Em análise',
    estado_fisico: 'Variável',
    volume_ton: Number(dados.quantidade),
    volume_kg: Number(dados.quantidade) * 1000,
    interesse: 0,
    status: 'Em Análise',
    imagem: dados.imagem || 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=800',
    valor: dados.valor
  };
};

export const getTransacoes = async () => {
  await delay(800); // Simula o servidor
  return [
    {
      id_transacao: 1042,
      residuo_nome: 'Entulho de Concreto Britado',
      empresa_compradora: 'Construtora Alfa Ltda',
      data: '2026-04-09T14:30:00',
      status: 'Concluído',
      peso_final: 15.0,
      valor_total: 675.00 
    },
    {
      id_transacao: 1043,
      residuo_nome: 'Aparas de Plástico PEAD',
      empresa_compradora: 'ReciclaMais S/A',
      data: '2026-04-08T09:15:00',
      status: 'Em Andamento',
      peso_final: 8.5,
      valor_total: 17850.00
    },
    {
      id_transacao: 1044,
      residuo_nome: 'Fardos de Papelão Misto',
      empresa_compradora: 'Embalagens Eco',
      data: '2026-04-05T16:45:00',
      status: 'Cancelado',
      peso_final: 0.0,
      valor_total: 0.00
    }
  ];
};