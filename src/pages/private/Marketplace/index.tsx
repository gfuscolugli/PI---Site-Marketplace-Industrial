import { useState, useEffect, useMemo } from 'react';
import { Filter, Search, MapPin, Package } from 'lucide-react';
import { getProdutosMarketplace } from '../../../services/api';
import type { ProdutoMarketplace } from '../../../types';

export function Marketplace() {
  const [produtos, setProdutos] = useState<any[]>([]); // Usando any[] temporariamente para aceitar os campos do banco
  const [carregando, setCarregando] = useState(true);

  // ==========================================
  // ESTADOS DOS FILTROS
  // ==========================================
  const [termoBusca, setTermoBusca] = useState('');
  const [categoriasSelecionadas, setCategoriasSelecionadas] = useState<string[]>([]);
  const [quantidadeMin, setQuantidadeMin] = useState(1);
  const [ordenacao, setOrdenacao] = useState('Relevância');

  // Busca inicial no banco
  useEffect(() => {
    const carregarDados = async () => {
      try {
        const dados = await getProdutosMarketplace();
        setProdutos(dados);
      } catch (erro) {
        console.error("Erro ao buscar dados", erro);
      } finally {
        setCarregando(false);
      }
    };
    carregarDados();
  }, []);

  // ==========================================
  // FUNÇÃO: Marcar/Desmarcar Categoria
  // ==========================================
  const toggleCategoria = (categoria: string) => {
    setCategoriasSelecionadas((prev) => 
      prev.includes(categoria)
        ? prev.filter((c) => c !== categoria) // Se já tem, remove
        : [...prev, categoria] // Se não tem, adiciona
    );
  };

  // ==========================================
  // MOTOR DE BUSCA E FILTROS (useMemo) - CORRIGIDO
  // ==========================================
  const produtosFiltrados = useMemo(() => {
    let filtrados = produtos.filter((produto) => {
      // Ajuste para os nomes reais do banco: 'nome' em vez de 'nome_residuo'
      const nomeResiduo = produto.nome || "";
      const nomeIndustria = produto.industria?.nome || "Indústria não identificada";

      // 1. Filtro de Texto (Nome do resíduo ou da empresa)
      const matchBusca = 
        nomeResiduo.toLowerCase().includes(termoBusca.toLowerCase()) ||
        nomeIndustria.toLowerCase().includes(termoBusca.toLowerCase());

      // 2. Filtro de Categoria (Checkbox) - 'categorias' em vez de 'nome_categoria'
      const matchCategoria = 
        categoriasSelecionadas.length === 0 || 
        categoriasSelecionadas.includes(produto.categorias);

      // 3. Filtro de Quantidade - 'pesoDisponivel' em vez de 'quantidade'
      const matchQuantidade = (produto.pesoDisponivel || 0) >= quantidadeMin;

      return matchBusca && matchCategoria && matchQuantidade;
    });

    // 4. Ordenação
    if (ordenacao === 'Menor Preço') {
      filtrados.sort((a, b) => (a.valorPorKg || 0) - (b.valorPorKg || 0));
    } else if (ordenacao === 'Maior Volume') {
      filtrados.sort((a, b) => (b.pesoDisponivel || 0) - (a.pesoDisponivel || 0));
    }

    return filtrados;
  }, [produtos, termoBusca, categoriasSelecionadas, quantidadeMin, ordenacao]);

  return (
    <div className="flex flex-col gap-6 h-full max-w-[1400px] mx-auto w-full">
      
      <div className="bg-white px-6 py-4 rounded-2xl shadow-sm border border-gray-200">
        <h1 className="text-xl font-bold text-[#111827]">Plataforma Revalor</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* SIDEBAR DE FILTROS */}
        <aside className="w-full lg:w-[280px] flex-shrink-0 bg-white p-6 rounded-2xl shadow-sm border border-gray-200 h-fit">
          <div className="flex items-center gap-2 mb-6 text-revalor">
            <Filter size={20} />
            <h2 className="font-bold text-lg text-gray-800">Filtros</h2>
          </div>

          <div className="mb-8">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Tipo de Material</h3>
            <div className="flex flex-col gap-3">
              {['Entulho', 'Plástico', 'Metal', 'Madeira', 'Papel/Papelão', 'Orgânico'].map((item) => (
                <label key={item} className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={categoriasSelecionadas.includes(item)}
                    onChange={() => toggleCategoria(item)}
                    className="w-4 h-4 rounded border-gray-300 text-revalor focus:ring-revalor accent-revalor" 
                  />
                  <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">{item}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Volume Mínimo: {quantidadeMin}t</h3>
            <input 
              type="range" min="1" max="100" 
              value={quantidadeMin}
              onChange={(e) => setQuantidadeMin(Number(e.target.value))}
              className="w-full accent-revalor" 
            />
            <div className="flex justify-between text-xs text-gray-400 mt-2">
              <span>1t</span>
              <span>100t+</span>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Distância Max</h3>
            <select className="w-full bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-revalor outline-none p-2.5">
              <option>Até 10 km</option>
              <option>Até 25 km</option>
              <option>Até 50 km</option>
              <option>Qualquer distância</option>
            </select>
          </div>
        </aside>

        {/* ÁREA PRINCIPAL DA VITRINE */}
        <div className="flex-1 flex flex-col gap-6">
          
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text" 
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
                placeholder="Buscar resíduos, materiais ou indústrias..." 
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-revalor/50 outline-none" 
              />
            </div>
            
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-sm text-gray-500">Ordenar por:</span>
              <select 
                value={ordenacao}
                onChange={(e) => setOrdenacao(e.target.value)}
                className="bg-white border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-revalor outline-none p-2 shadow-sm cursor-pointer"
              >
                <option>Relevância</option>
                <option>Menor Preço</option>
                <option>Maior Volume</option>
              </select>
            </div>
          </div>

          {carregando ? (
             <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                <div className="w-10 h-10 border-4 border-revalor border-t-transparent rounded-full animate-spin mb-4"></div>
                <p>Buscando resíduos no banco de dados...</p>
             </div>
          ) : produtosFiltrados.length === 0 ? (
            
             <div className="flex flex-col items-center justify-center py-20 text-gray-500 bg-white rounded-2xl border border-gray-200">
                <Package size={48} className="text-gray-300 mb-4" />
                <p className="font-bold text-lg text-gray-700">Nenhum resíduo encontrado</p>
                <p className="text-sm">Tente limpar os filtros ou buscar por outro termo.</p>
                <button 
                  onClick={() => { setTermoBusca(''); setCategoriasSelecionadas([]); setQuantidadeMin(1); }}
                  className="mt-4 text-revalor font-bold hover:underline"
                >
                  Limpar todos os filtros
                </button>
             </div>
             
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              
              {produtosFiltrados.map((produto) => (
                <div key={produto.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col overflow-hidden group hover:shadow-md transition-shadow animate-in fade-in zoom-in-95 duration-300">
                  
                  <div className="h-48 w-full relative overflow-hidden bg-gray-100">
                    {produto.imagem_url ? (
                      <img src={produto.imagem_url} alt={produto.nome} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50">Sem Foto</div>
                    )}
                    
                    <div className="absolute top-3 left-3 bg-white text-gray-800 text-xs font-bold px-2.5 py-1 rounded-md shadow-sm">
                      {produto.estadoFisico || 'Sólido'}
                    </div>
                    <div className="absolute top-3 right-3 bg-revalor text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-sm">
                      {produto.categorias}
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-bold text-[#111827] text-lg leading-tight mb-3">
                      {produto.nome}
                    </h3>
                    
                    <div className="flex flex-col gap-2 mb-6">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-revalor shrink-0"></span>
                        <span className="truncate">{produto.industria?.nome || 'Empresa Revalor'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <MapPin size={16} className="text-gray-400 shrink-0" />
                        <span className="truncate">{produto.industria?.email || 'Contato via plataforma'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Package size={16} className="text-gray-400 shrink-0" />
                        <span>{produto.pesoDisponivel} Ton disponíveis</span>
                      </div>
                    </div>

                    <div className="mt-auto pt-4 border-t border-gray-100 flex items-end justify-between">
                      <div>
                        <p className="text-[11px] text-gray-500 uppercase font-semibold mb-0.5">Preço Base</p>
                        <p className="text-revalor font-black text-lg">
                          {produto.valorPorKg 
                            ? produto.valorPorKg.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) 
                            : 'A negociar'} 
                          <span className="text-sm font-medium text-gray-500 ml-1">/ kg</span>
                        </p>
                      </div>
                      <button className="bg-[#0B132B] hover:bg-[#1a2b5e] text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-colors">
                        Detalhes
                      </button>
                    </div>
                  </div>
                </div>
              ))}

            </div>
          )}

        </div>
      </div>
    </div>
  );
}