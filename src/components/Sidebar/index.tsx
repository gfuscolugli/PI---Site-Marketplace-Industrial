import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Box, Repeat, LogOut, Recycle } from 'lucide-react';

export function Sidebar() {
  const navigate = useNavigate();

  // 1. Criamos o estado para guardar o usuário
  const [usuario, setUsuario] = useState<{ nome: string; tipo: string } | null>(null);

  // 2. Buscamos os dados salvos no login
  useEffect(() => {
    const usuarioSalvo = localStorage.getItem('revalor_usuario');
    if (usuarioSalvo) {
      setUsuario(JSON.parse(usuarioSalvo));
    }
  }, []);

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Marketplace', icon: ShoppingBag, path: '/marketplace' },
    { name: 'Meus Resíduos', icon: Box, path: '/meus-residuos' },
    { name: 'Transações', icon: Repeat, path: '/transacoes' },
  ];

  const handleSair = () => {
    // 3. Limpamos os dados corretamente (usando os nomes exatos do authService)
    localStorage.removeItem('revalor-token');
    localStorage.removeItem('revalor_usuario');
    navigate('/login');
  };

  return (
    <aside className="w-64 bg-[#0B132B] h-screen flex flex-col p-6 fixed left-0 top-0">
      
      {/* Logo */}
      <div className="flex items-center gap-2 mb-10 text-white">
        <div className="bg-revalor p-1.5 rounded-lg">
          <Recycle size={20} strokeWidth={2.5} />
        </div>
        <span className="text-xl font-bold">Revalor</span>
      </div>

      {/* Info Empresa Logada */}
      <div className="mb-10">
        <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Empresa Logada</p>
        
        {/* NOME DO USUÁRIO DINÂMICO */}
        <p className="text-white font-bold text-sm truncate" title={usuario?.nome}>
          {usuario ? usuario.nome : 'Carregando...'}
        </p>
        
        {/* TIPO DE USUÁRIO DINÂMICO */}
        <p className="text-revalor text-xs flex items-center gap-1 mt-1">
          <span className="w-1.5 h-1.5 bg-revalor rounded-full"></span> 
          Perfil: {usuario?.tipo === 'INDUSTRIA' ? 'Geradora' : 'Receptora'}
        </p>
      </div>

      {/* Navegação */}
      <nav className="flex flex-col gap-2 flex-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive 
                ? 'bg-revalor/10 text-revalor font-bold' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`
            }
          >
            <item.icon size={20} />
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* Botão Sair */}
      <button 
        onClick={handleSair}
        className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-red-400 transition-colors mt-auto border-t border-gray-800 pt-6 w-full text-left"
      >
        <LogOut size={20} />
        Sair da Conta
      </button>
    </aside>
  );
}