interface BotaoStatusProps {
    label: string;
    ativo: boolean;
    carregando: boolean;
    onClick: (status: string) => void;
  }
  
  export function BotaoStatus({ label, ativo, carregando, onClick }: BotaoStatusProps) {
    return (
      <button
        type="button"
        disabled={carregando}
        onClick={() => onClick(label)}
        className={`px-5 py-3 rounded-2xl font-bold text-xs tracking-widest transition-all border-2 uppercase shadow-sm ${
          ativo 
            ? 'border-teal-500 bg-teal-50 text-teal-700 shadow-teal-100/50' 
            : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200'
        }`}
      >
        {label}
      </button>
    );
  }