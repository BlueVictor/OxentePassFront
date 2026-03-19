'use client'
import { useState } from 'react';
import Link from 'next/link';
import { chamadaAPI } from "../../../backend/chamadaPadrao";
import "../../globals.css";

export default function BuscarVendaPorUsuario() {
  const [idUsuario, setIdUsuario] = useState('');
  const [vendas, setVendas] = useState<any[]>([]);
  const [buscou, setBuscou] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const handleBuscar = async (e: React.FormEvent) => {
    e.preventDefault();
    setBuscou(false);
    setCarregando(true);

    try {
      const response = await chamadaAPI(`/venda/listar?page=0&size=1000`, "GET");
      
      let todasAsVendas = [];
      if (response && response.content) {
        todasAsVendas = response.content;
      } else if (Array.isArray(response)) {
        todasAsVendas = response;
      }

      const vendasDoUsuario = todasAsVendas.filter((v: any) => 
        v.usuario && v.usuario.id === Number(idUsuario)
      );

      setVendas(vendasDoUsuario);
      setBuscou(true);
    } catch (error) {
      console.error("Erro ao buscar vendas do usuário", error);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 p-6 lg:p-12 font-sans text-slate-800 relative overflow-hidden">
      <div className="absolute top-[-5%] left-[-5%] w-[35%] h-[35%] bg-teal-400/10 rounded-full blur-[100px] pointer-events-none z-0"></div>

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
                  <h1 className="text-2xl font-black tracking-tight uppercase leading-none mb-2">Histórico por Usuário</h1>
                  <p className="text-teal-50/90 text-sm font-medium leading-none">Histórico completo de transações do cliente</p>
                </div>
             </div>
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl translate-x-10 -translate-y-10 pointer-events-none"></div>
          </div>
          
          <div className="p-0">
            <div className="p-10 border-b border-slate-50">
              <form onSubmit={handleBuscar} className="flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1 w-full">
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-1">ID do Usuário</label>
                  <input type="number" value={idUsuario} onChange={(e) => setIdUsuario(e.target.value)} placeholder="Digite o ID (Ex: 1)" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all" required />
                </div>
                <button type="submit" disabled={carregando} className="w-full md:w-auto bg-teal-600 text-white font-black py-4 px-12 rounded-2xl shadow-lg hover:bg-teal-700 active:scale-[0.98] transition-all uppercase text-xs tracking-widest">
                  {carregando ? "..." : "Buscar Histórico"}
                </button>
              </form>
            </div>

            {carregando && (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400 animate-in fade-in duration-300">
                <div className="w-8 h-8 border-3 border-teal-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="font-bold text-xs uppercase tracking-widest">Buscando registros...</p>
              </div>
            )}

            {buscou && !carregando && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] uppercase tracking-widest font-black text-slate-400">
                        <th className="px-10 py-5">Cód. Venda</th>
                        <th className="px-10 py-5 text-right">Status Atual</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {vendas.length === 0 ? (
                        <tr>
                          <td colSpan={2} className="px-10 py-20 text-center text-slate-400 font-bold uppercase text-xs">
                            Nenhuma venda vinculada a este ID.
                          </td>
                        </tr>
                      ) : (
                        vendas.map((v) => (
                          <tr key={v.id} className="hover:bg-[#f2fcf9] transition-all group">
                            <td className="px-10 py-5 font-black text-teal-600">
                              <span className="text-slate-300 mr-1">#</span>{v.id}
                            </td>
                            <td className="px-10 py-5 text-right">
                              <span className={`px-3 py-1 border rounded-full text-[10px] font-black uppercase shadow-sm ${
                                v.status?.toUpperCase() === 'CANCELADA' 
                                  ? 'bg-red-50 text-red-700 border-red-100' 
                                  : 'bg-teal-50 text-teal-700 border-teal-100'
                              }`}>
                                {v.status || 'CONCLUÍDA'}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}