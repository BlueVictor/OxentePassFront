'use client';

import { useState } from 'react';
import { Ticket, Plus, Trash2 } from 'lucide-react';

const estadoInicialInput = {
  tipoIngresso: "",
  valorBase: "",
  quantidadeDisponivel: "",
  temMeiaEntrada: "true"
}

export default function IngressoSelector({ ingressos, setIngressos }: any) {
  const [input, setInput] = useState(estadoInicialInput);

  const adicionar = () => {
    if (input.tipoIngresso == "" || input.valorBase == "" || input.quantidadeDisponivel == "") return;

    const jaExiste = ingressos.some((n: any) => n.tipoIngresso.toLowerCase() === input.tipoIngresso.toLowerCase());

    setIngressos((prev: any[]) => {
      if (jaExiste) return prev;              
      return [...prev, {
        tipoIngresso: input.tipoIngresso,
        valorBase: Number(input.valorBase),
        quantidadeDisponivel: Number(input.quantidadeDisponivel),
        temMeiaEntrada: Boolean(input.temMeiaEntrada)
      }];
    });

    setInput(estadoInicialInput);
  };

  const remover = (valor: string) => {
    setIngressos((prev: any) => prev.filter((item: string) => item !== valor));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInput((prev: any) => ({ ...prev, [name]: value }));
  };

  const inputClass = "w-full border-2 border-slate-100 rounded-xl p-3 focus:ring-0 focus:border-emerald-500 outline-none transition-all bg-white font-semibold text-sm text-slate-700";
  const labelClass = "text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 block mb-2";

  return (
    <div className="flex flex-col lg:flex-row gap-8 w-full">
      
      {/* Formulário de Inserção */}
      <div className="flex flex-col gap-4 w-full lg:w-1/2 bg-slate-50/80 p-6 rounded-[2rem] border border-slate-100">
        <div>
          <label htmlFor="tipoIngresso" className={labelClass}>Nome do Lote/Ingresso</label>
          <input
            type='text'
            name='tipoIngresso'
            id='tipoIngresso'
            value={input.tipoIngresso}
            onChange={handleChange}
            placeholder="Ex: Pista Lote 1"
            className={inputClass} 
          />
        </div>

        <div className='flex flex-row gap-4'>
          <div className="w-1/2">
            <label htmlFor="valorBase" className={labelClass}>Valor (R$)</label>
            <input
              type='number'
              name='valorBase'
              id='valorBase'
              value={input.valorBase}
              onChange={handleChange}
              min={0}
              placeholder="0.00"
              className={inputClass} 
            />
          </div>

          <div className="w-1/2">
            <label htmlFor="quantidadeDisponivel" className={labelClass}>Quantidade</label>
            <input
              type='number'
              name='quantidadeDisponivel'
              id='quantidadeDisponivel'
              value={input.quantidadeDisponivel}
              onChange={handleChange}
              min={1}
              placeholder="Ex: 100"
              className={inputClass} 
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Permite Meia Entrada?</label>
          <div className="flex gap-4">
            <label className="flex-1 flex items-center gap-3 p-3 border-2 border-slate-100 rounded-xl cursor-pointer hover:bg-white transition-all has-[:checked]:border-emerald-500 has-[:checked]:bg-emerald-50/50 bg-white">
              <input type="radio" name="temMeiaEntrada" value="true" checked={input.temMeiaEntrada === "true"} onChange={handleChange} className="accent-emerald-600 w-4 h-4" />
              <span className="text-sm font-bold text-slate-600">Sim</span>
            </label>
            <label className="flex-1 flex items-center gap-3 p-3 border-2 border-slate-100 rounded-xl cursor-pointer hover:bg-white transition-all has-[:checked]:border-emerald-500 has-[:checked]:bg-emerald-50/50 bg-white">
              <input type="radio" name="temMeiaEntrada" value="false" checked={input.temMeiaEntrada === "false"} onChange={handleChange} className="accent-emerald-600 w-4 h-4" />
              <span className="text-sm font-bold text-slate-600">Não</span>
            </label>
          </div>
        </div>

        <button 
          type="button" 
          onClick={adicionar}
          className="mt-2 w-full flex items-center justify-center gap-2 px-4 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[11px] uppercase tracking-widest rounded-xl shadow-lg shadow-emerald-200 transition-all active:scale-[0.98]"
        >
          <Plus size={16} strokeWidth={3} />
          Adicionar Ingresso
        </button>
      </div>

      {/* Lista de Ingressos Adicionados */}
      <div className="w-full lg:w-1/2 flex flex-col gap-3">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Ingressos Cadastrados ({ingressos.length})</h3>
        
        {ingressos.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-300 border-2 border-dashed border-slate-200 rounded-[2rem] p-8 bg-slate-50/50">
            <Ticket size={40} className="mb-2 opacity-50" />
            <p className="text-sm font-medium text-center">Nenhum ingresso adicionado ainda.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3 max-h-[350px] overflow-y-auto custom-scrollbar pr-2">
            {ingressos.map((ing: any, i: any) => (
              <div key={i} className="flex items-center justify-between bg-white border border-slate-200 p-4 rounded-2xl shadow-sm hover:border-emerald-200 transition-colors">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-black text-sm text-slate-700 uppercase tracking-tight">{ing.tipoIngresso}</span>
                    {ing.temMeiaEntrada && (
                      <span className="text-[8px] bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full uppercase">Meia</span>
                    )}
                  </div>
                  <div className="flex gap-3 text-xs font-semibold text-slate-500">
                    <span>R$ {ing.valorBase.toFixed(2)}</span>
                    <span>•</span>
                    <span>Qtd: {ing.quantidadeDisponivel}</span>
                  </div>
                </div>
                
                <button
                  type="button"
                  onClick={() => remover(ing)}
                  className="p-2 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors"
                  title="Remover Ingresso"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}