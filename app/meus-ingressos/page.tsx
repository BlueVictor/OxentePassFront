'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { chamadaAPI } from "@/backend/chamadaPadrao";
import { Ticket, CalendarDays } from "lucide-react";
import { LayoutGeral } from "@/app/_components/LayoutGeral";
import { HeaderInterno } from "@/app/_components/HeaderInterno";
import Link from 'next/link';
import { useAuth } from '@/app/_components/Auth/AuthProvider'; 

export default function MeusIngressosPage() {
  const router = useRouter();
  const { usuario, loading } = useAuth(); 

  const [compras, setCompras] = useState<any[]>([]);
  const [carregandoIngressos, setCarregandoIngressos] = useState(true);

  const carregarIngressos = async () => {
    if (!usuario?.id) return; 

    try {
      const data = await chamadaAPI(`/venda/buscar/usuario/${usuario.id}`, "GET");
      const vendas = data?.content || data || [];
      const vendasOrdenadas = [...vendas].sort((a: any, b: any) => a.id - b.id);
      
      setCompras(vendasOrdenadas);
    } catch (error) {
      console.error("Erro ao carregar ingressos", error);
    } finally {
      setCarregandoIngressos(false);
    }
  };

  useEffect(() => {
    if (loading) return; 
    
    if (!usuario) {
      router.push('/login');
      return;
    }
    carregarIngressos();
  }, [router, usuario, loading]);

  if (loading || (!usuario && carregandoIngressos)) return null; 

  return (
    <LayoutGeral voltarLink="/" scroll>
      <HeaderInterno 
        titulo="Meus Ingressos" 
        subtitulo={`Olá, ${usuario?.nome || 'visitante'}! Aqui está o seu histórico de pedidos.`} 
        iconeString="🎟️" 
      />

      <div className="p-6 sm:p-10 max-w-6xl mx-auto">
        {carregandoIngressos ? (
          <div className="py-20 text-center font-bold text-slate-400 animate-pulse uppercase tracking-widest text-xs">
            Buscando seus ingressos...
          </div>
        ) : compras.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center gap-4">
            <div className="w-24 h-24 bg-white shadow-sm border border-slate-100 rounded-full flex items-center justify-center text-4xl">🎫</div>
            <p className="font-bold text-slate-400 uppercase tracking-widest text-xs mt-2">
              Você ainda não comprou nenhum ingresso.
            </p>
            <Link href="/" className="mt-4 px-8 py-4 bg-emerald-600 shadow-lg shadow-emerald-200 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-emerald-700 transition-all active:scale-[0.98]">
              Explorar Eventos
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {compras.map((venda: any) => {

              const quantidadeTotal = venda.ingressos?.reduce((acc: number, ing: any) => {
                const qtdItem = Number(ing.quantidade || ing.qtd) || 1;
                return acc + qtdItem;
              }, 0) || 1;

              return (
              <div 
                key={venda.id} 
                className={`rounded-[2rem] border shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all flex flex-col relative overflow-hidden group 
                  ${venda.status === 'PAGA' 
                    ? 'bg-emerald-50 border-emerald-100' 
                    : 'bg-blue-50 border-blue-200'
                  }`}
              >
                <div className={`p-5 flex justify-between items-center border-b ${venda.status === 'PAGA' ? 'border-emerald-100' : 'border-blue-200'}`}>
                   <span className={`text-[10px] font-black uppercase tracking-widest ${venda.status === 'PAGA' ? 'text-emerald-700' : 'text-blue-700'}`}>
                     Pedido #{venda.id}
                   </span>
                   
                   <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm ${
                     venda.status === 'PAGA' 
                     ? 'bg-emerald-500 text-white' 
                     : 'bg-blue-500 text-white' 
                   }`}>
                     {venda.status === 'PAGA' ? 'PAGO' : 'PENDENTE'}
                   </span>
                </div>

                <div className="p-6 flex-1 space-y-5">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-sm shrink-0 transition-colors 
                      ${venda.status === 'PAGA' 
                        ? 'bg-white text-emerald-500 border-emerald-100 group-hover:bg-emerald-100' 
                        : 'bg-white text-blue-500 border-blue-100 group-hover:bg-blue-100'
                      }`}
                    >
                      <Ticket size={20} strokeWidth={2.5} />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-800 text-base leading-tight mb-1">
                        {venda.ingressos?.[0]?.ingresso?.evento?.nome || "Evento OxentePass"}
                      </h4>
                      <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5 uppercase tracking-widest">
                        <CalendarDays size={12} />
                        {new Date(venda.dataHoraVenda).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>

                  <div className={`flex justify-between items-end p-4 rounded-2xl border ${venda.status === 'PAGA' ? 'bg-white border-emerald-100' : 'bg-white border-blue-100'}`}>

                    <div>
                      <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                        Qtd. Ingressos
                      </span>
                      <span className="font-black text-slate-700 text-sm mb-2 block">
                        {quantidadeTotal} un.
                      </span>

                    </div>

                    <div className="text-right">
                      <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                        Valor Total
                      </span>
                      <p className="text-xl font-black text-slate-900 tracking-tighter">
                        <span className="text-sm text-slate-400 mr-1">R$</span>
                        {venda.valorTotal?.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="relative flex items-center justify-between px-2 h-4">
                  <div className={`w-5 h-5 bg-[#f4f7f6] rounded-full absolute -left-2.5 border-r ${venda.status === 'PAGA' ? 'border-emerald-100' : 'border-blue-200'}`}></div>
                  <div className={`w-full border-t-[2.5px] border-dashed mx-4 ${venda.status === 'PAGA' ? 'border-emerald-100' : 'border-blue-200'}`}></div>
                  <div className={`w-5 h-5 bg-[#f4f7f6] rounded-full absolute -right-2.5 border-l ${venda.status === 'PAGA' ? 'border-emerald-100' : 'border-blue-200'}`}></div>
                </div>

                <div className="p-6 pt-5">
                  {venda.status === 'PAGA' ? (
                    <button 
                      disabled
                      className="w-full py-4 bg-emerald-500 text-white rounded-[1rem] font-black text-[11px] uppercase tracking-widest cursor-default shadow-sm opacity-90"
                    >
                      Ingresso pago
                    </button>
                  ) : (
                    <button 
                      onClick={() => router.push(`/vendas/pagar/${venda.id}`)}
                      className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-[1rem] font-black text-[11px] uppercase tracking-widest shadow-lg shadow-blue-200 transition-all active:scale-[0.98]"
                    >
                      Pagar Agora
                    </button>
                  )}
                </div>

              </div>
            )}
            )}
          </div>
        )}
      </div>
    </LayoutGeral>
  );
}