interface TabelaIngressosProps {
    ingressos: any[];
    mensagemVazio?: string;
  }
  
  export function TabelaIng({ ingressos, mensagemVazio = "Nenhum ingresso encontrado no sistema." }: TabelaIngressosProps) {
    if (ingressos.length === 0) {
      return (
        <div className="p-20 text-center border-t border-slate-100">
          <p className="text-slate-400 font-medium uppercase tracking-widest text-xs">{mensagemVazio}</p>
        </div>
      );
    }
  
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-10 py-5 text-[10px] uppercase tracking-widest font-black text-slate-400 whitespace-nowrap">ID Lote</th>
              <th className="px-10 py-5 text-[10px] uppercase tracking-widest font-black text-slate-400">Tipo / Categoria</th>
              <th className="px-10 py-5 text-[10px] uppercase tracking-widest font-black text-slate-400">Valor Base</th>
              <th className="px-10 py-5 text-[10px] uppercase tracking-widest font-black text-slate-400">Estoque</th>
              <th className="px-10 py-5 text-[10px] uppercase tracking-widest font-black text-slate-400">Meia Entrada</th>
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
                <td className="px-10 py-5 font-bold text-slate-800">{ing.tipo}</td>
                <td className="px-10 py-5 font-black text-teal-600 text-lg">
                  R$ {ing.valorBase?.toFixed(2)}
                </td>
                <td className="px-10 py-5">
                  <span className={`font-bold ${ing.quantidadeDisponivel < 10 ? 'text-red-500' : 'text-slate-600'}`}>
                    {ing.quantidadeDisponivel} un.
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }