import { Edit2, Trash2 } from "lucide-react";

interface GridCardsIngressosProps {
    ingressos: any[];
    mensagemVazio?: string;
    onEditar: (id: number) => void;
    onDeletar: (id: number) => void;
}

export function GridCards({ 
    ingressos, 
    mensagemVazio = "Nenhum ingresso encontrado.",
    onEditar,
    onDeletar 
}: GridCardsIngressosProps) {
    
    if (ingressos.length === 0) {
        return (
            <div className="text-center py-12 bg-slate-50 rounded-3xl border border-slate-100">
                <span className="text-4xl block mb-4 opacity-50">🎟️</span>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">{mensagemVazio}</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ingressos.map((ing) => (
                <div key={ing.id} className="bg-[#f2fcf9] p-6 sm:p-8 rounded-[2.5rem] border border-[#d1f4e6] shadow-sm relative overflow-hidden hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                    
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-3">
                            <span className="px-4 py-1.5 bg-teal-600 text-white text-[10px] font-black rounded-lg uppercase tracking-widest shadow-sm">
                                ID #{ing.id}
                            </span>
                            {ing.temMeiaEntrada && (
                                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-lg uppercase tracking-widest">
                                    ✅ Meia
                                </span>
                            )}
                        </div>

                        <div className="flex gap-2">
                            <button 
                                onClick={() => onEditar(ing.id)}
                                className="p-2 bg-white text-blue-600 rounded-xl shadow-sm border border-slate-100 hover:bg-blue-50 transition-colors"
                            >
                                <Edit2 size={14} />
                            </button>
                            <button 
                                onClick={() => onDeletar(ing.id)}
                                className="p-2 bg-white text-red-600 rounded-xl shadow-sm border border-slate-100 hover:bg-red-50 transition-colors"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-black text-slate-800 mb-2">{ing.tipo}</h3>
                    
                    <div className="flex items-end gap-2 mb-6">
                        <p className="text-3xl sm:text-4xl font-black text-teal-600">
                            R$ {ing.valorBase?.toFixed(2)}
                        </p>
                    </div>

                    <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100">
                        <span className={`w-2 h-2 rounded-full ${ing.quantidadeDisponivel < 10 ? 'bg-red-500 animate-pulse' : 'bg-teal-500'}`}></span>
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                            Estoque: {ing.quantidadeDisponivel} un.
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
}