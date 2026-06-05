import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import { Recycle } from 'lucide-react';

export default function Navbar() {
  return (

    <nav className="sticky top-0 z-50 flex items-center justify-between w-full h-20 px-8 lg:px-[120px] bg-white/90 backdrop-blur-sm border-b border-gray-100 font-outfit">
      
    <div className="flex items-center gap-2">
      <div className="bg-revalor p-1.5 rounded-xl text-white flex items-center justify-center">
        <Recycle size={24} strokeWidth={2.5} />
      </div>
        <div>
          <h1 className="text-[24px] font-bold text-[#111827]">Revalor</h1>
        </div>
    </div>

      <div className="hidden md:block">
        <ul className="flex items-center gap-[24px]">
          <li>
            <a href="#como-funciona" className="text-[#6B7280] text-[16px] font-[500] transition-colors hover:text-revalor">
              Como Funciona
            </a>
          </li>
          <li>
            <a href="#beneficios" className="text-[#6B7280] text-[16px] font-[500] transition-colors hover:text-revalor">
              Benefícios
            </a>
          </li>
          
          <li>
            <Link to="/login">
              <button className="flex items-center gap-[8px] px-[20px] py-[10px] text-[16px] font-bold text-white bg-revalor rounded-full transition-all duration-200 hover:brightness-95 hover:shadow-lg hover:shadow-revalor-emerald/20 group">
                Acessar Plataforma
                <svg 
                  className="w-5 h-5 transition-transform group-hover:translate-x-1" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor" 
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </Link>
          </li>
        </ul>
      </div>

    </nav>
  );
}