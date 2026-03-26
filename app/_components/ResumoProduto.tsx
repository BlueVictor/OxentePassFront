interface ResumoProdutoProps {
    tipo: string;
    quantidadeDisponivel: number;
    valorBase: number;
  }
  
  export function ResumoProduto({ tipo, quantidadeDisponivel, valorBase }: ResumoProdutoProps) {
    return (
      <div className="bg-slate-50 border-2 border-slate-100 rounded-3xl p-6 relative overflow-hidden group transition-all hover:border-emerald-200">
        <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500"></div>
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">
              Produto Selecionado
            </span>
            <h3 className="text-2xl font-black text-slate-800 mt-1">{tipo}</h3>
          </div>
          <div className="bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase text-center">Estoque</p>
            <p className="text-sm font-black text-slate-700">{quantidadeDisponivel} un.</p>
          </div>
        </div>
  
        <div className="mt-6 pt-4 border-t border-slate-200/60 flex justify-between items-center">
          <p className="text-sm font-bold text-slate-500">Valor Unitário</p>
          <p className="text-2xl font-black text-emerald-600">
            R$ {valorBase.toFixed(2)}
          </p>
        </div>
      </div>
    );
  }