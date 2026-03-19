import Link from "next/link";
import { ReactNode } from "react";

interface ItemMenuProps {
  titulo: string;
  descricao: string;
  link: string;
  corBase: string;
  corIcone: string;
  icone: ReactNode;
}

export function ItemMenu({ titulo, descricao, link, corBase, corIcone, icone }: ItemMenuProps) {
  return (
    <Link 
      href={link}
      className={`group flex flex-col h-full p-8 rounded-3xl border-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${corBase} no-underline`}
    >
      <div className={`w-10 h-10 rounded-full bg-white flex shrink-0 items-center justify-center mb-6 shadow-sm border transition-transform duration-300 group-hover:scale-110 ${corIcone}`}>
        <svg className="w-5 h-5 currentColor" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {icone}
        </svg>
      </div>
      
      <h2 className="text-[13px] font-black uppercase tracking-widest mb-2">
        {titulo}
      </h2>
      <p className="text-xs font-medium opacity-80 leading-relaxed">
        {descricao}
      </p>
    </Link>
  );
}