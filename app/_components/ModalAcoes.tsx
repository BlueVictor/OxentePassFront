interface ModalAcoesProps {
  modal: { visivel: boolean; acao: 'finalizar' | 'cancelar' | 'adicionar' | 'remover' | null; idVenda: number | null };
  fecharModal: () => void;
  confirmarAcao: () => void;
  processandoAcao: boolean;
  inputIngresso: string;
  setInputIngresso: (val: string) => void;
  inputQtd: string;
  setInputQtd: (val: string) => void;
}

export function ModalAcoes({ modal, fecharModal, confirmarAcao, processandoAcao, inputIngresso, setInputIngresso, inputQtd, setInputQtd }: ModalAcoesProps) {
  if (!modal.visivel) return null;

  const isDanger = modal.acao === 'cancelar' || modal.acao === 'remover';

  return (
    <div className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className={`px-6 py-5 border-b ${isDanger ? 'bg-red-50 border-red-100 text-red-700' : 'bg-teal-50 border-teal-100 text-teal-700'}`}>
          <h3 className="text-lg font-black uppercase tracking-tight">
            {modal.acao === 'finalizar' && "Finalizar Venda"}
            {modal.acao === 'cancelar' && "Cancelar Venda"}
            {modal.acao === 'adicionar' && "Adicionar Ingresso"}
            {modal.acao === 'remover' && "Remover Ingresso"}
          </h3>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-slate-600 font-medium">Modificando transação <strong className="text-slate-900">#{modal.idVenda}</strong>.</p>
          
          {(modal.acao === 'adicionar' || modal.acao === 'remover') && (
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">ID do Ingresso</label>
                <input type="number" value={inputIngresso} onChange={(e) => setInputIngresso(e.target.value)} placeholder="Ex: 1" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all" autoFocus />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">Quantidade a {modal.acao === 'adicionar' ? 'Adicionar' : 'Remover'}</label>
                <input type="number" min="1" value={inputQtd} onChange={(e) => setInputQtd(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all" />
              </div>
            </div>
          )}
        </div>
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-3 justify-end">
          <button onClick={fecharModal} className="px-5 py-2.5 rounded-xl font-bold text-slate-500 hover:bg-slate-200 transition-all text-xs uppercase">Voltar</button>
          <button onClick={confirmarAcao} disabled={processandoAcao} className={`px-6 py-2.5 rounded-xl font-black text-white transition-all text-xs uppercase flex items-center gap-2 shadow-md ${isDanger ? 'bg-red-500 hover:bg-red-600 shadow-red-200' : 'bg-teal-500 hover:bg-teal-600 shadow-teal-200'}`}>
            {processandoAcao ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Confirmar'}
          </button>
        </div>
      </div>
    </div>
  );
}