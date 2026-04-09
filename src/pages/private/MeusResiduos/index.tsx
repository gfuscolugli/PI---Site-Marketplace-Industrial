import { useState, useEffect } from 'react';
import { Plus, BarChart3, TrendingUp, CheckCircle2, Leaf, Search, Filter, X, DollarSign, Package, UploadCloud, Image as ImageIcon } from 'lucide-react';
import { getMeusResiduos, adicionarResiduo } from '../../../services/api';

export function MeusResiduos() {
  const [residuos, setResiduos] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);
  

  const [modalAberto, setModalAberto] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [imagemPreview, setImagemPreview] = useState<string | null>(null);
  
  const [form, setForm] = useState({
    titulo: '',
    quantidade: '',
    valor: '',
    imagem: ''
  });


  useEffect(() => {
    getMeusResiduos().then(dados => {
      setResiduos(dados);
      setCarregando(false);
    });
  }, []);

  const listagensAtivas = residuos.length;
  const volumeTotal = residuos.reduce((acumulador, item) => acumulador + item.volume_ton, 0);


  const handleUploadFoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const urlTemporaria = URL.createObjectURL(file);
      setImagemPreview(urlTemporaria);
      setForm({ ...form, imagem: urlTemporaria });
    }
  };

  const handleAdicionar = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalvando(true);

    try {
      const novoItem = await adicionarResiduo(form);
      setResiduos([novoItem, ...residuos]);
      
      setForm({ titulo: '', quantidade: '', valor: '', imagem: '' });
      setImagemPreview(null);
      setModalAberto(false);
    } catch (error) {
      alert("Erro ao salvar o resíduo.");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-[1200px] mx-auto w-full relative">
      
      {/* MODAL DE ADICIONAR RESÍDUO */}
      {modalAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B132B]/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-b border-gray-100">
              <h3 className="font-bold text-[#111827] text-lg">Adicionar Novo Lote</h3>
              <button onClick={() => setModalAberto(false)} className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAdicionar} className="p-6 flex flex-col gap-5">
              
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase">Material / Resíduo</label>
                <input 
                  type="text" required value={form.titulo} onChange={e => setForm({...form, titulo: e.target.value})}
                  placeholder="Ex: Fardos de Papelão" 
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#00C48C]/50 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase">Quantidade</label>
                  <div className="relative">
                    <Package size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="number" required value={form.quantidade} onChange={e => setForm({...form, quantidade: e.target.value})}
                      placeholder="Em Toneladas" 
                      className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#00C48C]/50 outline-none"
                    />
                  </div>
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase">Valor (R$)</label>
                  <div className="relative">
                    <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="number" required value={form.valor} onChange={e => setForm({...form, valor: e.target.value})}
                      placeholder="0.00" step="0.01"
                      className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#00C48C]/50 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* UPLOAD DE IMAGEM */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase">Foto do Lote</label>
                <label className="relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl hover:bg-gray-50 hover:border-[#00C48C] transition-colors cursor-pointer overflow-hidden group">
                  <input type="file" accept="image/*" className="hidden" onChange={handleUploadFoto} />
                  
                  {imagemPreview ? (
                    <>
                      <img src={imagemPreview} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-white text-sm font-bold flex items-center gap-2"><ImageIcon size={16}/> Trocar Foto</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-gray-500 group-hover:text-[#00C48C] transition-colors">
                      <UploadCloud size={32} className="mb-2" />
                      <p className="text-sm font-semibold">Clique para enviar a foto</p>
                      <p className="text-xs text-gray-400 mt-1">PNG ou JPG</p>
                    </div>
                  )}
                </label>
              </div>

              <div className="mt-2 flex gap-3">
                <button type="button" onClick={() => setModalAberto(false)} className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors">
                  Cancelar
                </button>
                <button type="submit" disabled={salvando} className="flex-1 px-4 py-3 bg-[#00C48C] hover:bg-[#00a877] text-white font-bold rounded-xl transition-colors disabled:opacity-70 flex justify-center items-center">
                  {salvando ? 'Salvando...' : 'Publicar Lote'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* CABEÇALHO */}
      <div className="flex items-center justify-between bg-white px-6 py-4 rounded-2xl shadow-sm border border-gray-200">
        <h1 className="text-xl font-bold text-[#111827]">Plataforma Revalor</h1>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-[32px] font-extrabold text-[#111827] tracking-tight">Meus Resíduos</h2>
          <p className="text-[#6B7280] mt-1 text-[15px]">Visão geral do seu estoque e performance ambiental.</p>
        </div>
        <button onClick={() => setModalAberto(true)} className="flex items-center gap-2 bg-[#00C48C] hover:bg-[#00a877] text-white font-bold text-sm px-5 py-3 rounded-xl shadow-md transition-colors">
          <Plus size={18} strokeWidth={3} />
          Adicionar Resíduo
        </button>
      </div>

      {/* CARDS SUPERIORES */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 flex flex-col justify-between h-40">
          <div className="flex items-center gap-3"><div className="bg-gray-50 p-2 rounded-lg text-gray-400 border border-gray-100"><BarChart3 size={20} /></div><span className="text-sm font-semibold text-gray-500">Volume Total</span></div>
          <div>
            <div className="flex items-baseline gap-1"><span className="text-4xl font-black text-[#111827]">{volumeTotal.toFixed(1)}</span><span className="text-sm font-bold text-gray-400 uppercase">Ton</span></div>
            <p className="text-xs font-bold text-[#00C48C] mt-1 flex items-center gap-1"><TrendingUp size={12} /> Atualizado agora</p>
          </div>
        </div>

        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 flex flex-col justify-between h-40">
          <div className="flex items-center gap-3"><div className="bg-blue-50 p-2 rounded-lg text-blue-500 border border-blue-100"><TrendingUp size={20} /></div><span className="text-sm font-semibold text-gray-500">Listagens Ativas</span></div>
          <div>
            <div className="flex items-baseline gap-1"><span className="text-4xl font-black text-[#111827]">{listagensAtivas}</span><span className="text-sm font-bold text-gray-400 uppercase">lotes online</span></div>
            <div className="w-full h-1 bg-gradient-to-r from-blue-100 to-blue-500 rounded-full mt-3"></div>
          </div>
        </div>

        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 flex flex-col justify-between h-40">
          <div className="flex items-center gap-3"><div className="bg-orange-50 p-2 rounded-lg text-orange-400 border border-orange-100"><CheckCircle2 size={20} /></div><span className="text-sm font-semibold text-gray-500">Matches Feitos</span></div>
          <div><div className="flex items-baseline gap-1"><span className="text-4xl font-black text-[#111827]">8</span><span className="text-sm font-bold text-gray-400 uppercase">negócios</span></div><p className="text-xs font-bold text-orange-400 mt-1">4 em andamento hoje</p></div>
        </div>

        <div className="bg-[#063B2C] rounded-[24px] p-6 shadow-lg text-white flex flex-col justify-between h-40 relative overflow-hidden">
          <div className="absolute -bottom-10 -right-10 w-32 h-32 border-[20px] border-[#00C48C]/20 rounded-full blur-md"></div>
          <div className="flex items-center gap-3 z-10"><div className="bg-white/10 p-2 rounded-lg text-[#00C48C] border border-white/10"><Leaf size={20} /></div><span className="text-sm font-semibold text-white/80">Score ESG Revalor</span></div>
          <div className="z-10"><div className="text-5xl font-black text-white">A+</div><div className="w-full bg-white/20 h-1.5 rounded-full mt-3 overflow-hidden"><div className="bg-[#00C48C] w-[95%] h-full rounded-full"></div></div><p className="text-[11px] font-bold text-white/60 mt-1.5 uppercase tracking-wider">Top 5% geradores sustentáveis</p></div>
        </div>
      </div>

      {/* BARRA DE BUSCA E FILTROS */}
      <div className="bg-white p-2 pl-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 w-full"><Search className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400" size={20} /><input type="text" placeholder="Buscar por lote, material ou ID..." className="w-full pl-8 pr-4 py-2 text-sm outline-none bg-transparent" /></div>
        <div className="flex items-center gap-2"><button className="bg-[#111827] text-white text-xs font-bold px-4 py-2 rounded-lg">Todos</button><button className="bg-gray-50 hover:bg-gray-100 text-gray-600 text-xs font-bold px-4 py-2 rounded-lg transition-colors border border-gray-200">Construção Civil</button><button className="bg-gray-50 hover:bg-gray-100 text-gray-600 text-xs font-bold px-4 py-2 rounded-lg transition-colors border border-gray-200">Ativos ({listagensAtivas})</button><button className="bg-gray-50 hover:bg-gray-100 text-gray-600 p-2 rounded-lg transition-colors border border-gray-200"><Filter size={16} /></button></div>
      </div>

      {/* LISTA DE RESÍDUOS */}
      <div className="flex flex-col gap-4">
        {carregando ? (
           <div className="text-center py-10 text-gray-400 font-medium">Carregando seus lotes...</div>
        ) : (
          residuos.map((item) => (
            <div key={item.id} className="bg-white rounded-[24px] p-5 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              <div className="h-28 w-28 rounded-xl overflow-hidden relative shrink-0">
                <img src={item.imagem} alt={item.titulo} className="w-full h-full object-cover" />
                <div className={`absolute bottom-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-sm ${item.status === 'Ativo' ? 'bg-[#063B2C]/90 text-[#00C48C]' : 'bg-orange-500/90 text-white'}`}>
                  {item.status}
                </div>
              </div>

              <div className="flex-1">
                <p className="text-[11px] font-extrabold text-[#00C48C] uppercase tracking-wider mb-1">{item.categoria}</p>
                <h3 className="text-lg font-bold text-[#111827] leading-tight mb-2">{item.titulo}</h3>
                <div className="flex items-center gap-3 text-sm text-gray-500 font-medium">
                  <span className="bg-gray-100 px-2 py-1 rounded-md">{item.norma}</span>
                  <span className="flex items-center gap-1">• {item.estado_fisico}</span>
                  {item.valor && <span className="font-bold text-[#111827] ml-2">R$ {item.valor} / ton</span>}
                </div>
              </div>

              <div className="px-6 border-l border-gray-100 flex flex-col justify-center">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Volume</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-[#111827]">{item.volume_ton}</span>
                  <span className="text-sm font-bold text-gray-400">Ton</span>
                </div>
                <p className="text-xs text-gray-400 font-medium">{item.volume_kg.toLocaleString('pt-BR')} kg</p>
              </div>

              <div className="px-6 border-l border-gray-100 flex flex-col justify-center min-w-[200px]">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Interesse no Mercado</p>
                  <span className="text-[11px] font-bold text-[#00C48C]">{item.interesse}%</span>
                </div>
                <div className="w-full h-8 bg-gradient-to-t from-[#00C48C]/20 to-transparent border-b-2 border-[#00C48C] rounded-t-sm relative">
                  <div className="absolute bottom-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJub25lIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMCA1MCBDIDIwIDYwLCA0MCAyMCwgNjAgNTBDIDgwIDgwLCAxMDAgNDAsIDEwMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDBDNDhDIiBzdHJva2Utd2lkdGg9IjIiLz48L3N2Zz4=')] bg-no-repeat bg-cover opacity-50"></div>
                </div>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
}