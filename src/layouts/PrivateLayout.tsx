// src/layouts/PrivateLayout.tsx
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';

export function PrivateLayout() {
  return (
    <div className="flex bg-[#F9FAFB] min-h-screen">
      {/* O menu lateral fixo na esquerda */}
      <Sidebar />
      
      {/* A área principal que empurra o conteúdo para a direita (ml-64 é a largura da sidebar) */}
      <main className="flex-1 ml-64 p-8">
        <Outlet />
      </main>
    </div>
  );
}