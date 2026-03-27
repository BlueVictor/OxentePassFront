import { chamadaAPI } from "@/backend/chamadaPadrao";
import { redirect } from "next/navigation";
import Link from "next/link";

import { CabecalhoCheckout } from "@/app/_components/CabecalhoCheckout";
import { CheckoutClienteFluxo } from "@/app/_components/CheckoutClienteFluxo"; 
import { CheckoutCarrinho } from "@/app/_components/CheckoutCarrinho";

async function getIngresso(id: string) {
  const response = await chamadaAPI(`/ingresso/buscar/${id}`, "GET");
  if (!response) return null;
  return response;
}

export default async function CriarVendaPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ ingressoId?: string, origem?: string }> 
}) {
  const { ingressoId, origem } = await searchParams;
  
  if (!ingressoId && origem !== 'carrinho') {
    return redirect("/");
  }

  let ingresso = null;
  if (ingressoId) {
    ingresso = await getIngresso(ingressoId);
  }

  const idEvento = ingresso?.eventoId || ingresso?.evento?.id;

  return (
    <div className="fixed inset-0 bg-[#f4f7f6] p-4 font-sans flex flex-col items-center justify-center overflow-hidden">
      <div className="w-full max-w-2xl mx-auto flex flex-col">
        <Link 
          href={idEvento ? `/evento/${idEvento}` : "/"} 
          className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 font-bold mb-4 transition-all group no-underline self-start shrink-0"
        >
          <div className="p-2 bg-white rounded-lg shadow-sm group-hover:shadow-md transition-all border border-slate-100">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </div>
          Voltar para o Evento
        </Link>

        <div className="bg-white rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.08)] overflow-hidden shrink-0">
          <CabecalhoCheckout 
            titulo={origem === 'carrinho' ? "Checkout do Carrinho" : "Checkout de Venda"} 
            subtitulo="Finalize sua reserva de ingressos" 
          />

          <div className="p-8 sm:p-10">
            {origem === 'carrinho' ? (
              <CheckoutCarrinho />
            ) : (
              <CheckoutClienteFluxo 
                ingresso={ingresso} 
                ingressoId={ingressoId || ""} 
                origem={origem} 
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}