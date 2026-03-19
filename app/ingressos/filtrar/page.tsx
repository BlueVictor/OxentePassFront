'use client'
import { useState } from 'react';
import { chamadaAPI } from "../../../backend/chamadaPadrao";
import { LayoutGeral } from "../../_components/LayoutGeral";
import { HeaderInterno } from "../../_components/HeaderInterno";
import { GridCards } from "../../_components/GridCards";

export default function FiltrarIngressos() {
  const [ingressos, setIngressos] = useState<any[]>([]);
  const [filtros, setFiltros] = useState({ tipo: '', ValorMenor: '' });
  const [buscou, setBuscou] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erroValidacao, setErroValidacao] = useState('');

  const handleFiltrar = async (e: React.FormEvent) => {
    e.preventDefault(); setErroValidacao('');
    const termo = filtros.tipo.trim(); const valor = filtros.ValorMenor.trim();

    if (!termo && !valor) return setErroValidacao('Preencha pelo menos um dos campos.');
    if (termo.length > 0 && termo.length < 3) return setErroValidacao('Digite pelo menos 3 letras.');

    setCarregando(true); setBuscou(false);

    try {
      const data = await chamadaAPI(`/ingresso/listar?page=0&size=1000`, "GET");
      let resultadosDaApi = data?.content || data || [];

      if (termo) resultadosDaApi = resultadosDaApi.filter((ing: any) => ing.tipo?.toLowerCase().includes(termo.toLowerCase()));
      if (valor) {
        const valorMax = parseFloat(valor);
        if (!isNaN(valorMax)) resultadosDaApi = resultadosDaApi.filter((ing: any) => ing.valorBase <= valorMax);
      }
      setIngressos(resultadosDaApi); setBuscou(true);
    } catch (error) { console.error("Erro", error); } 
    finally { setCarregando(false); }
  };

  return (
    <LayoutGeral voltarLink="/ingressos">
      <HeaderInterno titulo="Filtrar Ingressos" subtitulo="Busca avançada de Ingressos" iconeString="I" />
      
      <div className="p-8 sm:p-10 bg-white">
        <form onSubmit={handleFiltrar} className="mb-8 border-b border-slate-100 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-2">
            <div>
              <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Palavra-chave</label>
              <input type="text" value={filtros.tipo} onChange={(e) => { setFiltros({ ...filtros, tipo: e.target.value }); setErroValidacao(''); }} placeholder="Ex: VIP" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-teal-500 font-medium" />
            </div>
            <div>
              <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Preço Máximo (R$)</label>
              <input type="number" value={filtros.ValorMenor} onChange={(e) => { setFiltros({ ...filtros, ValorMenor: e.target.value }); setErroValidacao(''); }} placeholder="Ex: 150.00" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-teal-500 font-medium" />
            </div>
          </div>
          {erroValidacao && <div className="text-red-500 text-xs font-bold py-2">⚠️ {erroValidacao}</div>}
          <div className="flex justify-center mt-6">
            <button type="submit" disabled={carregando} className="w-full md:w-auto md:px-20 bg-teal-600 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-teal-700 transition-all">
              {carregando ? 'Buscando...' : 'Aplicar Filtros'}
            </button>
          </div>
        </form>

        {carregando && <div className="text-center py-12 text-slate-400 font-bold text-xs uppercase">A carregar dados...</div>}

        {buscou && !carregando && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between mb-6 px-2">
              <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">Resultados Encontrados</h2>
              <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase">{ingressos.length} Registros</span>
            </div>
            <GridCards ingressos={ingressos} mensagemVazio="Nenhum ingresso atende a estes critérios." />
          </div>
        )}
      </div>
    </LayoutGeral>
  );
}