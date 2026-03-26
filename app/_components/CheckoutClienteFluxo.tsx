'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { chamadaAPI } from "@/backend/chamadaPadrao";
import { ResumoProduto } from "@/app/_components/ResumoProduto";
import { InputCheckout } from "@/app/_components/InputCheckout";
import { SelectCheckout } from "@/app/_components/SelectCheckout";
import { BotaoSubmitCheckout } from "@/app/_components/BotaoSubmitCheckout";
import { CheckoutMercadoPago } from "./CheckoutMercadoPago";

interface CheckoutProps {
  ingresso: any;
  ingressoId: string;
  origem?: string;
}

export function CheckoutClienteFluxo({ ingresso, ingressoId, origem }: CheckoutProps) {
  const router = useRouter();
  const [etapa, setEtapa] = useState<'CARRINHO' | 'PAGAMENTO'>('CARRINHO');
  const [venda, setVenda] = useState<any>(null);
  const [carregando, setCarregando] = useState(false);

  const handleCriarVenda = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCarregando(true);
    const formData = new FormData(e.currentTarget);
    const qtd = Number(formData.get("quantidade"));

    const payload = {
      usuario: { id: 1 }, 
      pagamento: {
        status: "PENDENTE",
        valor: ingresso.valorBase * qtd, 
        metodo: "PIX" 
      },
      ingressos: [
        {
          quantidade: qtd,
          meiaEntrada: formData.get("tipoEntrada") === "meia",
          ingresso: { id: Number(ingressoId) } 
        }
      ]
    };

    try {
      const response = await chamadaAPI("/venda/criar", "POST", payload);
      if (response && response.id) {
        setVenda(response);
        setEtapa('PAGAMENTO');
      } else {
        const mensagemErro = response?.mensagem || response?.erro || "Erro na criação da venda";
        alert(`O Backend recusou a venda. Motivo: ${mensagemErro}`);
      }
    } catch (error: any) {
      alert("Falha na comunicação com o servidor.");
    } finally {
      setCarregando(false);
    }
  };

  if (etapa === 'PAGAMENTO' && venda) {
    return (
      <div className="animate-in fade-in zoom-in duration-500">
        <CheckoutMercadoPago 
          idVenda={venda.id}
          valorTotal={venda.valorTotal || (ingresso.valorBase * venda.ingressos[0].quantidade)}
          onSucesso={() => {
             alert("✅ Pagamento confirmado!");
             const idEvento = ingresso.eventoId || ingresso.evento?.id;
             router.push(`/evento/${idEvento}`); 
          }}
          onError={() => alert("Houve um problema com o pagamento.")}
        />
      </div>
    );
  }

  return (
    <form onSubmit={handleCriarVenda} className="space-y-8 animate-in fade-in duration-500">
      <ResumoProduto 
        tipo={ingresso.tipo}
        quantidadeDisponivel={ingresso.quantidadeDisponivel}
        valorBase={ingresso.valorBase}
      />

      <div className="grid grid-cols-1 gap-5">
        <InputCheckout label="Nome do Comprador" name="nomeComprador" type="text" placeholder="Nome completo" required />
        <InputCheckout label="E-mail de Envio" name="emailComprador" type="email" placeholder="exemplo@email.com" required />
      </div>

      <div className="grid grid-cols-2 gap-5">
        <InputCheckout 
          label="Qtd" name="quantidade" type="number" min="1" max={ingresso.quantidadeDisponivel} defaultValue="1" required 
          className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-emerald-500 focus:bg-white transition-all font-black text-slate-700"
        />
        <SelectCheckout label="Categoria" name="tipoEntrada">
          <option value="inteira">🎫 Inteira</option>
          {ingresso.temMeiaEntrada && <option value="meia">🎓 Meia-Entrada</option>}
        </SelectCheckout>
      </div>

      <div className="pt-4">
        {carregando ? (
          <div className="w-full text-center p-4 font-bold text-slate-500 animate-pulse">Gerando pedido seguro...</div>
        ) : (
          <BotaoSubmitCheckout label="Ir para Pagamento 🔒" />
        )}
      </div>
    </form>
  );
}