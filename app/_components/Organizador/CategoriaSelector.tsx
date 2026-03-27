'use client';

import { useState } from 'react';
import { Plus, X, Tag } from 'lucide-react';

export default function CategoriaSelector({ tagsExistentes = [], selecionadas, setSelecionadas, novas, setNovas }: any) {
  const [input, setInput] = useState('');

  const selecionarTag = (tag: any) => {
    setSelecionadas((prev: any) => {
      if (prev.includes(tag.id)) {
        return prev.filter((id: any) => id !== tag.id);
      } else {
        return [...prev, tag.id];
      }
    });
  }

  const adicionarNova = () => {
    const valor = input.trim();
    if (!valor) return;

    const jaExiste =
      tagsExistentes.some((tag: any) => tag.tag.toLowerCase() === valor.toLowerCase()) || 
      novas.some((n: any) => n.toLowerCase() === valor.toLowerCase());                    

    setNovas((prev: string[]) => {
      if (jaExiste) return prev;              
      return [...prev, valor];
    });

    setInput('');
  };

  const removerNova = (valor: string) => {
    setNovas((prev: any) => prev.filter((item: string) => item !== valor));
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 w-full">
      
      {/* Coluna 1: Categorias Existentes */}
      <div className="flex flex-col gap-3 w-full lg:w-1/2">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
          Categorias Rápidas
        </h3>
        
        {tagsExistentes.length === 0 ? (
          <p className="text-sm text-slate-400 italic">Nenhuma categoria pré-cadastrada encontrada.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {tagsExistentes.map((tag: any) => {
              const ativa = selecionadas?.includes(tag.id);

              return (
                <button
                  type="button"
                  key={tag.id}
                  onClick={() => selecionarTag(tag)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 border-2 active:scale-95 ${
                    ativa 
                      ? 'bg-emerald-100 border-emerald-500 text-emerald-800 shadow-sm shadow-emerald-200/50' 
                      : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700'
                  }`}
                >
                  <Tag size={12} className={ativa ? "text-emerald-600" : "text-slate-400"} />
                  {tag.tag}
                </button>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Divisor em Desktop */}
      <div className="hidden lg:block w-[1px] bg-slate-200 self-stretch"></div>

      {/* Coluna 2: Criar Nova Categoria */}
      <div className="flex flex-col gap-3 w-full lg:w-1/2">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
          Criar Categoria Personalizada
        </h3>
        
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); adicionarNova(); } }}
            placeholder="Ex: Show de Rock"
            className="flex-1 border-2 border-slate-200 bg-white rounded-xl p-3 text-sm font-semibold text-slate-700 outline-none focus:border-emerald-500 transition-colors placeholder:font-normal" 
          />
          {/* COR CORRIGIDA NO BOTÃO ABAIXO */}
          <button 
            type="button" 
            onClick={adicionarNova}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[11px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-md shadow-emerald-200 cursor-pointer"
          >
            <Plus size={16} strokeWidth={3} />
            <span className="hidden sm:block">Adicionar</span>
          </button>
        </div>

        {/* Lista das criadas agora */}
        <div className="flex flex-wrap gap-2 mt-2">
          {novas?.map((tag: string, i: number) => (
            <div
              key={`nova-${i}`}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 text-blue-700 rounded-full text-xs font-bold shadow-sm"
            >
              <span>{tag}</span>
              <button
                type="button"
                onClick={() => removerNova(tag)}
                className="hover:bg-blue-200 rounded-full p-0.5 transition-colors cursor-pointer"
                title="Remover"
              >
                <X size={14} />
              </button>
            </div>
          ))}
          {novas?.length === 0 && (
             <p className="text-xs text-slate-400 italic mt-1">Nenhuma categoria personalizada adicionada.</p>
          )}
        </div>
      </div>

    </div>
  );
}