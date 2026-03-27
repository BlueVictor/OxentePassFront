'use client';

import { Store } from 'lucide-react';

export default function PontoVendaSelector({ pontoVendaExistentes, selecionados, setSelecionados }: any) {
  
  const selecionarPonto = (tag: any) => {
    setSelecionados((prev: any) => {
      if (prev.includes(tag.id)) {
        return prev.filter((id: any) => id !== tag.id);
      } 
      else {
        return [...prev, tag.id];
      }
    });
  }

  return (
    <div className="w-full">
      <div className="flex flex-col gap-4 w-full">
        {pontoVendaExistentes.map((ponto: any) => {
          const ativa = selecionados.includes(ponto.id);

          return (
            <button
              type="button"
              key={ponto.id}
              onClick={() => selecionarPonto(ponto)}
              className={`flex items-start gap-4 p-4 rounded-2xl border-2 text-left transition-all duration-200 w-full ${
                ativa 
                  ? 'border-emerald-500 bg-emerald-50/50 shadow-sm shadow-emerald-100' 
                  : 'border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className={`p-2 rounded-xl mt-1 ${ativa ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                <Store size={20} />
              </div>
              <div className="flex flex-col flex-1 overflow-hidden">
                <span className={`font-black text-sm ${ativa ? 'text-emerald-800' : 'text-slate-700'}`}>
                  {ponto.nome}
                </span>
                <span className={`text-xs truncate ${ativa ? 'text-emerald-600/80' : 'text-slate-500'}`}>
                  {ponto.endereco.bairro}, {ponto.endereco.rua}
                </span>
              </div>
              
              <div className={`w-5 h-5 rounded-full border-2 mt-2 flex items-center justify-center transition-colors ${ativa ? 'border-emerald-500 bg-emerald-500' : 'border-slate-300'}`}>
                {ativa && <span className="w-2 h-2 bg-white rounded-full"></span>}
              </div>
            </button>
          );
        })}
      </div>
      {pontoVendaExistentes.length === 0 && (
        <p className="text-sm text-slate-400 italic">Nenhum ponto de venda cadastrado no sistema.</p>
      )}
    </div>
  );
}