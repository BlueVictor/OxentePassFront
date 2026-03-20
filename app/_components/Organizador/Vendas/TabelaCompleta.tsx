interface TabelaCompletaProps {
    vendas: any[];
    abrirModal: (acao: 'finalizar' | 'cancelar' | 'adicionar' | 'remover', idVenda: number) => void;
  }
  
  export function TabelaCompleta({ vendas, abrirModal }: TabelaCompletaProps) {
    const renderStatus = (status: string) => {
      const s = status?.toUpperCase() || 'ABERTA';
      const estilos: { [key: string]: string } = {
        'CONCLUIDA': 'bg-emerald-50 text-emerald-700 border-emerald-100',
        'FINALIZADA': 'bg-teal-50 text-teal-700 border-teal-100',
        'CANCELADA': 'bg-red-50 text-red-700 border-red-100',
        'PENDENTE': 'bg-amber-50 text-amber-700 border-amber-100',
        'ABERTA': 'bg-amber-50 text-amber-700 border-amber-100',
        'PAGA': 'bg-blue-50 text-blue-700 border-blue-100',
      };
      return (
        <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-wider border shadow-sm ${estilos[s] || estilos['ABERTA']}`}>
          {s}
        </span>
      );
    };
  
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-10 py-5 text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">ID Venda</th>
              <th className="px-10 py-5 text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">Cliente (ID)</th>
              <th className="px-10 py-5 text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 text-center">Status</th>
              <th className="px-10 py-5 text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 text-center">Ações Rápidas</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {vendas.map((venda) => (
              <tr key={venda.id} className="hover:bg-[#f2fcf9] transition-all duration-200 group">
                <td className="px-10 py-5 font-black text-teal-600">#{venda.id}</td>
                <td className="px-10 py-5 font-bold text-slate-700">{venda.usuario?.id || '---'}</td>
                <td className="px-10 py-5 text-center">{renderStatus(venda.status)}</td>
                <td className="px-10 py-5">
                  <div className="flex justify-center items-center gap-2">
                    <button onClick={() => abrirModal('finalizar', venda.id)} className="w-8 h-8 rounded-lg flex items-center justify-center bg-teal-50 text-teal-600 hover:bg-teal-500 hover:text-white transition-all shadow-sm">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    </button>
                    <button onClick={() => abrirModal('cancelar', venda.id)} className="w-8 h-8 rounded-lg flex items-center justify-center bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                    <div className="w-px h-8 bg-slate-200 mx-1"></div>
                    <button onClick={() => abrirModal('adicionar', venda.id)} className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-50 text-blue-600 hover:bg-blue-500 hover:text-white transition-all shadow-sm">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                    </button>
                    <button onClick={() => abrirModal('remover', venda.id)} className="w-8 h-8 rounded-lg flex items-center justify-center bg-orange-50 text-orange-500 hover:bg-orange-500 hover:text-white transition-all shadow-sm">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
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