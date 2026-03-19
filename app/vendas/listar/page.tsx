'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { chamadaAPI } from "../../../backend/chamadaPadrao";
import "../../globals.css";

export default function ListarVendas() {
  const [vendas, setVendas] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);

  const [toast, setToast] = useState({ visivel: false, mensagem: '', tipo: 'sucesso' });
  const [modal, setModal] = useState<{ visivel: boolean; acao: 'finalizar' | 'cancelar' | 'adicionar' | 'remover' | null; idVenda: number | null }>({ visivel: false, acao: null, idVenda: null });
  
  const [inputIngresso, setInputIngresso] = useState('');
  const [inputQtd, setInputQtd] = useState('1');
  const [processandoAcao, setProcessandoAcao] = useState(false);

  useEffect(() => {
    carregarVendas();
  }, []);

  const carregarVendas = async () => {
    setCarregando(true);
    try {
      const response = await chamadaAPI("/venda/listar?page=0&size=50", "GET");
      if (response && response.content) {
        setVendas(response.content);
      } else if (Array.isArray(response)) {
        setVendas(response);
      }
    } catch (error) {
      mostrarToast("Erro de conexão ao carregar as vendas.", "erro");
    } finally {
      setCarregando(false);
    }
  };

  const mostrarToast = (mensagem: string, tipo: 'sucesso' | 'erro') => {
    setToast({ visivel: true, mensagem, tipo });
    setTimeout(() => setToast((prev) => ({ ...prev, visivel: false })), 4000);
  };

  const abrirModal = (acao: 'finalizar' | 'cancelar' | 'adicionar' | 'remover', idVenda: number) => {
    setInputIngresso('');
    setInputQtd('1');
    setModal({ visivel: true, acao, idVenda });
  };

  const fecharModal = () => {
    setModal({ visivel: false, acao: null, idVenda: null });
  };

  const confirmarAcao = async () => {
    if (!modal.idVenda || !modal.acao) return;

    const vendaAtual = vendas.find(v => v.id === modal.idVenda);
    if (vendaAtual) {
      const status = vendaAtual.status?.toUpperCase();
      if (status === 'CANCELADA') {
        mostrarToast("⚠️ Esta venda está cancelada e não pode ser modificada.", "erro");
        return;
      }
      if (modal.acao === 'finalizar' && status !== 'PAGA') {
        mostrarToast("⚠️ A venda só pode ser finalizada se estiver PAGA.", "erro");
        return;
      }
    }

    setProcessandoAcao(true);

    try {
      let response;
      const idIngressoNum = parseInt(inputIngresso.trim(), 10);
      const quantidadeNum = parseInt(inputQtd.trim(), 10);

      if (modal.acao === 'finalizar') {
        response = await chamadaAPI(`/venda/finalizar/${modal.idVenda}`, "POST", {});
      } else if (modal.acao === 'cancelar') {
        response = await chamadaAPI(`/venda/cancelar/${modal.idVenda}`, "POST", {});
      } else if (modal.acao === 'adicionar') {
        if (isNaN(idIngressoNum) || isNaN(quantidadeNum) || quantidadeNum <= 0) {
          mostrarToast("ID e Quantidade inválidos.", "erro");
          setProcessandoAcao(false);
          return;
        }
        response = await chamadaAPI(`/venda/adicionaringresso/${modal.idVenda}`, "PUT", {
          ingresso: { id: idIngressoNum },
          quantidade: quantidadeNum
        });
      } else if (modal.acao === 'remover') {
        if (isNaN(idIngressoNum) || isNaN(quantidadeNum) || quantidadeNum <= 0) {
          mostrarToast("ID e Quantidade inválidos.", "erro");
          setProcessandoAcao(false);
          return;
        }
        response = await chamadaAPI(`/venda/removeringresso/${modal.idVenda}/${idIngressoNum}`, "PUT", {
            quantidade: quantidadeNum
        });
      }

      if (response && (response.erro || response.status >= 400)) {
        mostrarToast(response.mensagem || "Operação negada pelo servidor.", "erro");
      } else {
        mostrarToast("Operação realizada com sucesso!", "sucesso");
        fecharModal();
        await carregarVendas();
      }
    } catch (error: any) {
      mostrarToast(error?.mensagem || "Erro ao processar requisição.", "erro");
    } finally {
      setProcessandoAcao(false);
    }
  };

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
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 p-6 lg:p-12 font-sans text-slate-800 relative overflow-hidden">
      
      <div className="absolute top-[-5%] left-[-5%] w-[35%] h-[35%] bg-teal-400/10 rounded-full blur-[100px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] bg-emerald-400/10 rounded-full blur-[100px] pointer-events-none z-0"></div>

      {toast.visivel && (
        <div className={`fixed bottom-6 right-6 z-[100] px-6 py-4 rounded-2xl shadow-2xl font-bold flex items-center gap-3 animate-in slide-in-from-bottom-6 fade-in duration-300 border ${
          toast.tipo === 'sucesso' ? 'bg-teal-600 text-white border-teal-500' : 'bg-red-500 text-white border-red-400'
        }`}>
          {toast.mensagem}
        </div>
      )}

      {modal.visivel && (
        <div className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className={`px-6 py-5 border-b ${modal.acao === 'cancelar' || modal.acao === 'remover' ? 'bg-red-50 border-red-100 text-red-700' : 'bg-teal-50 border-teal-100 text-teal-700'}`}>
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
              <button onClick={confirmarAcao} disabled={processandoAcao} className={`px-6 py-2.5 rounded-xl font-black text-white transition-all text-xs uppercase flex items-center gap-2 shadow-md ${modal.acao === 'cancelar' || modal.acao === 'remover' ? 'bg-red-500 hover:bg-red-600 shadow-red-200' : 'bg-teal-500 hover:bg-teal-600 shadow-teal-200'}`}>
                {processandoAcao ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-5xl w-full mx-auto relative z-10">
        <Link href="/vendas" className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 font-bold mb-8 transition-all group no-underline">
          <div className="p-2 bg-white rounded-lg shadow-sm group-hover:shadow-md transition-all">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
          </div>
          Voltar para o Menu
        </Link>
        
        <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-500 px-10 py-10 text-white relative overflow-hidden">
              <div className="flex items-center gap-4 relative z-10">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex shrink-0 items-center justify-center font-black text-xl shadow-sm border border-white/10">O</div>
                  <div className="flex flex-col justify-center">
                    <h1 className="text-2xl font-black tracking-tight uppercase leading-none mb-2">Histórico de Vendas</h1>
                    <p className="text-teal-50/90 text-sm font-medium leading-none">OxentePass • Painel de Controle</p>
                  </div>
              </div>
          </div>
          
          <div className="p-0">
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
            <div className="mt-8 mb-6 flex justify-between items-center text-[10px] font-black text-slate-300 uppercase tracking-widest px-10">
              <p>{vendas.length} Vendas totais</p>
              <p>Filtro: Últimos 50 registros</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}