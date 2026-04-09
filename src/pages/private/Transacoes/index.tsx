import { useState, useEffect } from 'react';
import { ArrowRightLeft, Search, Filter, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { getTransacoes } from '../../../services/api';

export function Transacoes() {
  const [transacoes, setTransacoes] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    // Busca os dados simulados do serviço que espelha o banco MySQL
    getTransacoes().then(dados => {
      setTransacoes(dados);
      setCarregando(false);
    });
  }, []);

  // Formata a data para o padrão brasileiro
  const formatarData = (dataIso: string) => {
    return new Date(dataIso).toLocaleDateString('pt-BR');
  };

  // Renderiza badges coloridos baseados no STATUS definido no modelo físico
  const renderStatus = (status: string) => {
    switch (status) {
      case 'Concluído':
        return <span className="flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-bold"><CheckCircle2 size={14} /> Concluído</span>;
      case 'Em Andamento':
        return <span className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold"><Clock size={14} /> Em Andamento</span>;
      case 'Cancelado':
        return <span className="flex items-center gap-1.5 bg-red-50 text-red-700 px-3 py-1 rounded-full text-xs font-bold"><XCircle size={14} /> Cancelado</span>;
      default:
        return <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-bold">{status}</span>;
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-[1200px] mx-auto w-full">
      
      {/* Cabeçalho da Página */}
      <div className="flex items-center justify-between bg-white px-6 py-4 rounded-2xl shadow-sm border border-gray-200">
        <h1 className="text-xl font-bold text-[#111827]">Plataforma Revalor</h1>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-[32px] font-extrabold text-[#111827] tracking-tight">Histórico de Transações</h2>
          <p className="text-[#6B7280] mt-1 text-[15px]">Acompanhe as vendas e movimentações da sua empresa.</p>
        </div>
        <button className="flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-[#111827] font-bold text-sm px-5 py-3 rounded-xl shadow-sm transition-colors">
          <ArrowRightLeft size={18} />
          Exportar Relatório
        </button>
      </div>

      {/* Barra de Busca */}
      <div className="bg-white p-2 pl-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input type="text" placeholder="Buscar pelo ID da transação ou empresa..." className="w-full pl-8 pr-4 py-2 text-sm outline-none bg-transparent" />
        </div>
        <button className="bg-gray-50 hover:bg-gray-100 text-gray-600 p-2 rounded-lg border border-gray-200">
          <Filter size={16} />
        </button>
      </div>

      {/* Tabela de Dados baseada no Modelo Físico */}
      <div className="bg-white rounded-[24px] shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 font-bold">
                <th className="p-5">ID / Data</th>
                <th className="p-5">Resíduo / Comprador</th>
                <th className="p-5">Peso Final (TON)</th>
                <th className="p-5">Valor Total</th>
                <th className="p-5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {carregando ? (
                <tr>
                  <td colSpan={5} className="text-center py-20 text-gray-400 font-medium italic">
                    Consultando histórico no banco de dados...
                  </td>
                </tr>
              ) : (
                transacoes.map((t) => (
                  <tr key={t.id_transacao} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-5">
                      <p className="font-bold text-[#111827]">#{t.id_transacao}</p>
                      <p className="text-xs text-gray-500">{formatarData(t.data)}</p>
                    </td>
                    <td className="p-5">
                      <p className="font-bold text-[#111827]">{t.residuo_nome}</p>
                      <p className="text-sm text-gray-500">{t.empresa_compradora}</p>
                    </td>
                    <td className="p-5 font-medium text-gray-700">
                      {/* Campo PESO_FINAL do modelo físico */}
                      {Number(t.peso_final).toFixed(2)} t
                    </td>
                    <td className="p-5">
                      {/* Valor calculado pela aplicação conforme análise crítica do banco */}
                      <p className="font-bold text-[#00C48C]">
                        {t.valor_total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </p>
                    </td>
                    <td className="p-5">
                      {/* Reflete a coluna STATUS da tabela TRANSACAO */}
                      {renderStatus(t.status)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}