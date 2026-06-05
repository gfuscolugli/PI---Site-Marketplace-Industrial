import { useState, useEffect } from 'react';
import { Plus, Package, Trash2 } from 'lucide-react';
import { getMeusResiduos, adicionarResiduo, excluirResiduo } from '../../../services/api';


export function MeusResiduos() {
  const [residuos, setResiduos] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [salvando, setSalvando] = useState(false);
  
  // 1. O NOVO ESTADO DA IMAGEM ESTÁ AQUI
  const [imagem, setImagem] = useState<File | null>(null);
  
  const [form, setForm] = useState({
    titulo: '',
    descricao: '',
    quantidade: '',
    valor: ''
  });

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const dados = await getMeusResiduos();
      console.log("DADOS RECEBIDOS DO BACKEND:", dados);
      
      const listaFinal = Array.isArray(dados) ? dados : (dados.residuos || []);
      setResiduos(listaFinal);
    } catch (error) {
      console.error("Erro ao carregar seus resíduos:", error);
    } finally {
      setCarregando(false);
    }
  };

 const handleAdicionar = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalvando(true);

    try {
      // Verifica se o usuário escolheu uma imagem
      if (imagem) {
        // MODO 1: Com Imagem (Envia como FormData / Multipart)
        const formData = new FormData();
        formData.append('nome', form.titulo);
        formData.append('descricao', form.descricao || 'Sem descrição');
        formData.append('estadoFisico', 'Sólido');
        formData.append('categorias', 'Geral');
        formData.append('pesoDisponivel', form.quantidade.toString());
        formData.append('valorPorKg', form.valor.toString());
        formData.append('imagem', imagem);

        await adicionarResiduo(formData); 
      } else {
        // MODO 2: Sem Imagem (Envia como JSON tradicional que o Back-end já entende)
        const payloadJSON = {
          nome: form.titulo,
          descricao: form.descricao || 'Sem descrição',
          estadoFisico: 'Sólido',
          categorias: 'Geral',
          pesoDisponivel: Number(form.quantidade),
          valorPorKg: Number(form.valor)
        };

        await adicionarResiduo(payloadJSON);
      }

      // Se deu tudo certo, recarrega e limpa a tela
      await carregarDados(); 
      setForm({ titulo: '', descricao: '', quantidade: '', valor: '' });
      setImagem(null); 
      setModalAberto(false);

    } catch (error) {
      console.error(error);
      alert("Erro ao publicar lote. Verifique se a API está online e aceitando os dados.");
    } finally {
      setSalvando(false);
    }
  };
  
  const handleExcluir = async (id: any) => {
  // Exibe um aviso de confirmação nativo do navegador para evitar cliques acidentais
  if (!window.confirm("Tem certeza que deseja excluir permanentemente este lote de resíduo?")) {
    return; 
  }

  try {
    await excluirResiduo(id);

    // Recarrega a lista da tela chamando a função que você já deixou pronta
    await carregarDados(); 

    alert("Lote excluído com sucesso!");
  } catch (error) {
    console.error("Erro ao excluir:", error);
    alert("Não foi possível excluir o lote. Verifique se o Back-end está ativo.");
  }
};

  const volumeTotal = residuos.reduce((acc, item) => acc + (Number(item.pesoDisponivel) || 0), 0);

  return (
    <div className="flex flex-col gap-6 max-w-[1200px] mx-auto w-full p-6 text-gray-900">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Meus Resíduos</h1>
          <p className="text-gray-500 text-sm">Gerencie os lotes de {residuos.length > 0 ? 'Lugli' : 'sua empresa'}.</p>
        </div>
        <button onClick={() => setModalAberto(true)} className="flex items-center gap-2 bg-[#063B2C] text-white px-5 py-2.5 rounded-xl hover:bg-[#047857] transition shadow-md font-semibold">
          <Plus size={20} /> Adicionar Resíduo
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-gray-500 text-xs font-bold uppercase mb-1">Volume Total Disponível</p>
          <h2 className="text-3xl font-black">{volumeTotal.toFixed(1)} Ton</h2>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-gray-500 text-xs font-bold uppercase mb-1">Listagens Ativas</p>
          <h2 className="text-3xl font-black">{residuos.length}</h2>
        </div>
      </div>

      {carregando ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-revalor border-t-transparent rounded-full animate-spin"></div></div>
      ) : residuos.length === 0 ? (
        <div className="bg-white p-20 rounded-2xl border border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400">
          <Package size={48} className="mb-4 opacity-20" />
          <p>Você ainda não possui resíduos cadastrados no banco real.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {residuos.map((item) => (
            <div key={item.id} className="bg-white p-6 rounded-2xl border border-gray-100 flex justify-between items-center shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-revalor"><Package size={24} /></div>
                <div>
                  <h3 className="font-bold text-lg">{item.nome}</h3>
                  <p className="text-xs text-gray-500 uppercase font-bold">{item.categorias} • {item.estadoFisico}</p>
                </div>
              </div>
              {/* Substitua a div text-right antiga por este bloco inteiro */}
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-2xl font-black">{item.pesoDisponivel} Ton</p>
                  <p className="text-sm font-bold text-revalor">R$ {Number(item.valorPorKg).toFixed(2)} / kg</p>
                </div>

                {/* AQUI ESTÁ A LIXEIRA SENDO USADA! O erro do VS Code vai sumir na hora */}
                <button 
                  onClick={() => handleExcluir(item.id)}
                  className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 cursor-pointer"
                  title="Excluir Lote"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalAberto && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <form onSubmit={handleAdicionar} className="bg-white p-8 rounded-[32px] w-full max-w-md flex flex-col gap-5 shadow-2xl">
            <h2 className="text-2xl font-bold">Novo Lote</h2>
            <input placeholder="Título" className="border p-3.5 rounded-xl outline-none focus:ring-2 focus:ring-revalor/20" value={form.titulo} onChange={e => setForm({...form, titulo: e.target.value})} required />
            <input placeholder="Descrição" className="border p-3.5 rounded-xl outline-none focus:ring-2 focus:ring-revalor/20" value={form.descricao} onChange={e => setForm({...form, descricao: e.target.value})} />
            
            <div className="grid grid-cols-2 gap-4">
              <input type="number" placeholder="Peso (Ton)" className="border p-3.5 rounded-xl outline-none focus:ring-2 focus:ring-revalor/20" value={form.quantidade} onChange={e => setForm({...form, quantidade: e.target.value})} required />
              <input type="number" placeholder="R$ / Kg" className="border p-3.5 rounded-xl outline-none focus:ring-2 focus:ring-revalor/20" value={form.valor} onChange={e => setForm({...form, valor: e.target.value})} required />
            </div>

            {/* 3. A CAIXA DE UPLOAD DE IMAGEM */}
            <div className="flex flex-col gap-1.5 mt-1">
              <label className="text-sm font-medium text-gray-700">Foto do Material</label>
              <div className="relative flex items-center justify-center w-full">
                <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <span className="text-sm text-gray-500 font-medium text-center px-2">
                      {imagem ? imagem.name : "Clique para anexar foto"}
                    </span>
                  </div>
                  <input 
                    id="dropzone-file" 
                    type="file" 
                    accept="image/png, image/jpeg, image/jpg"
                    className="hidden" 
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setImagem(e.target.files[0]);
                      }
                    }} 
                  />
                </label>
              </div>
            </div>

            <div className="flex gap-3 mt-2">
              <button type="button" onClick={() => setModalAberto(false)} className="flex-1 p-3.5 border rounded-xl font-bold">Cancelar</button>
              <button type="submit" disabled={salvando} className="flex-1 p-3.5 bg-revalor text-white rounded-xl font-bold hover:bg-[#047857] shadow-md transition-all">
                {salvando ? 'Publicando...' : 'Publicar Lote'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}