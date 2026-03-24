'use client';

export default function PontoVendaSelector({ pontoVendaExistentes, selecionados, setSelecionados }: any) {
  
  const selecionarPonto = (tag: any) => {
    setSelecionados((prev: any) => {
      if (prev.includes(tag.id)) {
        return prev.filter((id: any) => id !== tag.id);
      } 
      else {
        return [...prev, tag.id];
      }
    });
  }

  return (
    <div>
      <h1 className="mt-1 mb-1.5">Gerir Pontos de Venda</h1>
      <div className="space-y-3 border border-slate-200 rounded-xl p-3">
        {/* Subtitulo */}
        <h2 className='w-full'>Selecione Pontos de Venda</h2>

        {/* Seleção de Pontos de Venda */}
        <div className='flex flex-row gap-5'>
          <div className="flex flex-wrap gap-3 w-full">
            {pontoVendaExistentes.map((ponto: any) => {
              const ativa = selecionados.includes(ponto.id);

              return (
                <button
                  type="button"
                  key={ponto.id}
                  onClick={() => selecionarPonto(ponto)}
                  className={`px-3 py-1 rounded ${
                    ativa ? 'bg-blue-600 text-white' : 'bg-gray-200'
                  }`}
                >
                  <div>
                    {ponto.nome}
                    <div className="text-xs">{ponto.endereco.bairro}, {ponto.endereco.rua}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}