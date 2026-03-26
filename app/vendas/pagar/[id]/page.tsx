'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { chamadaAPI } from "@/backend/chamadaPadrao";
import { LayoutGeral } from "@/app/_components/LayoutGeral";
import { HeaderInterno } from "@/app/_components/HeaderInterno";
import { CheckoutMercadoPago } from "@/app/_components/CheckoutMercadoPago";
import { useToast } from "@/app/_components/ToastProvider";
import { useAuth } from '@/app/_components/Auth/AuthProvider';

export default function PagarVendaPage() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const { usuario, loading } = useAuth();

  const idVenda = params.id as string;
  const [venda, setVenda] = useState<any>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    if (loading) return;
    if (!usuario) {
      router.push('/login');
      return;
    }
    if (!idVenda) return;

    async function carregarVenda() {
      try {
        const data = await chamadaAPI(`/venda/${idVenda}`, "GET");
        setVenda(data);
      } catch (error) {
        console.error("Erro ao buscar venda", error);
        showToast("❌ Erro ao carregar os dados do pedido.", "error");
      } finally {
        setCarregando(false);
      }
    }
    
    carregarVenda();
  }, [idVenda, usuario, loading, router, showToast]);

  if (carregando || loading) {
    return <div className="p-20 text-center font-bold text-slate-400">Carregando pagamento...</div>;
  }

  if (!venda) {
    return <div className="p-20 text-center font-bold text-slate-400">Pedido não encontrado.</div>;
  }

  return (
    <LayoutGeral voltarLink="/meus-ingressos" scroll>
      <HeaderInterno
        titulo="Pagamento"
        subtitulo={`Finalize o pagamento do Pedido #${venda.id}`}
        iconeString="💳"
      />
      
      <div className="p-6 sm:p-10 max-w-xl mx-auto">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50">
          <div className="mb-6 text-center">
             <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">Total a Pagar</h2>
             <p className="text-4xl font-black text-slate-800">R$ {venda.valorTotal?.toFixed(2)}</p>
          </div>

          <CheckoutMercadoPago
            idVenda={venda.id}
            valorTotal={venda.valorTotal}
            onSucesso={() => {
              showToast("✅ Pagamento confirmado com sucesso!", "success");
              router.push('/meus-ingressos');
            }}
            onError={() => {
              showToast("❌ Erro ao processar o pagamento.", "error");
            }}
          />
        </div>
      </div>
    </LayoutGeral>
  );
}