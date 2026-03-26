interface BotaoSubmitCheckoutProps {
    label: string;
    avisoRodape?: string;
  }
  
  export function BotaoSubmitCheckout({ label, avisoRodape }: BotaoSubmitCheckoutProps) {
    return (
      <div className="pt-4">
        <button
          type="submit"
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-5 rounded-2xl shadow-[0_10px_30px_rgba(16,185,129,0.3)] transition-all active:scale-[0.98] uppercase tracking-widest text-sm"
        >
          {label}
        </button>
        {avisoRodape && (
          <p className="text-[10px] text-slate-400 text-center mt-4 font-bold uppercase tracking-tight">
            {avisoRodape}
          </p>
        )}
      </div>
    );
  }