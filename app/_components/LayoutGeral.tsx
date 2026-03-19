import Link from 'next/link';
import { ReactNode } from 'react';

interface LayoutGeralProps {
  children: ReactNode;
  voltarLink: string;
}

export function LayoutGeral({ children, voltarLink }: LayoutGeralProps) {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 p-6 lg:p-12 font-sans text-slate-800 relative overflow-hidden flex flex-col items-center">
      <div className="max-w-5xl w-full mx-auto relative z-10">
        <Link href={voltarLink} className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 font-bold mb-8 transition-all group no-underline">
          <div className="p-2 bg-white rounded-lg shadow-sm group-hover:shadow-md transition-all">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
          </div>
          Voltar para o Menu
        </Link>
        
        <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}