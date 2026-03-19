interface FormBuscaPadraoProps {
  label: string;
  placeholder: string;
  valor: string;
  setValor: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  carregando: boolean;
  textoBotao?: string;
}

export function FormBuscaPadrao({ label, placeholder, valor, setValor, onSubmit, carregando, textoBotao = "Buscar" }: FormBuscaPadraoProps) {
  return (
    <div className="p-10 border-b border-slate-50">
      <form onSubmit={onSubmit} className="flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 w-full">
          <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-1">{label}</label>
          <input 
            type="number" 
            value={valor} 
            onChange={(e) => setValor(e.target.value)} 
            placeholder={placeholder} 
            className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all" 
            required 
          />
        </div>
        <button type="submit" disabled={carregando} className="w-full md:w-auto bg-teal-600 text-white font-black py-4 px-12 rounded-2xl shadow-lg hover:bg-teal-700 active:scale-[0.98] transition-all uppercase text-xs tracking-widest">
          {carregando ? "..." : textoBotao}
        </button>
      </form>
    </div>
  );
}