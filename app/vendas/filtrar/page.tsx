'use client'
import { useState } from 'react';
import Link from 'next/link';
import { chamadaAPI } from "../../../backend/chamadaPadrao";
import "../../globals.css";

export default function FiltrarVendas() {
  const [status, setStatus] = useState(''); 
  const [vendas, setVendas] = useState<any[]>([]);
  const [buscou, setBuscou] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const statusDisponiveis = ['ABERTA', 'PAGA', 'FINALIZADA', 'CANCELADA'];

  const handleStatusClick = async (statusSelecionado: string) => {
    setStatus(statusSelecionado); 
    setBuscou(false);
    setCarregando(true);
    try {
      const response = await chamadaAPI(`/venda/listar?page=0&size=1000`, "GET");
      let todasAsVendas = response?.content || response || [];
      const vendasFiltradas = todasAsVendas.filter((v: any) => 
        v.status && v.status.toUpperCase() === statusSelecionado.toUpperCase()
      );
      setVendas(vendasFiltradas);
      setBuscou(true);
    } catch (error) { console.error(error); } 
    finally { setCarregando(false); }
  };

  const getStatusBadge = (statusNome: string) => {
    switch (statusNome) {
      case 'ABERTA': return 'bg-amber-50 text-amber-600 border-amber-200';
      case 'PAGA': return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'FINALIZADA': return 'bg-teal-50 text-teal-700 border-teal-200';
      case 'CANCELADA': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 p-6 lg:p-12 font-sans text-slate-800 relative overflow-hidden flex flex-col items-center">
      
      <div className="absolute top-[-5%] left-[-5%] w-[35%] h-[35%] bg-teal-400/10 rounded-full blur-[100px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] bg-emerald-400/10 rounded-full blur-[100px] pointer-events-none z-0"></div>

      <div className="max-w-5xl w-full mx-auto relative z-10">
        <Link href="/vendas" className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 font-bold mb-8 transition-all group no-underline">
          <div className="p-2 bg-white rounded-lg shadow-sm group-hover:shadow-md transition-all">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
          </div>
          Voltar para o Menu
        </Link>
        
        <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-500 px-10 py-10 text-white relative overflow-hidden">
             <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex shrink-0 items-center justify-center font-black text-xl shadow-sm border border-white/10">O</div>
                <div className="flex flex-col justify-center">
                  <h1 className="text-2xl font-black tracking-tight uppercase leading-none mb-2">Filtrar Vendas</h1>
                  <p className="text-teal-50/90 text-sm font-medium leading-none">Selecione um status para visualizar</p>
                </div>
             </div>
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl translate-x-10 -translate-y-10"></div>
          </div>

          <div className="p-0">
            <div className="p-10 border-b border-slate-50">
              <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">Escolha o status</label>
              <div className="flex flex-wrap gap-3">
                {statusDisponiveis.map((s) => (
                  <button key={s} type="button" disabled={carregando} onClick={() => handleStatusClick(s)}
                    className={`px-5 py-3 rounded-2xl font-bold text-xs tracking-widest transition-all border-2 uppercase ${status === s ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-slate-100 bg-slate-50 text-slate-500'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {buscou && !carregando && (
              <div className="overflow-x-auto animate-in fade-in duration-500">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                      <th className="px-10 py-5 text-[10px] uppercase tracking-widest font-black text-slate-400">ID Venda</th>
                      <th className="px-10 py-5 text-[10px] uppercase tracking-widest font-black text-slate-400 text-right">Status Atual</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {vendas.length === 0 ? (
                      <tr><td colSpan={2} className="px-10 py-20 text-center text-slate-400 font-bold uppercase text-xs">Nenhum registro.</td></tr>
                    ) : (
                      vendas.map((v) => (
                        <tr key={v.id} className="hover:bg-[#f2fcf9] transition-all group">
                          <td className="px-10 py-5 font-black text-teal-600">#{v.id}</td>
                          <td className="px-10 py-5 text-right">
                            <span className={`px-3 py-1.5 rounded-full border text-[10px] font-black uppercase ${getStatusBadge(v.status)}`}>{v.status}</span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}