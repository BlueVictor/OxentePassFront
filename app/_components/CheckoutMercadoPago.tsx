'use client';

import { useState } from 'react';
import { initMercadoPago, Payment } from '@mercadopago/sdk-react';
import { chamadaAPI } from "@/backend/chamadaPadrao"; 

initMercadoPago('TEST-fc850337-a202-4023-94f4-093b9a9c6ee0', { locale: 'pt-BR' });

interface CheckoutProps {
  idVenda: number;
  valorTotal: number;
  onSucesso: (dadosPagamento?: any) => void;
  onError: (erro: any) => void;
}

export function CheckoutMercadoPago({ idVenda, valorTotal, onSucesso, onError }: CheckoutProps) {
  const [isReady, setIsReady] = useState(false);
  const [dadosPix, setDadosPix] = useState<{ qrCodeBase64: string, qrCodeCopiaECola: string } | null>(null);
  const [copiado, setCopiado] = useState(false);

  const initialization = {
    amount: valorTotal,
  };

  const customization = {
    paymentMethods: {
      creditCard: 'all',
      debitCard: 'all',
      bankTransfer: 'all', 
      ticket: 'all', 
    },
  };

  const onSubmit = async ({ selectedPaymentMethod, formData }: any) => {
    try {
      if (selectedPaymentMethod === 'credit_card' || selectedPaymentMethod === 'debit_card') {
        
        const respostaCartao = await chamadaAPI(
          `/pagamento/cartao/${idVenda}`, 
          "POST", 
          formData.token 
        );
        
        alert(`✅ Pagamento via Cartão (${selectedPaymentMethod === 'credit_card' ? 'Crédito' : 'Débito'}) processado com sucesso!`);
        onSucesso(respostaCartao);

      } else if (formData.payment_method_id === 'pix') {
        
        const respostaPix = await chamadaAPI(
          `/pagamento/pix/${idVenda}`, 
          "POST"
        );

        if (respostaPix && respostaPix.qrCodeBase64) {
          setDadosPix({
            qrCodeBase64: respostaPix.qrCodeBase64,
            qrCodeCopiaECola: respostaPix.qrCode
          });
          
          alert("✅ PIX gerado! Escaneie o QR Code ou copie o código para finalizar.");
        } else {
          alert("❌ Erro: Não foi possível gerar o QR Code do PIX. Tente novamente.");
          onError("Sem QR Code retornado pelo backend.");
        }

      } else if (selectedPaymentMethod === 'ticket') {
        
        const respostaBoleto = await chamadaAPI(
          `/pagamento/boleto/${idVenda}`, 
          "POST",
          formData 
        );
        
        alert("✅ Boleto gerado com sucesso! Verifique seu e-mail ou faça o download para pagar.");
        onSucesso(respostaBoleto);
      }
      
    } catch (error: any) {
      alert("❌ Falha na transação. Verifique os dados fornecidos e tente novamente.");
      onError(error);
    }
  };

  const copiarPix = () => {
    if (dadosPix) {
      navigator.clipboard.writeText(dadosPix.qrCodeCopiaECola);
      setCopiado(true);
      
      alert("✅ Código PIX copiado! Abra o app do seu banco e cole para pagar.");
      
      setTimeout(() => setCopiado(false), 3000);
    }
  };

  if (dadosPix) {
    return (
      <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100 max-w-xl mx-auto text-center animate-in fade-in zoom-in duration-500">
        <h3 className="text-2xl font-black text-slate-800 mb-2 uppercase tracking-widest">
          Pague com PIX
        </h3>
        <p className="text-sm font-medium text-slate-500 mb-8">
          Abra o app do seu banco e escaneie o QR Code abaixo para garantir seus ingressos.
        </p>

        <div className="flex justify-center mb-8">
          <div className="p-4 bg-white border-2 border-slate-100 rounded-3xl shadow-sm inline-block">
            <img 
              src={`data:image/jpeg;base64,${dadosPix.qrCodeBase64}`} 
              alt="QR Code PIX" 
              className="w-48 h-48 object-contain"
            />
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Ou utilize o Pix Copia e Cola</p>
          
          <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
            <input 
              type="text" 
              readOnly 
              value={dadosPix.qrCodeCopiaECola} 
              className="flex-1 bg-transparent text-xs font-medium text-slate-600 outline-none px-2 truncate"
            />
            <button 
              onClick={copiarPix}
              className={`px-4 py-2 rounded-lg text-xs font-bold text-white transition-all ${copiado ? 'bg-emerald-500' : 'bg-slate-800 hover:bg-slate-700'}`}
            >
              {copiado ? 'COPIADO!' : 'COPIAR'}
            </button>
          </div>
        </div>

        <button 
          onClick={() => onSucesso(dadosPix)}
          className="mt-8 w-full py-5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-[0.2em] text-xs shadow-lg transition-all active:scale-[0.98]"
        >
          Já realizei o pagamento
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100 max-w-xl mx-auto">
      <h3 className="text-xl font-black text-slate-800 mb-6 uppercase tracking-widest text-center">
        Finalizar Pagamento
      </h3>
      
      {!isReady && (
        <div className="flex justify-center items-center py-10">
          <div className="w-10 h-10 border-4 border-emerald-100 border-t-emerald-500 rounded-full animate-spin"></div>
        </div>
      )}

      <Payment
        initialization={initialization}
        customization={customization as any}
        onSubmit={onSubmit}
        onReady={() => setIsReady(true)}
        onError={(erro) => {
          alert("❌ Ocorreu um erro no formulário de pagamento. Por favor, recarregue a página.");
          onError(erro);
        }}
      />
    </div>
  );
}