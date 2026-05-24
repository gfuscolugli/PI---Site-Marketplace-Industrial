import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { Building2, Lock, Mail } from 'lucide-react';
import { AuthLayout } from '../../../layouts/AuthLayout';
import { AuthBox } from '../../../components/AuthBox';
import { realizarCadastro } from '../../../services/authService'; // IMPORTAMOS O SERVIÇO AQUI

export function Cadastro() {
  const navigate = useNavigate(); 

  const [razaoSocial, setRazaoSocial] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);

const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setCarregando(true);

    const novoUsuario = {
      tipo: 'INDUSTRIA',
      nome: razaoSocial,
      email: cnpj,      // O "CNPJ" que na verdade é o e-mail para o banco
      senha: senha 
    };

    try {
      // Chama o serviço e aguarda a resposta do Axios
      const resultado = await realizarCadastro(novoUsuario);

      if (resultado.sucesso) {
        alert('Cadastro realizado com sucesso!'); 
        navigate('/login'); 
      } else {
        // Exibe o erro real vindo do Back-end (ex: e-mail já existe)
        alert(resultado.mensagem);
      }
    } catch (error) {
      alert('Erro de conexão com o servidor.');
    } finally {
      // Libera o botão independente de sucesso ou erro
      setCarregando(false);
    }
  };

  return (
    <AuthLayout title="Cadastro de Empresa" footerText="Já tem uma conta?" footerLinkText="Faça login" footerLinkUrl="/login">
      <AuthBox>
        <form className="flex flex-col gap-6" onSubmit={handleCadastro}>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Razão Social</label>
              <div className="relative flex items-center">
                <Building2 size={18} className="absolute left-3 text-gray-400" />
                <input type="text" value={razaoSocial} onChange={(e) => setRazaoSocial(e.target.value)} required placeholder="Nome oficial da empresa" className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-revalor/50 focus:border-revalor transition-all placeholder:text-gray-400" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <div className="relative flex items-center">
                <Mail size={18} className="absolute left-3 text-gray-400" />
                <input type="text" value={cnpj} onChange={(e) => setCnpj(e.target.value)} required placeholder="exemplo@seuemail.com" className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-revalor/50 focus:border-revalor transition-all placeholder:text-gray-400" />
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