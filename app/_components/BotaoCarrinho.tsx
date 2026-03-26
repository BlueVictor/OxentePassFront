'use client';

import { ShoppingCart } from "lucide-react";
import { useToast } from "@/app/_components/ToastProvider";

interface BotaoCarrinhoProps {
  ingresso: any;
}

export function BotaoCarrinho({ ingresso }: BotaoCarrinhoProps) {
  const { showToast } = useToast();

  const adicionarAoCarrinho = () => {
    try {
      const carrinho = JSON.parse(localStorage.getItem('carrinho_oxente') || '[]');
      
      carrinho.push({ ...ingresso, qtdCarrinho: 1 });
      
      localStorage.setItem('carrinho_oxente', JSON.stringify(carrinho));
      
      window.dispatchEvent(new Event('cart-updated'));
      
      showToast("✅ Adicionado ao carrinho!", "success");
    } catch (error) {
      showToast("❌ Erro ao adicionar item.", "error");
    }
  };

  return (
    <button 
      onClick={adicionarAoCarrinho}
      className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-3 rounded-xl text-[11px] uppercase tracking-widest transition-all active:scale-[0.97]"
    >
      <ShoppingCart size={16} />
      Adicionar ao Carrinho
    </button>
  );
}