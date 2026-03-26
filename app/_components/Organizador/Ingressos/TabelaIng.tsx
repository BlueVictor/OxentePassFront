'use client'
import { PenLine, Trash2, Plus, X } from "lucide-react";

interface TabelaIngressosProps {
  ingressos: any[];
  mensagemVazio?: string;
  onEditar: (id: number) => void;
  onDeletar: (id: number) => void;
}

export function TabelaIng({ 
  ingressos, 
  mensagemVazio = "Nenhum ingresso encontrado no sistema.",
  onEditar,
  onDeletar
}: TabelaIngressosProps) {
  
  if (ingressos.length === 0) {
    return (
      <div className="p-20 text-center border-t border-slate-100">
        <p className="text-slate-400 font-medium uppercase tracking-widest text-xs">{mensagemVazio}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto animate-in fade-in duration-300">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50/50 border-b border-slate-100">
            <th className="px-10 py-5 text-[10px] uppercase tracking-widest font-black text-slate-400 whitespace-nowrap">ID Lote</th>
            <th className="px-10 py-5 text-[10px] uppercase tracking-widest font-black text-slate-400">Tipo / Categoria</th>
            <th className="px-10 py-5 text-[10px] uppercase tracking-widest font-black text-slate-400">Valor Base</th>
            <th className="px-10 py-5 text-[10px] uppercase tracking-widest font-black text-slate-400">Estoque</th>
            <th className="px-10 py-5 text-[10px] uppercase tracking-widest font-black text-slate-400">Meia Entrada</th>
            <th className="px-10 py-5 text-[10px] uppercase tracking-widest font-black text-slate-400 text-right">Ações Rápidas</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {ingressos.map((ing) => (
            <tr key={ing.id} className="hover:bg-[#f2fcf9] transition-colors group">
              <td className="px-10 py-5">
                <span className="px-3 py-1.5 bg-slate-100 group-hover:bg-white text-slate-500 text-xs font-bold rounded-md border border-slate-200 transition-colors">
                  #{ing.id}
                </span>
              </td>
              <td className="px-10 py-5 font-bold text-slate-800">{ing.tipo || ing.tipoIngresso}</td>
              <td className="px-10 py-5 font-black text-teal-600 text-lg">
                R$ {ing.valorBase ? ing.valorBase.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : "0,00"}
              </td>
              <td className="px-10 py-5 shrink-0">
                <span className={`font-bold ${ing.quantidadeDisponivel < 10 ? 'text-red-500' : 'text-slate-600'}`}>
                  {ing.quantidadeDisponivel || 0} un.
                </span>
              </td>
              <td className="px-10 py-5">
                {ing.temMeiaEntrada ? (
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-md uppercase tracking-wider">
                    Disponível
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-slate-100 text-slate-400 text-[10px] font-bold rounded-md uppercase tracking-wider">
                    Não Aceita
                  </span>
                )}
              </td>
              <td className="px-10 py-5">
                <div className="flex justify-end items-center gap-2.5">
                  <button 
                    onClick={() => onEditar(ing.id)}
                    title="Editar Ingresso"
                    className="p-3 bg-blue-50 text-blue-500 rounded-full border border-blue-100 shadow-[0_2px_10px_rgba(59,130,246,0.15)] hover:bg-blue-100 hover:text-blue-600 hover:shadow-lg transition-all active:scale-95"
                  >
                    <PenLine className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => onDeletar(ing.id)}
                    title="Excluir Ingresso"
                    className="p-3 bg-orange-50 text-orange-600 rounded-full border border-orange-100 shadow-[0_2px_10px_rgba(234,88,12,0.15)] hover:bg-orange-100 hover:text-orange-700 hover:shadow-lg transition-all active:scale-95"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}