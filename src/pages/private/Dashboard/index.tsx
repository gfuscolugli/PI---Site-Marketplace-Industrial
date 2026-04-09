import { Wallet, ArrowDownRight, ArrowUpRight, RefreshCcw, QrCode, Building } from 'lucide-react';

export function Dashboard() {
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
        
        {/* Card Principal: Carteira Revalor (Ocupa 2 colunas) */}
        <div className="lg:col-span-2 bg-[#063B2C] rounded-[32px] p-8 text-white relative overflow-hidden flex flex-col justify-between min-h-[240px] shadow-lg">
          
          {/* Elementos Decorativos de Fundo (Simulando as linhas da imagem) */}
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
              <span className="text-2xl font-bold text-white/80">R$</span>
              <span className="text-[56px] font-black leading-none tracking-tight">34.850</span>
              <span className="text-2xl font-bold text-revalor">,50</span>
            </div>
            <div className="inline-flex items-center gap-1.5 bg-revalor/20 text-revalor px-2.5 py-1 rounded-full text-xs font-bold mt-4 border border-revalor/20">
              <ArrowUpRight size={14} /> +12.4% este mês
            </div>
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
            
            {/* Ícone decorativo invisível que aparece no hover */}
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