'use client'
import { useState } from 'react';
import Link from 'next/link';
import { chamadaAPI } from "../../../backend/chamadaPadrao";
import "../../globals.css";

export default function BuscarVendaPorId() {
  const [idBusca, setIdBusca] = useState('');
  const [venda, setVenda] = useState<any | null>(null);
  const [carregando, setCarregando] = useState(false);

  const handleBuscar = async (e: React.FormEvent) => {
    e.preventDefault();
    setVenda(null);
    setCarregando(true);
    
    try {
      const response = await chamadaAPI(`/venda/buscar/${idBusca}`, "GET");
      if (response && response.id) {
        setVenda(response);
      } else {
        alert("Venda não encontrada!");
      }
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 p-6 lg:p-12 font-sans text-slate-800 relative overflow-hidden flex flex-col items-center">
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-400/10 rounded-full blur-[100px] pointer-events-none z-0"></div>
      
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
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex shrink-0 items-center justify-center font-black text-xl shadow-sm border border-white/10">
                    O
                  </div>
                  <div className="flex flex-col justify-center">
                    <h1 className="text-2xl font-black tracking-tight uppercase leading-none mb-2">Consultar Venda</h1>
                    <p className="text-teal-50/90 text-sm font-medium leading-none">Buscar venda por id</p>
                  </div>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl translate-x-10 -translate-y-10 pointer-events-none"></div>
          </div>
          
          <div className="p-0">
            <div className="p-10 border-b border-slate-50">
              <form onSubmit={handleBuscar} className="flex flex-col md:flex-row gap-6 items-end">
                <div className="flex-1 w-full">
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-1">ID da Transação</label>
                  <input type="number" value={idBusca} onChange={(e) => setIdBusca(e.target.value)} placeholder="Ex: 1" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all outline-none" required />
                </div>
                <button type="submit" disabled={carregando} className="w-full md:w-auto bg-teal-600 text-white font-black py-4 px-12 rounded-2xl hover:bg-teal-700 shadow-xl shadow-teal-100 active:scale-[0.98] transition-all uppercase text-xs tracking-widest">
                   {carregando ? "..." : "Buscar"}
                </button>
              </form>
            </div>

            {venda && (
              <div className="p-10 animate-in zoom-in-95 duration-500">
                <div className="max-w-xl mx-auto bg-[#f2fcf9] border border-[#d1f4e6] rounded-[2rem] p-8 shadow-sm relative overflow-hidden">
                  <div className="flex items-center justify-between mb-8">
                      <h3 className="text-sm font-black text-teal-800 uppercase tracking-widest flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full animate-pulse ${venda.status?.toUpperCase() === 'CANCELADA' ? 'bg-red-500' : 'bg-teal-500'}`}></span>
                        Venda #{venda.id}
                      </h3>
                      <span className="px-3 py-1 bg-white text-teal-600 border border-teal-100 rounded-full text-[10px] font-black shadow-sm">
                          IDENTIFICADA
                      </span>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status da Venda</span>
                      {/* LÓGICA DE COR PARA STATUS CANCELADO */}
                      <span className={`font-bold uppercase text-xs ${venda.status?.toUpperCase() === 'CANCELADA' ? 'text-red-600' : 'text-slate-700'}`}>
                        {venda.status}
                      </span>
                    </div>
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Código do Cliente</span>
                      <span className="font-bold text-slate-700">{venda.usuario?.id || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}