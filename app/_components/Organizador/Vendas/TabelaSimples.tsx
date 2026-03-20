interface TabelaSimplesProps {
    vendas: any[];
    mensagemVazio: string;
  }
  
  export function TabelaSimples({ vendas, mensagemVazio }: TabelaSimplesProps) {
    const getStatusBadge = (statusNome: string) => {
      switch (statusNome?.toUpperCase()) {
        case 'ABERTA': return 'bg-amber-50 text-amber-600 border-amber-200';
        case 'PAGA': return 'bg-blue-50 text-blue-600 border-blue-200';
        case 'FINALIZADA': return 'bg-teal-50 text-teal-700 border-teal-200';
        case 'CANCELADA': return 'bg-red-50 text-red-700 border-red-200';
        default: return 'bg-slate-50 text-slate-600 border-slate-200';
      }
    };
  
    return (
      <div className="overflow-x-auto animate-in fade-in duration-500">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] uppercase tracking-widest font-black text-slate-400">
              <th className="px-10 py-5">Cód. Venda</th>
              <th className="px-10 py-5 text-right">Status Atual</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {vendas.length === 0 ? (
              <tr><td colSpan={2} className="px-10 py-20 text-center text-slate-400 font-bold uppercase text-xs">{mensagemVazio}</td></tr>
            ) : (
              vendas.map((v) => (
                <tr key={v.id} className="hover:bg-[#f2fcf9] transition-all group">
                  <td className="px-10 py-5 font-black text-teal-600"><span className="text-slate-300 mr-1">#</span>{v.id}</td>
                  <td className="px-10 py-5 text-right">
                    <span className={`px-3 py-1.5 rounded-full border text-[10px] font-black uppercase ${getStatusBadge(v.status)}`}>
                      {v.status || 'CONCLUÍDA'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    );
  }