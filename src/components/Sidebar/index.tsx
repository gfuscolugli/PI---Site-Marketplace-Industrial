import { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Box, Repeat, LogOut, Recycle, User, ImagePlus } from 'lucide-react';

export function Sidebar() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null); 
  
  const [usuario, setUsuario] = useState<{ id: number; nome: string; logo_url?: string } | null>(null);
  const [showMenu, setShowMenu] = useState(false);

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
    localStorage.removeItem('revalor-token');
    localStorage.removeItem('revalor_usuario');
    navigate('/login');
  };

  const API_URL = 'http://localhost:3000'; 

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !usuario) return;

    const formData = new FormData();
    formData.append('logo', file);

    try {
      const response = await fetch(`${API_URL}/api/usuarios/${usuario.id}/logo`, {
        method: 'PUT',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        const usuarioAtualizado = { ...usuario, logo_url: data.logo_url };
        localStorage.setItem('revalor_usuario', JSON.stringify(usuarioAtualizado));
        setUsuario(usuarioAtualizado);
        setShowMenu(false); 
        alert('Logo atualizado com sucesso!');
      } else {
        alert('Erro ao atualizar logo.');
      }
    } catch (error) {
      console.error('Erro ao enviar logo:', error);
    }
  };

  return (
    <aside className="w-64 bg-[#0B132B] h-screen flex flex-col p-6 fixed left-0 top-0 z-40">
      
      {/* Logo Revalor */}
      <div className="flex items-center gap-2 mb-8 text-white">
        <div className="bg-revalor p-1.5 rounded-lg">
          <Recycle size={20} strokeWidth={2.5} />
        </div>
        <span className="text-xl font-bold">Revalor</span>
      </div>

      {/* ÁREA DO PERFIL COM DROPDOWN */}
      <div className="mb-8 relative">
        
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className="hidden" 
          accept="image/*"
        />

        <div 
          onClick={() => setShowMenu(!showMenu)}
          className="flex items-center gap-4 p-2 rounded-xl hover:bg-white/5 cursor-pointer transition-colors"
        >
          <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden border-2 border-revalor shrink-0">
            {usuario?.logo_url ? (
              <img 
                src={`${API_URL}${usuario.logo_url}`} 
                alt="Logo" 
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="text-gray-400" size={24} />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Empresa</p>
            <p className="text-white font-bold text-sm truncate" title={usuario?.nome}>
              {usuario ? usuario.nome : 'Carregando...'}
            </p>
          </div>
        </div>

        {/* MENU FLUTUANTE APENAS COM ALTERAR LOGO */}
        {showMenu && (
          <div className="absolute top-full left-0 mt-2 w-full bg-[#1A233A] border border-gray-700 rounded-xl shadow-lg p-2 z-50">
            
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-3 w-full p-3 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors text-left"
            >
              <ImagePlus size={18} className="text-revalor" />
              Alterar Logo
            </button>
            
          </div>
        )}
      </div>

      {/* Navegação Padrão */}
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