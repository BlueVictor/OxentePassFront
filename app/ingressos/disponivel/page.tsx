'use client'
import { useState } from 'react';
import { chamadaAPI } from "../../../backend/chamadaPadrao";
import { LayoutGeral } from "../../_components/LayoutGeral";
import { HeaderInterno } from "../../_components/HeaderInterno";
import { FormBuscaPadrao } from "../../_components/FormBuscaPadrao";
import { GridCards } from "../../_components/GridCards";

export default function IngressosDisponiveis() {
  const [idEvento, setIdEvento] = useState('');
  const [ingressos, setIngressos] = useState<any[]>([]);
  const [buscou, setBuscou] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const handleBuscar = async (e: React.FormEvent) => {
    e.preventDefault(); setCarregando(true); setBuscou(false);
    try {
      const data = await chamadaAPI(`/ingresso/disponivel/${idEvento}?page=0&size=100`, "GET");
      setIngressos(data?.content || data || []);
    } catch (error) { setIngressos([]); } 
    finally { setCarregando(false); setBuscou(true); }
  };

  return (
    <LayoutGeral voltarLink="/ingressos">
      <HeaderInterno titulo="Disponibilidade" subtitulo="Verifique o estoque de um evento específico" iconeString="I" />
      
      <div className="bg-white">
        <FormBuscaPadrao 
          label="ID do Evento" 
          placeholder="Ex: 1" 
          valor={idEvento} 
          setValor={setIdEvento} 
          onSubmit={handleBuscar} 
          carregando={carregando} 
          textoBotao="Ver Lotes" 
        />

        <div className="p-8 sm:p-10">
          {carregando && <div className="text-center py-12 text-slate-400 font-bold text-xs uppercase">Buscando estoques...</div>}
          
          {buscou && !carregando && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6 px-2">Lotes do Evento #{idEvento}</h2>
              <GridCards ingressos={ingressos} mensagemVazio="Nenhum ingresso encontrado para este Evento." />
            </div>
          )}

          {!buscou && !carregando && (
            <div className="text-center py-12 text-slate-400 font-bold text-xs uppercase tracking-widest">
              Aguardando ID do evento...
            </div>
          )}
        </div>
      </div>
    </LayoutGeral>
  );
}