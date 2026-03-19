'use client'
import Link from "next/link";
import "../globals.css";

export default function MenuGeralVendas() {
  const menuItems = [
    {
      titulo: "Listar Vendas",
      descricao: "Visualizar todo o histórico de transações",
      link: "/vendas/listar",
      corBase: "bg-[#f2fcf9] border-[#d1f4e6] text-teal-700",
      corIcone: "text-teal-600 border-teal-200/50",
      icone: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
    },
    {
      titulo: "Filtrar por Status",
      descricao: "Buscar ativas, finalizadas ou canceladas",
      link: "/vendas/filtrar",
      corBase: "bg-[#f2fcf9] border-[#d1f4e6] text-teal-700",
      corIcone: "text-teal-600 border-teal-200/50",
      icone: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
    },
    {
      titulo: "Buscar por ID",
      descricao: "Localizar uma transação específica via código",
      link: "/vendas/buscar-id",
      corBase: "bg-[#f2fcf9] border-[#d1f4e6] text-teal-700",
      corIcone: "text-teal-600 border-teal-200/50",
      icone: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 21h7a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v11m0 5l4.879-4.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242z" />
    },
    {
      titulo: "Vendas por Usuário",
      descricao: "Histórico completo de compras de um cliente",
      link: "/vendas/buscar-usuario",
      corBase: "bg-[#f2fcf9] border-[#d1f4e6] text-teal-700",
      corIcone: "text-teal-600 border-teal-200/50",
      icone: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    }
  ];

  return (
    <div className="min-h-[calc(100vh-64px)] w-full bg-[#f4f7f6] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      
      <div className="absolute top-0 left-[10%] w-[500px] h-[500px] bg-emerald-200/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[10%] w-[400px] h-[400px] bg-teal-200/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-4xl relative z-10">
        
        <div className="bg-white rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.05)] overflow-hidden">
          
          <div className="bg-gradient-to-r from-emerald-600 to-teal-500 px-8 py-10 text-center text-white flex flex-col items-center justify-center relative overflow-hidden">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center font-black text-xl mb-4 shadow-sm border border-white/10 relative z-10">
              V
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight uppercase relative z-10">Módulo de Vendas</h1>
            <p className="text-emerald-50/90 font-bold mt-2 tracking-widest uppercase text-[10px] sm:text-xs relative z-10">
              OXENTEPASS • PAINEL GERENCIAL DE VENDAS
            </p>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl translate-x-10 -translate-y-10 pointer-events-none"></div>
          </div>

          <div className="p-8 sm:p-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {menuItems.map((item, index) => (
                <Link 
                  key={index} 
                  href={item.link}
                  className={`group flex flex-col h-full p-8 rounded-3xl border-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${item.corBase} no-underline`}
                >
                  <div className={`w-10 h-10 rounded-full bg-white flex shrink-0 items-center justify-center mb-6 shadow-sm border transition-transform duration-300 group-hover:scale-110 ${item.corIcone}`}>
                    <svg className="w-5 h-5 currentColor" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      {item.icone}
                    </svg>
                  </div>
                  
                  <h2 className="text-[13px] font-black uppercase tracking-widest mb-2">
                    {item.titulo}
                  </h2>
                  <p className="text-xs font-medium opacity-80 leading-relaxed">
                    {item.descricao}
                  </p>
                </Link>
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}