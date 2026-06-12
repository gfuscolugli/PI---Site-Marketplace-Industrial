import { useState, useEffect } from 'react';
import { Wallet, ArrowDownRight, ArrowUpRight, RefreshCcw, QrCode, Building, X, FileText, Copy } from 'lucide-react';
import api from '../../../services/api';

export function Dashboard() {
  const [saldo, setSaldo] = useState(0);
  const [carregando, setCarregando] = useState(true);

  const [modalDepositoAberto, setModalDepositoAberto] = useState(false);
  const [modalSaqueAberto, setModalSaqueAberto] = useState(false);
  const [valorInput, setValorInput] = useState('');
  
  // ALTERAÇÃO: Removido o TED das opções
  const [metodoPagamento, setMetodoPagamento] = useState<'PIX' | 'BOLETO'>('PIX');
  const [metodoSaque, setMetodoSaque] = useState<'PIX'>('PIX');

  const [dadosPix, setDadosPix] = useState<{ qrCodeBase64: string, copiaECola: string } | null>(null);

  const buscarSaldo = async () => {
    setCarregando(true);
    try {
      const response = await api.get('/transacoes/saldo'); 
      setSaldo(response.data.saldo);
    } catch (error) {
      console.error('Erro ao buscar saldo:', error);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    buscarSaldo();
  }, []);

  const handleTransacao = async (tipo: 'DEPOSITO' | 'SAQUE') => {
    if (!valorInput || isNaN(Number(valorInput)) || Number(valorInput) <= 0) {
      alert('Por favor, insira um valor válido maior que zero.');
      return;
    }

    try {
      const response = await api.post('/transacoes/financeiro', {
        tipo,
        valor: Number(valorInput),
        metodo: tipo === 'DEPOSITO' ? metodoPagamento : metodoSaque
      });
      
      if (tipo === 'DEPOSITO' && metodoPagamento === 'PIX') {
        setDadosPix({
          qrCodeBase64: response.data.qr_code_base64,
          copiaECola: response.data.qr_code
        });
        return; 
      }

      alert(`Solicitação de ${tipo === 'DEPOSITO' ? 'Depósito via ' + metodoPagamento : 'Saque via ' + metodoSaque} iniciada com sucesso!`);
      fecharModais();
      buscarSaldo();

    } catch (error: any) {
      alert(error.response?.data?.message || 'Erro ao processar transação.');
    }
  };

  const handleSimularPagamento = async () => {
    try {
      await api.post('/transacoes/simular-pagamento', { valor: Number(valorInput) });
      alert('SIMULAÇÃO DEV: Pagamento aprovado com sucesso! Seu saldo foi atualizado.');
      fecharModais();
      buscarSaldo();
    } catch (error) {
      alert('Erro ao simular o pagamento no ambiente de testes.');
    }
  };

  const fecharModais = () => {
    setModalDepositoAberto(false);
    setModalSaqueAberto(false);
    setValorInput('');
    setDadosPix(null);
  };

  const copiarPix = () => {
    if (dadosPix) {
      navigator.clipboard.writeText(dadosPix.copiaECola);
      alert('Código PIX copiado para a área de transferência!');
    }
  };

  const saldoNumerico = Number(saldo) || 0;
  
  const saldoFormatadoString = saldoNumerico.toLocaleString('pt-BR', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  });

  const partes = saldoFormatadoString.split(',');
  const parteInteira = partes[0];
  const parteCentavos = ',' + partes[1];
  const simboloMoeda = "R$";

  return (
    <div className="flex flex-col gap-8 max-w-[1200px] mx-auto w-full relative">
      
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-[32px] font-extrabold text-[#111827] tracking-tight">Painel Principal</h1>
          <p className="text-[#6B7280] mt-1 text-[15px]">
            Bem-vindo(a) de volta. Acompanhe o fluxo financeiro e circular da sua indústria.
          </p>
        </div>
        <button 
          onClick={buscarSaldo}
          className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 font-semibold text-sm px-4 py-2.5 rounded-xl shadow-sm hover:bg-gray-50 transition-colors"
        >
          <RefreshCcw size={16} className={carregando ? 'animate-spin' : ''} />
          Atualizar
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2 bg-[#063B2C] rounded-[32px] p-8 text-white relative overflow-hidden flex flex-col justify-between min-h-[240px] shadow-lg">
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
              <span className="text-2xl font-bold text-white/80">{simboloMoeda}</span>
              <span className="text-[56px] font-black leading-none tracking-tight">
                {carregando ? '...' : parteInteira}
              </span>
              <span className="text-2xl font-bold text-revalor">
                {carregando ? '' : parteCentavos}
              </span>
            </div>
            
            {saldoNumerico > 0 && !carregando && (
              <div className="inline-flex items-center gap-1.5 bg-revalor/20 text-revalor px-2.5 py-1 rounded-full text-xs font-bold mt-4 border border-revalor/20">
                <ArrowUpRight size={14} /> Dinheiro na conta
              </div>
            )}
            {saldoNumerico === 0 && !carregando && (
              <div className="inline-flex items-center gap-1.5 bg-white/10 text-white/70 px-2.5 py-1 rounded-full text-xs font-medium mt-4">
                <span>Nenhuma movimentação ainda</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <button 
            onClick={() => setModalDepositoAberto(true)}
            className="flex-1 bg-revalor hover:bg-[#047857] transition-colors rounded-[32px] p-6 text-white text-left relative overflow-hidden group shadow-md flex flex-col justify-center"
          >
            <div className="bg-white/20 w-fit p-2.5 rounded-xl mb-4">
              <ArrowDownRight size={20} />
            </div>
            <h3 className="text-2xl font-bold mb-1">Depositar</h3>
            <p className="text-white/80 text-sm">Adicione fundos para comprar</p>
            <QrCode size={80} className="absolute -bottom-4 -right-4 text-white/10 group-hover:scale-110 transition-transform duration-500" />
          </button>

          <button 
            onClick={() => setModalSaqueAberto(true)}
            className="flex-1 bg-white border border-gray-200 hover:border-gray-300 transition-colors rounded-[32px] p-6 text-left relative overflow-hidden group shadow-sm flex flex-col justify-center"
          >
            <div className="bg-gray-50 border border-gray-100 w-fit p-2.5 rounded-xl mb-4 text-gray-500">
              <ArrowUpRight size={20} />
            </div>
            <h3 className="text-2xl font-bold text-[#111827] mb-1">Sacar</h3>
            <p className="text-gray-500 text-sm">Transfira para sua conta bancária</p>
            <Building size={80} className="absolute -bottom-4 -right-4 text-gray-50 group-hover:scale-110 transition-transform duration-500" />
          </button>
        </div>
      </div>

      {/* MODAL DE DEPÓSITO */}
      {modalDepositoAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[32px] w-full max-w-md p-8 relative shadow-2xl animate-in fade-in zoom-in duration-200">
            <button onClick={fecharModais} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 p-2 rounded-full transition-colors">
              <X size={20} />
            </button>
            
            {dadosPix ? (
              <div className="flex flex-col items-center text-center animate-in slide-in-from-right-4">
                <div className="bg-revalor/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 text-revalor">
                  <QrCode size={32} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Escaneie o QR Code</h2>
                <p className="text-gray-500 mb-6 text-sm">Abra o app do seu banco e escaneie a imagem abaixo para concluir o depósito de R$ {valorInput}.</p>
                
                <div className="bg-white p-2 border-2 border-gray-100 rounded-2xl shadow-sm mb-6">
                  <img 
                    src={`data:image/jpeg;base64,${dadosPix.qrCodeBase64}`} 
                    alt="QR Code PIX" 
                    className="w-48 h-48"
                  />
                </div>

                <div className="w-full relative mb-6">
                  <input 
                    type="text" 
                    readOnly 
                    value={dadosPix.copiaECola} 
                    className="w-full pr-12 pl-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 outline-none"
                  />
                  <button 
                    onClick={copiarPix}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white text-gray-500 hover:text-revalor border border-gray-200 rounded-lg shadow-sm transition-colors"
                  >
                     <Copy size={16} />
                  </button>
                </div>

                <button 
                  onClick={fecharModais}
                  className="w-full bg-gray-900 hover:bg-black text-white font-bold text-[15px] py-3 rounded-2xl transition-colors shadow-lg mb-3"
                >
                  Concluir e Fechar
                </button>

                <button 
                  onClick={handleSimularPagamento}
                  className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[13px] py-2 rounded-xl transition-colors border border-emerald-200 flex items-center justify-center gap-2"
                >
                  🧪 (Modo Dev) Simular Pagamento
                </button>
              </div>
            ) : (
              <>
                <div className="bg-revalor/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-revalor">
                  <ArrowDownRight size={32} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Depositar na Carteira</h2>
                <p className="text-gray-500 mb-6 text-sm">Escolha a forma de pagamento e digite o valor que deseja adicionar à sua conta Revalor.</p>
                
                <div className="grid grid-cols-2 gap-2 mb-6 bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
                  <button onClick={() => setMetodoPagamento('PIX')} className={`py-2 flex flex-col items-center justify-center gap-1 rounded-xl text-xs font-bold transition-all ${metodoPagamento === 'PIX' ? 'bg-white shadow-sm text-revalor border border-gray-200/50' : 'text-gray-400 hover:text-gray-600'}`}>
                    <QrCode size={18} /> PIX
                  </button>
                  <button onClick={() => setMetodoPagamento('BOLETO')} className={`py-2 flex flex-col items-center justify-center gap-1 rounded-xl text-xs font-bold transition-all ${metodoPagamento === 'BOLETO' ? 'bg-white shadow-sm text-revalor border border-gray-200/50' : 'text-gray-400 hover:text-gray-600'}`}>
                    <FileText size={18} /> Boleto
                  </button>
                </div>

                <div className="relative mb-8">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-lg">R$</span>
                  <input 
                    type="number" 
                    value={valorInput}
                    onChange={(e) => setValorInput(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-2xl font-black text-gray-900 focus:ring-4 focus:ring-revalor/20 focus:border-revalor outline-none transition-all"
                  />
                </div>

                <button 
                  onClick={() => handleTransacao('DEPOSITO')}
                  className="w-full bg-revalor hover:bg-[#047857] text-white font-bold text-lg py-4 rounded-2xl transition-colors shadow-lg shadow-revalor/30"
                >
                  {metodoPagamento === 'PIX' && 'Gerar Código PIX'}
                  {metodoPagamento === 'BOLETO' && 'Gerar Boleto Bancário'}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* MODAL DE SAQUE */}
      {modalSaqueAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[32px] w-full max-w-md p-8 relative shadow-2xl animate-in fade-in zoom-in duration-200">
            <button onClick={fecharModais} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 p-2 rounded-full transition-colors">
              <X size={20} />
            </button>
            <div className="bg-gray-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-gray-600">
               <ArrowUpRight size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Sacar para o Banco</h2>
            <p className="text-gray-500 mb-6 text-sm">Escolha como deseja transferir o saldo para a conta vinculada ao seu CNPJ.</p>
            
            <div className="grid grid-cols-1 gap-2 mb-6 bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
              <button onClick={() => setMetodoSaque('PIX')} className={`py-2 flex flex-col items-center justify-center gap-1 rounded-xl text-xs font-bold transition-all bg-white shadow-sm text-gray-900 border border-gray-200/50`}>
                <QrCode size={18} /> Chave PIX
              </button>
            </div>

            <div className="relative mb-2">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-lg">R$</span>
              <input 
                type="number" 
                value={valorInput}
                onChange={(e) => setValorInput(e.target.value)}
                placeholder="0.00"
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-2xl font-black text-gray-900 focus:ring-4 focus:ring-gray-200 outline-none transition-all"
              />
            </div>
            <p className="text-right text-sm text-gray-500 mb-8 font-medium">Saldo disponível: <span className="text-gray-900 font-bold">
              {Number(saldo).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span></p>

            <button 
              onClick={() => handleTransacao('SAQUE')}
              className="w-full bg-gray-900 hover:bg-black text-white font-bold text-lg py-4 rounded-2xl transition-colors shadow-lg shadow-gray-900/30"
            >
              Confirmar Saque
            </button>
          </div>
        </div>
      )}

    </div>
  );
}