import Image1 from '../../../assets/main-foto2.png';
import { PackageSearch, Truck, FileUp, RefreshCw, Recycle, Camera, Mail, Globe } from 'lucide-react';
export default function Home() {
  return (
    <div className="font-outfit">
      
      {/* HERO SECTION */}
      <section className="bg-white flex flex-col lg:flex-row items-center px-8 lg:px-[120px] py-[80px] gap-[60px] min-h-[calc(100vh-80px)]">
        
        <div className="flex flex-col flex-1 gap-[24px] justify-center">
          <span className="bg-[#e6f4ee] text-revalor rounded-full px-[16px] py-[6px] text-[14px] font-semibold inline-flex items-center gap-[8px] self-start">
            <span className="inline-block w-[8px] h-[8px] bg-revalor rounded-full"></span>
            A Plataforma B2B de Economia Circular
          </span>
          
          <h1 className="text-[52px] lg:text-[64px] font-[800] text-[#111827] leading-[1.1] tracking-tight">
            Transforme <span className="text-revalor">Resíduos</span> em Receita e Matéria-Prima
          </h1>
          
          <p className="text-[#6B7280] text-[20px] leading-relaxed max-w-[90%]">
            Conectamos indústrias que geram entulho e resíduos industriais com empresas que os utilizam como insumo sustentável. Reduza custos, alcance metas ESG e lucre com a logística reversa.
          </p>
          
          <div className="flex flex-wrap items-center gap-[16px] mt-[8px]">
            <button className="bg-revalor text-white rounded-xl px-[32px] py-[16px] text-[16px] font-bold flex items-center gap-[8px] transition-transform hover:scale-105 shadow-lg shadow-revalor/20 group">
              Acessar Plataforma 
              <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </button>
            <button className="bg-white border-[2px] border-[#E5E7EB] text-[#374151] rounded-xl px-[32px] py-[16px] text-[16px] font-bold transition-colors hover:border-revalor hover:text-revalor">
              Falar com consultor
            </button>
          </div>
        </div>

        <div className="flex-1 w-full relative">
          <img src={Image1} alt="Trabalhadores gerenciando resíduos" className="w-full h-auto rounded-[24px] object-cover shadow-2xl" />
          
          <div className="absolute bottom-6 left-6 bg-white p-5 rounded-2xl shadow-xl flex flex-col gap-2 w-64">
            <div className="w-[48px] h-[48px] rounded-full bg-[#e6f4ee] flex items-center justify-center text-revalor flex-shrink-0">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
            </div>
            <div>
              <p className="text-[12px] font-bold text-[#6B7280] uppercase tracking-wider">Impacto Gerado</p>
              <p className="text-[20px] font-[800] text-[#111827]">+50k Toneladas</p>
              <p className="text-[10px] text-[#9CA3AF] mt-1 leading-tight">de resíduos desviados de aterros sanitários este ano.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO: COMO FUNCIONA */}
      <section id="como-funciona" className="bg-[#F9FAFB] flex flex-col items-center py-[100px] px-8 lg:px-[120px]">
        <div className="text-center mb-[60px]">
          <h4 className="text-revalor uppercase text-[14px] font-[800] tracking-[1px] mb-[12px]">Logística Reversa Simplificada</h4>
          <h2 className="text-[40px] font-[800] text-[#111827] mb-[16px]">O Ciclo da Economia Inteligente</h2>
          <p className="text-[#6B7280] text-[18px] max-w-[600px] mx-auto">
            Nossa plataforma gerencia todo o processo ponta a ponta, desde a triagem até a emissão de relatórios ambientais. Você foca no seu core business.
          </p>
        </div>

        <div className="flex flex-wrap lg:flex-nowrap gap-4 w-full"> 
          {[
            {
              step: "1", title: "Cadastro do Resíduo",
              text: "A indústria geradora cadastra o volume, tipo e composição dos resíduos na plataforma Revalor.",
              icon: PackageSearch
            },
            {
              step: "2", title: "Match Inteligente B2B",
              text: "Nosso algoritmo cruza a oferta com empresas parceiras que buscam exatamente esse material.",
              icon: RefreshCw
            },
            {
              step: "3", title: "Logística e Transporte",
              text: "A Revalor coordena a coleta e o frete de forma otimizada, garantindo segurança e agilidade.",
              icon: Truck
            },
            {
              step: "4", title: "Rastreabilidade Total",
              text: "Geração automática de certificados de destinação final e manifestos de transporte.",
              icon: FileUp
            }
          ].map((item, index) => {
            const Icon = item.icon;

            return (
              <div key={index} className="bg-white p-[32px] rounded-[24px] shadow-sm border border-[#F3F4F6] flex-1 z-10 flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all">
                <div className="w-[64px] h-[64px] rounded-2xl bg-white border border-[#E5E7EB] shadow-sm flex items-center justify-center text-revalor mb-[24px]">
                  <Icon size={28} strokeWidth={2} />
                </div>
                <h3 className="text-[20px] font-[800] text-[#111827] mb-[12px]">{item.step}. {item.title}</h3>
                <p className="text-[#6B7280] text-[15px] leading-relaxed">{item.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* SEÇÃO: BENEFÍCIOS */}
      <section id="beneficios" className="bg-[#0B132B] flex flex-col items-center py-[100px] px-8 lg:px-[120px]">
        <div className="text-center mb-[64px]">
          <h4 className="text-revalor uppercase text-[14px] font-[800] tracking-[1px] mb-[12px]">Valor para os dois lados</h4>
          <h2 className="text-[40px] font-[800] text-white mb-[16px]">Uma rede onde todos ganham</h2>
          <p className="text-[#9CA3AF] text-[18px] max-w-[650px] mx-auto">
            A Revalor não é apenas um marketplace, é um ecossistema projetado para gerar vantagem competitiva e sustentabilidade real para toda a cadeia produtiva.
          </p>
        </div>

        <div className="flex flex-col xl:flex-row gap-[32px] w-full">
          
          {/* Card: Quem GERA */}
          <div className="flex-1 bg-[#111C38] rounded-[32px] p-[48px] border border-[#1E293B]">
            <div className="flex items-center gap-[20px] mb-[40px]">
              <div className="bg-[#064E3B] text-revalor w-[64px] h-[64px] rounded-[16px] flex items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>
              </div>
              <h4 className="text-white text-[28px] font-[800]">Para quem <span className="font-extrabold text-white">GERA</span> resíduo</h4>
            </div>
            
            <div className="flex flex-col gap-[32px]">
              {[
                { title: "Redução de Custos com Descarte", text: "Diminua drasticamente as taxas cobradas por aterros sanitários e transporte de lixo." },
                { title: "Novas Linhas de Receita", text: "O que era custo de descarte torna-se um subproduto monetizável para a indústria." }
              ].map((item, i) => (
                <div key={i} className="flex gap-[20px]">
                  <div className="mt-1 w-[32px] h-[32px] rounded-full bg-[#1E293B] flex items-center justify-center text-revalor flex-shrink-0 border border-[#334155]">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12l5 5L20 7"/></svg>
                  </div>
                  <div>
                    <h5 className="text-white text-[18px] font-[700] mb-[8px]">{item.title}</h5>
                    <p className="text-[#9CA3AF] text-[16px] leading-relaxed">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card: Quem COMPRA */}
          <div className="flex-1 bg-[#111C38] rounded-[32px] p-[48px] border border-[#1E293B]">
            <div className="flex items-center gap-[20px] mb-[40px]">
              <div className="bg-[#1E3A8A] text-[#60A5FA] w-[64px] h-[64px] rounded-[16px] flex items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m7 7 10 10"/><path d="M17 7v10H7"/></svg>
              </div>
              <h4 className="text-white text-[28px] font-[800] ">Para quem <span className="font-extrabold text-white">COMPRA</span></h4>
            </div>
            
            <div className="flex flex-col gap-[32px]">
              {[
                { title: "Insumos mais Acessíveis", text: "Reduza os custos de produção utilizando materiais reciclados de alta qualidade ao invés de matéria virgem." },
                { title: "Garantia de Procedência", text: "Tenha certeza da origem e da composição dos materiais através do nosso rigoroso processo de homologação." }
              ].map((item, i) => (
                <div key={i} className="flex gap-[20px]">
                  <div className="mt-1 w-[32px] h-[32px] rounded-full bg-[#1E293B] flex items-center justify-center text-[#60A5FA] flex-shrink-0 border border-[#334155]">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12l5 5L20 7"/></svg>
                  </div>
                  <div>
                    <h5 className="text-white text-[18px] font-[700] mb-[8px]">{item.title}</h5>
                    <p className="text-[#9CA3AF] text-[16px] leading-relaxed">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      <footer className="bg-[#040914] pt-[80px] pb-[40px] px-8 lg:px-[120px] border-t border-[#1E293B]">
        <div className="flex flex-col lg:flex-row justify-between gap-[40px] mb-[60px]">
          
          <div className="max-w-[320px]">
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-revalor p-1.5 rounded-xl text-white flex items-center justify-center">
                <Recycle size={24} strokeWidth={2.5} />
              </div>
              <span className="text-[24px] font-bold text-white tracking-tight">Revalor</span>
            </div>
            <p className="text-[#9CA3AF] text-[15px] leading-relaxed mb-6">
              Transformando o ecossistema industrial através da economia circular e logística reversa inteligente.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-[#9CA3AF] hover:text-revalor transition-colors"><Camera size={20} /></a>
              <a href="#" className="text-[#9CA3AF] hover:text-revalor transition-colors"><Globe size={20} /></a> 
              <a href="#" className="text-[#9CA3AF] hover:text-revalor transition-colors"><Mail size={20} /></a>
            </div>
          </div>

          <div className="flex gap-[60px] flex-wrap">
            <div>
              <h4 className="text-white font-bold mb-6">Plataforma</h4>
              <ul className="flex flex-col gap-4">
                <li><a href="#como-funciona" className="text-[#9CA3AF] hover:text-revalor transition-colors text-[15px]">Como funciona</a></li>
                <li><a href="#beneficios" className="text-[#9CA3AF] hover:text-revalor transition-colors text-[15px]">Benefícios</a></li>
                <li><a href="/login" className="text-[#9CA3AF] hover:text-revalor transition-colors text-[15px]">Acessar Conta</a></li>
                <li><a href="/cadastro" className="text-[#9CA3AF] hover:text-revalor transition-colors text-[15px]">Cadastre sua empresa</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-6">Institucional</h4>
              <ul className="flex flex-col gap-4">
                <li><a href="#" className="text-[#9CA3AF] hover:text-revalor transition-colors text-[15px]">Sobre nós</a></li>
                <li><a href="#" className="text-[#9CA3AF] hover:text-revalor transition-colors text-[15px]">Termos de Uso</a></li>
                <li><a href="#" className="text-[#9CA3AF] hover:text-revalor transition-colors text-[15px]">Política de Privacidade</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-[32px] border-t border-[#1E293B] flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <p className="text-[#6B7280] text-[14px]">
            © {new Date().getFullYear()} Revalor. Todos os direitos reservados.
          </p>
          <p className="text-[#6B7280] text-[14px]">
            CNPJ: 00.000.000/0001-00
          </p>
        </div>
      </footer>

    </div>
  );
}