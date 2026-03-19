'use client'
import { useState } from 'react';
import { chamadaAPI } from "../../../backend/chamadaPadrao";
import { LayoutGeral } from "../../_components/LayoutGeral";
import { HeaderInterno } from "../../_components/HeaderInterno";
import { FormBuscaPadrao } from "../../_components/FormBuscaPadrao";
import { GridCards } from "../../_components/GridCards";

export default function BuscarIngressoId() {
  const [id, setId] = useState('');
  const [ingresso, setIngresso] = useState<any>(null);
  const [buscou, setBuscou] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const handleBuscar = async (e: React.FormEvent) => {
    e.preventDefault();
    setCarregando(true);
    setBuscou(false);
    
    try {
      const data = await chamadaAPI(`/ingresso/buscar/${id}`, "GET");
      if (data && data.id) {
        setIngresso(data);
      } else {
        setIngresso(null);
      }
    } catch (error) {
      setIngresso(null);
    } finally {
      setCarregando(false);
      setBuscou(true);
    }
  };

  return (
    <LayoutGeral voltarLink="/ingressos">
      <HeaderInterno 
        titulo="Buscar Ingresso" 
        subtitulo="Busca de ingresso por Id" 
        iconeString="I" 
      />
      
      <div className="bg-white">
        <FormBuscaPadrao 
          label="ID do Ingresso" 
          placeholder="Ex: 1" 
          valor={id} 
          setValor={setId} 
          onSubmit={handleBuscar} 
          carregando={carregando} 
          textoBotao="Pesquisar Lote" 
        />

        <div className="p-8 sm:p-10">
          {carregando && (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400 animate-in fade-in duration-300">
              <div className="w-8 h-8 border-3 border-teal-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            </div>
          )}

          {buscou && !carregando && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <GridCards
                ingressos={ingresso ? [ingresso] : []} 
                mensagemVazio="⚠️ Ingresso não encontrado no sistema." 
              />
            </div>
          )}
        </div>
      </div>
    </LayoutGeral>
  );
}