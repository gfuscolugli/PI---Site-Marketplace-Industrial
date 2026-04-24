import { useState, useEffect } from 'react';
import { Wallet, ArrowDownRight, ArrowUpRight, RefreshCcw, QrCode, Building } from 'lucide-react';

export function Dashboard() {
  // 1. Estado para guardar o saldo do utilizador (começa em 0)
  const [saldo, setSaldo] = useState(0);

  // 2. Simula a ida ao Back-end buscar o saldo quando a página carrega
  // No futuro, trocaremos isto por uma chamada à sua API (ex: api.get('/carteira'))
  useEffect(() => {
    // Para testar o fluxo de conta nova, deixamos o saldo a 0.
    // Se quiser testar depois com dinheiro, mude este número.
    setSaldo(0); 
  }, []);

  // 3. Função para formatar o número como Moeda Real (BRL)
  const formatarMoeda = (valor: number) => {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  // 4. Vamos dividir o número formatado para manter o seu design bonitão
  // Ex: "R$ 0,00" -> Símbolo: "R$", Inteiro: "0", Centavos: ",00"
  const saldoFormatado = formatarMoeda(saldo);
  const simboloMoeda = "R$";
  // Pega a parte antes da vírgula (ex: " 0")
  const parteInteira = saldoFormatado.replace("R$", "").split(",")[0].trim(); 
  // Pega a parte depois da vírgula (ex: "00") e põe a vírgula de volta
  const parteCentavos = "," + saldoFormatado.split(",")[1];

  return (
    <div className="flex flex-col gap-8 max-w-[1200px] mx-auto w-full">
      
      {/* Cabeçalho */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-[32px] font-extrabold text-[#111827] tracking-tight">Painel Principal</h1>
          <p className="text-[#6B7280] mt-1 text-[15px]">
            Bem-vindo(a) de volta. Acompanhe o fluxo financeiro e circular da sua indústria.
          </p>
        </div>
        <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 font-semibold text-sm px-4 py-2.5 rounded-xl shadow-sm hover:bg-gray-50 transition-colors">
          <RefreshCcw size={16} />
          Atualizar
        </button>
      </div>

      {/* Grid de Cards Superiores */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Card Principal: Carteira Revalor */}
        <div className="lg:col-span-2 bg-[#063B2C] rounded-[32px] p-8 text-white relative overflow-hidden flex flex-col justify-between min-h-[240px] shadow-lg">
          
          {/* Elementos Decorativos de Fundo */}
          <div className="absolute -right-10 -top-10 w-64 h-64 border-[30px] border-white/5 rounded-full blur-xl pointer-events-none"></div>
          <div className="absolute -bottom-20 -left-10 w-80 h-80 border-[40px] border-revalor/10 rounded-full blur-2xl pointer-events-none"></div>

          <div className="flex items-center gap-3 z-10">
            <div className="bg-white/10 p-2.5 rounded-xl border border-white/10">
              <Wallet size={24} className="text-[#A7F3D0]" />
            </div>
            <span className="font-bold tracking-widest text-[13px] text-[#A7F3D0] uppercase">Carteira Revalor</span>
          </div>

          <div className="z-10 mt-8">
            <p className="text-white/70 text-sm font-medium mb-1">Saldo Disponível</p>
            <div className="flex items-baseline gap-1">
              {/* RENDEREZAÇÃO DINÂMICA DO SALDO */}
              <span className="text-2xl font-bold text-white/80">{simboloMoeda}</span>
              <span className="text-[56px] font-black leading-none tracking-tight">{parteInteira}</span>
              <span className="text-2xl font-bold text-revalor">{parteCentavos}</span>
            </div>
            
            {/* O percentual também deve ser dinâmico no futuro. Se o saldo for 0, escondemos. */}
            {saldo > 0 && (
              <div className="inline-flex items-center gap-1.5 bg-revalor/20 text-revalor px-2.5 py-1 rounded-full text-xs font-bold mt-4 border border-revalor/20">
                <ArrowUpRight size={14} /> +12.4% este mês
              </div>
            )}
            {saldo === 0 && (
              <div className="inline-flex items-center gap-1.5 bg-white/10 text-white/70 px-2.5 py-1 rounded-full text-xs font-medium mt-4">
                Nenhuma movimentação ainda
              </div>
            )}
          </div>
        </div>

        {/* Coluna da Direita (Ações Rápidas) */}
        <div className="flex flex-col gap-6">
          
          {/* Card: Depositar */}
          <button className="flex-1 bg-revalor hover:bg-[#047857] transition-colors rounded-[32px] p-6 text-white text-left relative overflow-hidden group shadow-md flex flex-col justify-center">
            <div className="bg-white/20 w-fit p-2.5 rounded-xl mb-4">
              <ArrowDownRight size={20} />
            </div>
            <h3 className="text-2xl font-bold mb-1">Depositar</h3>
            <p className="text-white/80 text-sm">Adicione fundos para comprar</p>
            <QrCode size={80} className="absolute -bottom-4 -right-4 text-white/10 group-hover:scale-110 transition-transform duration-500" />
          </button>

          {/* Card: Sacar */}
          <button className="flex-1 bg-white border border-gray-200 hover:border-gray-300 transition-colors rounded-[32px] p-6 text-left relative overflow-hidden group shadow-sm flex flex-col justify-center">
            <div className="bg-gray-50 border border-gray-100 w-fit p-2.5 rounded-xl mb-4 text-gray-500">
              <ArrowUpRight size={20} />
            </div>
            <h3 className="text-2xl font-bold text-[#111827] mb-1">Sacar</h3>
            <p className="text-gray-500 text-sm">Transfira para sua conta bancária</p>
            <Building size={80} className="absolute -bottom-4 -right-4 text-gray-50 group-hover:scale-110 transition-transform duration-500" />
          </button>

        </div>

      </div>

    </div>
  );
}