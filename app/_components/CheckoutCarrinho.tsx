'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { chamadaAPI } from "@/backend/chamadaPadrao";
import { InputCheckout } from "@/app/_components/InputCheckout";
import { SelectCheckout } from "@/app/_components/SelectCheckout";
import { BotaoSubmitCheckout } from "@/app/_components/BotaoSubmitCheckout";
import { CheckoutMercadoPago } from "./CheckoutMercadoPago";
import { ShoppingBag } from "lucide-react";

export function CheckoutCarrinho() {
  const router = useRouter();
  const [etapa, setEtapa] = useState<'DADOS' | 'PAGAMENTO'>('DADOS');
  const [venda, setVenda] = useState<any>(null);
  const [carregando, setCarregando] = useState(false);
  const [itens, setItens] = useState<any[]>([]);

  useEffect(() => {
    const salvo = JSON.parse(localStorage.getItem('carrinho_oxente') || '[]');
    setItens(salvo);
  }, []);

  const totalGeral = itens.reduce((acc, i) => acc + (i.valorBase * (i.qtdCarrinho || 1)), 0);

  const handleFinalizarCarrinho = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCarregando(true);
    const formData = new FormData(e.currentTarget);

    const payload = {
      usuario: { id: 1 },
      pagamento: {
        status: "PENDENTE",
        valor: totalGeral,
        metodo: "PIX"
      },
      ingressos: itens.map(item => ({
        quantidade: item.qtdCarrinho || 1,
        meiaEntrada: formData.get("tipoEntrada") === "meia",
        ingresso: { id: Number(item.id) }
      }))
    };

    try {
      const response = await chamadaAPI("/venda/criar", "POST", payload);
      if (response && response.id) {
        localStorage.removeItem('carrinho_oxente');
        window.dispatchEvent(new Event('cart-updated'));
        setVenda(response);
        setEtapa('PAGAMENTO');
      }
    } catch (error) {
      alert("Erro ao processar carrinho");
    } finally {
      setCarregando(false);
    }
  };

  if (etapa === 'PAGAMENTO' && venda) {
    return (
      <div className="animate-in fade-in zoom-in duration-500">
        <CheckoutMercadoPago 
          idVenda={venda.id}
          valorTotal={venda.valorTotal}
          onSucesso={() => {
            alert("✅ Pagamento confirmado!");
            router.push(`/`);
          }}
          onError={() => alert("Erro no pagamento")}
        />
      </div>
    );
  }

  return (
    <form onSubmit={handleFinalizarCarrinho} className="space-y-6">
      <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
        <div className="flex items-center gap-3 mb-4 text-slate-400 font-black text-[10px] uppercase tracking-widest">
          <ShoppingBag size={14} /> {itens.length} Itens no pedido
        </div>
        <div className="space-y-2">
          {itens.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center">
              <span className="text-sm font-bold text-slate-700">{item.qtdCarrinho || 1}x {item.tipo}</span>
              <span className="text-sm font-black text-teal-600">R$ {item.valorBase.toFixed(2)}</span>
            </div>
          ))}
          <div className="pt-4 mt-2 border-t border-slate-200 flex justify-between items-center">
            <span className="text-xs font-black text-slate-400 uppercase">Total</span>
            <span className="text-2xl font-black text-slate-800 tracking-tighter">R$ {totalGeral.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <InputCheckout label="Nome do Comprador" name="nomeComprador" required />
        <InputCheckout label="E-mail de Envio" name="emailComprador" type="email" required />
      </div>

      <SelectCheckout label="Tipo de Entrada" name="tipoEntrada">
        <option value="inteira">🎫 Inteira</option>
        <option value="meia">🎓 Meia-Entrada</option>
      </SelectCheckout>

      <BotaoSubmitCheckout label={carregando ? "Processando..." : "Pagar tudo agora 🔒"} />
    </form>
  );
}