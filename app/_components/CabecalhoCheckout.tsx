interface CabecalhoCheckoutProps {
    titulo: string;
    subtitulo: string;
  }
  
  export function CabecalhoCheckout({ titulo, subtitulo }: CabecalhoCheckoutProps) {
    return (
      <div className="bg-gradient-to-r from-emerald-600 to-teal-500 px-8 py-10 text-center text-white relative">
        <h1 className="text-3xl font-black tracking-tight uppercase">{titulo}</h1>
        <p className="text-white/80 font-bold mt-2 tracking-widest uppercase text-xs">
          {subtitulo}
        </p>
      </div>
    );
  }