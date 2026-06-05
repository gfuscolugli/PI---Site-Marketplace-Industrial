import { useState, useEffect, useMemo } from 'react';
import { Filter, Search, MapPin, Package, X, ShoppingBag, Wallet } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
// IMPORTANDO AS FUNÇÕES CORRETAS DA NOSSA API
import { getProdutosMarketplace, getSaldoEmpresa, realizarCheckout } from '../../../services/api';

export function Marketplace() {
  const [produtos, setProdutos] = useState<any[]>([]); 
  const [carregando, setCarregando] = useState(true);
  const [processandoCompra, setProcessandoCompra] = useState(false);

  // ESTADO DO SALDO REAL (Vem do banco de dados agora!)
  const [saldo, setSaldo] = useState(0); 

  // ESTADOS DOS FILTROS
  const [termoBusca, setTermoBusca] = useState('');
  const [quantidadeMin, setQuantidadeMin] = useState(1);
  const [ordenacao, setOrdenacao] = useState('Mais Recentes');

  // ESTADOS DO MODAL DE COMPRA
  const [produtoSelecionado, setProdutoSelecionado] = useState<any | null>(null);
  const [quantidadeCompra, setQuantidadeCompra] = useState<number>(1);

  // FUNÇÃO QUE CARREGA TUDO DA TELA INCLUINDO O SALDO REAL
  const carregarDadosDaTela = async () => {
    try {
      setCarregando(true);
      
      const dadosVitrine = await getProdutosMarketplace();
      setProdutos(dadosVitrine);

      // BUSCANDO O SALDO REAL DO BACKEND
      const dadosSaldo = await getSaldoEmpresa();
      if (dadosSaldo && dadosSaldo.saldo !== undefined) {
        setSaldo(Number(dadosSaldo.saldo));
      }
    } catch (erro) {
      console.error("Erro ao carregar os dados iniciais", erro);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarDadosDaTela();
  }, []);

  const produtosFiltrados = useMemo(() => {
    let filtrados = produtos.filter((produto) => {
      const nomeResiduo = produto.nome || "";
      const nomeIndustria = produto.industria?.nome || "Indústria não identificada";

      const matchBusca = 
        nomeResiduo.toLowerCase().includes(termoBusca.toLowerCase()) ||
        nomeIndustria.toLowerCase().includes(termoBusca.toLowerCase());

      const matchQuantidade = (produto.pesoDisponivel || 0) >= quantidadeMin;

      return matchBusca && matchQuantidade;
    });

    filtrados.sort((a, b) => {
      if (ordenacao === 'Mais Recentes') {
        const dataA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dataB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dataB - dataA; 
      }
      if (ordenacao === 'Mais Antigos') {
        const dataA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dataB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dataA - dataB;
      }
      if (ordenacao === 'Menor Preço') {
        return (a.valorPorKg || 0) - (b.valorPorKg || 0);
      }
      if (ordenacao === 'Maior Preço') {
        return (b.valorPorKg || 0) - (a.valorPorKg || 0);
      }
      if (ordenacao === 'Menor Volume') {
        return (a.pesoDisponivel || 0) - (b.pesoDisponivel || 0);
      }
      if (ordenacao === 'Maior Volume') {
        return (b.pesoDisponivel || 0) - (a.pesoDisponivel || 0);
      }
      return 0; 
    });

    return filtrados;
  }, [produtos, termoBusca, quantidadeMin, ordenacao]);

  // ==========================================
  // FUNÇÃO: FINALIZAR COMPRA
  // ==========================================
  const handleFinalizarCompra = async () => {
    if (!produtoSelecionado) return;

    // Cálculo em Reais (Preço * Quantidade em KG)
    const valorTotal = quantidadeCompra * (produtoSelecionado.valorPorKg || 0);

    if (valorTotal > saldo) {
      toast.error("Saldo insuficiente para realizar esta compra.");
      return;
    }

    setProcessandoCompra(true);

    try {
      // FIX: Dividimos por 1000 para converter KG -> Toneladas para o backend
      await realizarCheckout({
        residuo_id: produtoSelecionado.id,
        pesoComprado: quantidadeCompra / 1000 
      });

      toast.success(`Sucesso! Compra de ${quantidadeCompra} kg processada.`);
      
      setProdutoSelecionado(null);
      setQuantidadeCompra(1);
      
      // Atualiza a tela
      await carregarDadosDaTela(); 

    } catch (error: any) {
      console.error(error);
      const mensagemBack = error.response?.data?.message || "Erro interno ao finalizar transação.";
      toast.error(`Falha na compra: ${mensagemBack}`);
    } finally {
      setProcessandoCompra(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 h-full max-w-[1400px] mx-auto w-full relative">
      
      <Toaster position="top-right" reverseOrder={false} />

      <div className="bg-white px-6 py-4 rounded-2xl shadow-sm border border-gray-200 flex justify-between items-center">
        <h1 className="text-xl font-bold text-[#111827]">Plataforma Revalor</h1>
        
        <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
          <div className="bg-green-100 text-green-700 p-2 rounded-lg">
            <Wallet size={20} />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-gray-500">Saldo Disponível</p>
            <p className="font-black text-gray-900 leading-none">
              {carregando ? 'Buscando...' : saldo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        
        <aside className="w-full lg:w-[280px] flex-shrink-0 bg-white p-6 rounded-2xl shadow-sm border border-gray-200 h-fit">
          <div className="flex items-center gap-2 mb-6 text-revalor">
            <Filter size={20} />
            <h2 className="font-bold text-lg text-gray-800">Filtros</h2>
          </div>

          <div className="mb-8">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Ordenar Anúncios</h3>
            <div className="flex flex-col gap-3">
              {['Mais Recentes', 'Mais Antigos', 'Menor Preço', 'Maior Preço', 'Menor Volume', 'Maior Volume'].map((item) => (
                <label key={item} className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="radio" 
                    name="ordenacao"
                    checked={ordenacao === item}
                    onChange={() => setOrdenacao(item)}
                    className="w-4 h-4 text-revalor focus:ring-revalor accent-revalor cursor-pointer" 
                  />
                  <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors font-medium">
                    {item}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Volume Mínimo: {quantidadeMin} kg</h3>
            <input 
              type="range" min="1" max="5000" step="10"
              value={quantidadeMin}
              onChange={(e) => setQuantidadeMin(Number(e.target.value))}
              className="w-full accent-revalor" 
            />
            <div className="flex justify-between text-xs text-gray-400 mt-2">
              <span>1 kg</span>
              <span>5000+ kg</span>
            </div>
          </div>
        </aside>

        <div className="flex-1 flex flex-col gap-6">
          
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text" 
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
                placeholder="Buscar resíduos, materiais ou indústrias..." 
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-revalor/50 outline-none shadow-sm" 
              />
            </div>
          </div>

          {carregando ? (
             <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                <div className="w-10 h-10 border-4 border-revalor border-t-transparent rounded-full animate-spin mb-4"></div>
                <p>Buscando resíduos e conectando carteira...</p>
             </div>
          ) : produtosFiltrados.length === 0 ? (
             <div className="flex flex-col items-center justify-center py-20 text-gray-500 bg-white rounded-2xl border border-gray-200">
                <Package size={48} className="text-gray-300 mb-4" />
                <p className="font-bold text-lg text-gray-700">Nenhum resíduo encontrado</p>
                <p className="text-sm">Tente limpar os filtros ou buscar por outro termo.</p>
                <button 
                  onClick={() => { setTermoBusca(''); setQuantidadeMin(1); setOrdenacao('Mais Recentes'); }}
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
                      <img src={`http://localhost:3000/uploads/${produto.imagem_url}`} alt={produto.nome} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50">Sem Foto</div>
                    )}
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
                        <span className="truncate">{produto.industria?.nome || 'Contato via plataforma'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Package size={16} className="text-gray-400 shrink-0" />
                        <span>{produto.pesoDisponivel} kg disponíveis</span>
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
                      
                      <button 
                        onClick={() => {
                          setProdutoSelecionado(produto);
                          setQuantidadeCompra(1); 
                        }}
                        className="bg-[#0B132B] hover:bg-[#1a2b5e] text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
                      >
                        Comprar
                      </button>

                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {produtoSelecionado && (() => {
        const valorTotal = quantidadeCompra * (produtoSelecionado.valorPorKg || 0);
        const saldoSuficiente = saldo >= valorTotal;

        return (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-[32px] w-full max-w-lg overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
              
              <div className="relative h-64 bg-gray-100 w-full">
                {produtoSelecionado.imagem_url ? (
                  <img src={`http://localhost:3000/uploads/${produtoSelecionado.imagem_url}`} alt={produtoSelecionado.nome} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">Sem Foto</div>
                )}
                
                <button 
                  onClick={() => setProdutoSelecionado(null)}
                  className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-sm transition-all cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-8 flex flex-col gap-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{produtoSelecionado.nome}</h2>
                  <p className="text-gray-500 text-sm">Vendido por: <span className="font-semibold text-gray-700">{produtoSelecionado.industria?.nome || 'Indústria Revalor'}</span></p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 flex flex-col gap-4">
                  
                  <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-bold mb-1">Preço</p>
                      <p className="text-lg font-bold text-gray-900">
                        R$ {Number(produtoSelecionado.valorPorKg).toFixed(2)} <span className="text-sm font-normal text-gray-500">/ kg</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 uppercase font-bold mb-1">Disponível</p>
                      <p className="text-lg font-bold text-gray-900">{produtoSelecionado.pesoDisponivel} kg</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <p className="font-semibold text-gray-700">Quantidade (kg):</p>
                    <input 
                      type="number" 
                      step="any" 
                      min="0.1" 
                      max={produtoSelecionado.pesoDisponivel}
                      value={quantidadeCompra}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        if (isNaN(val)) { setQuantidadeCompra(0.1); return; }
                        if (val > produtoSelecionado.pesoDisponivel) { setQuantidadeCompra(produtoSelecionado.pesoDisponivel); return; }
                        if (val < 0.1) { setQuantidadeCompra(0.1); return; }
                        setQuantidadeCompra(val);
                      }}
                      className="w-24 border border-gray-300 rounded-xl p-2.5 text-center font-bold outline-none focus:ring-2 focus:ring-revalor/50"
                    />
                  </div>

                  <div className={`${saldoSuficiente ? 'bg-[#063B2C]' : 'bg-red-600'} text-white rounded-xl p-4 flex justify-between items-center mt-2 shadow-inner transition-colors`}>
                    <div>
                      <p className="font-medium text-sm">Total Estimado:</p>
                      {!saldoSuficiente && <p className="text-[10px] font-bold uppercase mt-0.5 text-red-200">Saldo Insuficiente</p>}
                    </div>
                    <p className="text-2xl font-black">
                      {valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </p>
                  </div>

                </div>

                <button 
                  onClick={handleFinalizarCompra}
                  disabled={!saldoSuficiente || processandoCompra}
                  className={`w-full font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all 
                    ${saldoSuficiente 
                      ? 'bg-revalor hover:bg-[#047857] text-white cursor-pointer' 
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                >
                  <ShoppingBag size={20} />
                  {processandoCompra ? 'Registrando...' : 'Confirmar Compra'}
                </button>

              </div>
            </div>
          </div>
        );
      })()}

    </div>
  );
}