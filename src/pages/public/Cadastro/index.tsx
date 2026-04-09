import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { Factory, Recycle, Building2, FileText, Lock } from 'lucide-react';
import { AuthLayout } from '../../../layouts/AuthLayout';
import { AuthBox } from '../../../components/AuthBox';
import { realizarCadastro } from '../../../services/authService'; // IMPORTAMOS O SERVIÇO AQUI

export function Cadastro() {
  const navigate = useNavigate(); 

  const [tipoEmpresa, setTipoEmpresa] = useState<'geradora' | 'receptora'>('geradora');
  const [razaoSocial, setRazaoSocial] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setCarregando(true);

    const novoUsuario = {
      tipo: tipoEmpresa,
      nome: razaoSocial,
      documento: cnpj,
      senha: senha 
    };

    // CHAMA A FUNÇÃO EXTERNA EM VEZ DO LOCALSTORAGE DIRETO
    await realizarCadastro(novoUsuario);

    alert('Cadastro realizado com sucesso!'); 
    navigate('/login'); 
  };

  return (
    <AuthLayout title="Cadastro de Empresa" footerText="Já tem uma conta?" footerLinkText="Faça login" footerLinkUrl="/login">
      <AuthBox>
        <form className="flex flex-col gap-6" onSubmit={handleCadastro}>
          
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">O que sua empresa faz na rede?</label>
            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={() => setTipoEmpresa('geradora')} className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${ tipoEmpresa === 'geradora' ? 'border-revalor bg-revalor/5 text-revalor' : 'border-gray-200 hover:border-gray-300 text-gray-500 bg-white' }`}>
                <Factory size={24} className="mb-2" />
                <span className="font-semibold text-sm">Geradora</span>
                <span className="text-[10px] text-center mt-1 opacity-80 leading-tight">Gero resíduos e quero destinar</span>
              </button>

              <button type="button" onClick={() => setTipoEmpresa('receptora')} className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${ tipoEmpresa === 'receptora' ? 'border-revalor bg-revalor/5 text-revalor'  : 'border-gray-200 hover:border-gray-300 text-gray-500 bg-white' }`}>
                <Recycle size={24} className="mb-2" />
                <span className="font-semibold text-sm">Receptora</span>
                <span className="text-[10px] text-center mt-1 opacity-80 leading-tight">Compro/Reciclo materiais</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Razão Social</label>
              <div className="relative flex items-center">
                <Building2 size={18} className="absolute left-3 text-gray-400" />
                <input type="text" value={razaoSocial} onChange={(e) => setRazaoSocial(e.target.value)} required placeholder="Nome oficial da empresa" className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-revalor/50 focus:border-revalor transition-all placeholder:text-gray-400" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">CNPJ</label>
              <div className="relative flex items-center">
                <FileText size={18} className="absolute left-3 text-gray-400" />
                <input type="text" value={cnpj} onChange={(e) => setCnpj(e.target.value)} required placeholder="00.000.000/0001-00" className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-revalor/50 focus:border-revalor transition-all placeholder:text-gray-400" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Criar Senha</label>
              <div className="relative flex items-center">
                <Lock size={18} className="absolute left-3 text-gray-400" />
                <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required placeholder="••••••••" className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-revalor/50 focus:border-revalor transition-all placeholder:text-gray-400" />
              </div>
            </div>
          </div>

          <button type="submit" disabled={carregando} className="w-full bg-revalor hover:opacity-90 disabled:opacity-70 text-white font-semibold py-3 rounded-lg mt-2 transition-all shadow-sm flex items-center justify-center">
            {carregando ? 'Salvando dados...' : 'Concluir Cadastro'}
          </button>

        </form>
      </AuthBox>
    </AuthLayout>
  );
}