import Link from "next/link";
import { ReactNode } from "react";

export interface MenuItem {
  titulo: string;
  descricao: string;
  link: string;
  icone: ReactNode;
  corBase?: string;
  corIcone?: string;
}

interface MenuDashboardProps {
  letraInicial: string;
  tituloModulo: string;
  subtitulo: string;
  itens: MenuItem[];
  layout?: 'grid' | 'lista'; 
  headerBg?: string; 
}

export function Menu({
  letraInicial,
  tituloModulo,
  subtitulo,
  itens,
  layout = 'grid',
  headerBg = 'bg-gradient-to-r from-emerald-600 to-teal-500' 
}: MenuDashboardProps) {

  const isGrid = layout === 'grid';

  const containerClass = isGrid 
    ? "grid grid-cols-1 sm:grid-cols-2 gap-6" 
    : "flex flex-col gap-4 w-full max-w-[700px] mx-auto"; 
    
  const cardClass = isGrid 
    ? "flex flex-col h-full p-8" 
    : "flex items-center p-6 sm:p-7"; 
    
  const iconeClass = isGrid ? "mb-6" : "mr-6";

  return (

    <div className="fixed inset-0 top-[64px] bg-[#f4f7f6] flex items-center justify-center p-4 sm:p-8 overflow-hidden font-sans">

      <div className="w-full max-w-4xl relative z-10">
        
        <div className="bg-white rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.08)] overflow-hidden">
          
          <div className={`${headerBg} px-8 py-12 text-center text-white flex flex-col items-center justify-center relative overflow-hidden`}>
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center font-black text-2xl mb-4 shadow-sm border border-white/10 relative z-10">
              {letraInicial}
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight uppercase relative z-10">
              {tituloModulo}
            </h1>
            <p className="text-white/90 font-bold mt-3 tracking-widest uppercase text-xs sm:text-[13px] relative z-10">
              {subtitulo}
            </p>
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl translate-x-10 -translate-y-10 pointer-events-none"></div>
          </div>

          <div className="p-8 sm:p-10">
            <div className={containerClass}>
              {itens.map((item, index) => {
                const base = item.corBase || "bg-[#f2fcf9] border-[#d1f4e6] text-teal-700";
                const iconBg = item.corIcone || "text-teal-600 border-teal-200/50";

                return (
                  <Link 
                    key={index} 
                    href={item.link}
                    className={`group rounded-[1.5rem] border-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg no-underline ${cardClass} ${base}`}
                  >
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white flex shrink-0 items-center justify-center shadow-sm border transition-transform duration-300 group-hover:scale-110 ${iconeClass} ${iconBg}`}>
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 currentColor" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        {item.icone}
                      </svg>
                    </div>
                    
                    <div>
                      <h2 className="text-[13px] sm:text-[15px] font-black uppercase tracking-widest mb-1">
                        {item.titulo}
                      </h2>
                      <p className="text-xs sm:text-[13px] font-medium opacity-80 leading-relaxed">
                        {item.descricao}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}