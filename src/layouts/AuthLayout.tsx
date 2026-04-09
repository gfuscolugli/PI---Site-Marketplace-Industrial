import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Recycle } from 'lucide-react';
// Ajuste o caminho do Container de acordo com a sua estrutura de pastas
import { Container } from "../components/container"; 

interface AuthLayoutProps {
  title: string;
  children: ReactNode; // Aqui é onde o seu AuthBox vai ser renderizado
  footerText: string;
  footerLinkText: string;
  footerLinkUrl: string;
  backUrl?: string;
}

export function AuthLayout({
  title,
  children,
  footerText,
  footerLinkText,
  footerLinkUrl,
  backUrl = "/"
}: AuthLayoutProps) {
  return (
    <Container>
      <div className="w-full min-h-screen flex justify-center items-center py-10">
        <div className="w-full max-w-md flex flex-col items-center">
          
          {/* Botão Voltar */}
          <div className="w-full mb-6">
            <Link to={backUrl} className="flex items-center gap-2 text-gray-500 hover:text-gray-800 text-sm font-medium transition-colors w-fit">
              <ArrowLeft size={16} /> Voltar
            </Link>
          </div>

          {/* Logo e Título Dinâmico */}
          <div className="flex flex-col items-center gap-3 mb-8">
            <div className="flex items-center gap-2">
              <div className="bg-revalor p-1.5 rounded-xl text-white flex items-center justify-center">
                <Recycle size={24} strokeWidth={2.5} />
              </div>
              <h1 className="text-[24px] font-bold text-[#111827]">Revalor</h1>
            </div>
            <h2 className="text-2xl font-bold text-[#111827]">{title}</h2>
          </div>

          {/* CONTEÚDO CENTRAL (Aqui entrará o AuthBox com o formulário) */}
          <div className="w-full">
            {children}
          </div>

          {/* Rodapé Dinâmico */}
          <div className="mt-8 text-sm text-gray-600">
            {footerText}{" "}
            <Link to={footerLinkUrl} className="text-revalor font-semibold hover:underline">
              {footerLinkText}
            </Link>
          </div>

        </div>
      </div>
    </Container>
  );
}