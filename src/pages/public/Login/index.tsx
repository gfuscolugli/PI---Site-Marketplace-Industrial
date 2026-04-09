import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react'; 
import { AuthLayout } from '../../../layouts/AuthLayout';
import { AuthBox } from '../../../components/AuthBox';
import { realizarLogin } from '../../../services/authService'; 

export function Login() {
  const navigate = useNavigate();

  const [cnpj, setCnpj] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setErro(''); 
    setCarregando(true);

    const resposta = await realizarLogin(cnpj, senha);

    if (resposta.sucesso) {
      navigate('/dashboard'); 
    } else {
      setErro(resposta.mensagem || 'Erro ao fazer login.');
    }
    
    setCarregando(false);
  };

  return (
    <AuthLayout title="Acesse sua conta" footerText="Não tem uma conta?" footerLinkText="Cadastre sua empresa" footerLinkUrl="/cadastro">
      <AuthBox>
        <form className="flex flex-col gap-5" onSubmit={handleLogin}>
          
          {erro && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100 text-center font-medium">
              {erro}
            </div>
          )}
          
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">CNPJ</label>
            <div className="relative flex items-center">
              <Mail size={18} className="absolute left-3 text-gray-400" />
              <input type="text" value={cnpj} onChange={(e) => setCnpj(e.target.value)} required placeholder="00.000.000/0001-00" className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-revalor/50 focus:border-revalor transition-all" />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Senha</label>
            <div className="relative flex items-center">
              <Lock size={18} className="absolute left-3 text-gray-400"/>
              <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required placeholder="••••••••" className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-revalor/50 focus:border-revalor transition-all" />
            </div>          
          </div>

          <div className="flex items-center justify-between mt-1">
            <div className="flex items-center gap-2">
              <input type="checkbox" id="lembrar" className="w-4 h-4 text-revalor rounded border-gray-300 accent-revalor" />
              <label htmlFor="lembrar" className="text-sm text-gray-600">Lembrar de mim</label>
            </div>
            <Link to="#" className="text-sm text-revalor hover:underline font-medium">Esqueceu a senha?</Link>
          </div>

          <button type="submit" disabled={carregando} className="w-full bg-revalor hover:opacity-90 disabled:opacity-70 text-white font-semibold py-3 rounded-lg mt-2 transition-all shadow-sm flex items-center justify-center">
            {carregando ? 'Entrando...' : 'Entrar na Plataforma'}
          </button>

        </form>
      </AuthBox>
    </AuthLayout>
  );
}