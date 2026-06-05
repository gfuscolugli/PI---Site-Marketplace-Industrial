import { useState, useEffect } from 'react';
import { Search, Filter, Download } from 'lucide-react';
import { getTransacoes } from '../../../services/api';

export function Transacoes() {
  const [transacoes, setTransacoes] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [termoBusca, setTermoBusca] = useState('');

  useEffect(() => {
    const carregarHistorico = async () => {
      try {
        const dados = await getTransacoes();
        setTransacoes(dados);
      } catch (error) {
        console.error("Erro ao carregar histórico", error);
      } finally {
        setCarregando(false);
      }
    };
    carregarHistorico();
  }, []);

  // Filtro básico pelo ID da transação ou tipo
  const transacoesFiltradas = transacoes.filter(t => 
    t.id.toString().includes(termoBusca) || 
    t.tipo.toLowerCase().includes(termoBusca.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 max-w-[1200px] mx-auto w-full p-6 text-gray-900 h-full">
      
      <div className="bg-white px-6 py-4 rounded-2xl shadow-sm border border-gray-200">
        <h1 className="text-xl font-bold text-[#111827]">Plataforma Revalor</h1>
      </div>

      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black mb-2">Histórico de Transações</h2>
          <p className="text-gray-500">Acompanhe as vendas e movimentações da sua empresa.</p>
        </div>
        <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl hover:bg-gray-50 transition shadow-sm font-semibold text-sm">
          <Download size={18} /> Exportar Relatório
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input 
          type="text" 
          placeholder="Buscar pelo ID da transação ou tipo..." 
          value={termoBusca}
          onChange={(e) => setTermoBusca(e.target.value)}
          className="w-full pl-12 pr-12 py-4 bg-white border border-gray-200 rounded-2xl text-sm focus:ring-2 focus:ring-revalor/50 outline-none shadow-sm"
        />
        <button className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
          <Filter size={20} />
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex-1">
        {carregando ? (
          <div className="flex justify-center items-center h-40">
            <div className="w-8 h-8 border-4 border-revalor border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead className="bg-gray-50/50 border-b border-gray-100 text-[11px] text-gray-500 uppercase font-black tracking-wider">
                <tr>
                  <th className="py-5 px-6">ID / Data</th>
                  <th className="py-5 px-6">Tipo / Descrição</th>
                  {/* ALTERADO AQUI: Cabeçalho agora é kg */}
                  <th className="py-5 px-6 text-center">Peso (kg)</th>
                  <th className="py-5 px-6">Valor Total</th>
                  <th className="py-5 px-6">Produto</th>
                </tr>
              </thead>
              <tbody>
                {transacoesFiltradas.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-gray-500">
                      Nenhuma transação encontrada no momento.
                    </td>
                  </tr>
                ) : (
                  transacoesFiltradas.map((t) => (
                    <tr key={t.id} className="border-b border-gray-50 hover:bg-gray-50/80 transition-colors">
                      <td className="py-4 px-6">
                        <p className="font-bold text-gray-900">#{t.id}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{new Date(t.createdAt).toLocaleDateString('pt-BR')}</p>
                      </td>
                      <td className="py-4 px-6">
                        <p className="font-bold text-gray-900">{t.tipo}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{t.descricao || 'Movimentação via plataforma'}</p>
                      </td>
                      {/* ALTERADO AQUI: Multiplicando por 1000 para converter Ton -> Kg */}
                      <td className="py-4 px-6 text-center">
                        <p className="font-medium text-gray-700">
                          {t.pesoComprado ? `${Number(t.pesoComprado) * 1000} kg` : '--'}
                        </p>
                      </td>
                      <td className="py-4 px-6">
                        <p className={`font-black ${t.tipo === 'DEPOSITO' || t.tipo === 'VENDA' ? 'text-green-600' : 'text-gray-900'}`}>
                          {t.tipo === 'DEPOSITO' || t.tipo === 'VENDA' ? '+' : ''} R$ {Number(t.valorTotal).toFixed(2)}
                        </p>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-bold text-gray-800 bg-gray-100 px-3 py-1.5 rounded-lg text-xs uppercase inline-block">
                          {t.residuo?.nome || '--'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}