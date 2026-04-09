export interface Industria {
  id_industria: number;
  cnpj: string;
  razao_social: string;
  nome: string;
  segmento: string;
  endereco: string;
  email: string;
}


export interface ProdutoMarketplace {
  id_residuo: number;
  nome_residuo: string;
  descricao: string;
  estado_fisico: string;
  quantidade: number;
  unidade_medida: string;
  
  // Dados que virão do JOIN com a tabela INDUSTRIA
  nome_industria: string; 
  endereco_industria: string;
  
  // Dados que virão do JOIN com a tabela CATEGORIA
  nome_categoria: string;
  classe_risco: string;
  

  imagem_url?: string;
  preco_base?: number; 
}


export interface CredenciaisLogin {
  cnpj: string;
  senha: string;
}

export interface RespostaAuth {
  sucesso: boolean;
  mensagem?: string;
  usuario?: {
    cnpj: string;
    razao_social: string;
    perfil: 'geradora' | 'receptora';
  };
}