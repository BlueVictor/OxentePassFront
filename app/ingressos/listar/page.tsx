'use client'
import { useState, useEffect } from 'react';
import { chamadaAPI } from "../../../backend/chamadaPadrao";
import { LayoutGeral } from "../../_components/LayoutGeral";
import { HeaderInterno } from "../../_components/HeaderInterno";
import { TabelaIng } from "../../_components/TabelaIng";

export default function ListarIngressos() {
  const [ingressos, setIngressos] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const buscarDados = async () => {
      try {
        const data = await chamadaAPI("/ingresso/listar?page=0&size=1000", "GET");
        setIngressos(data?.content || data || []);
      } catch (error) { console.error("Erro", error); } 
      finally { setCarregando(false); }
    };
    buscarDados();
  }, []);

  return (
    <LayoutGeral voltarLink="/ingressos">
      <HeaderInterno titulo="Estoque de Ingressos" subtitulo="Listagem dos Ingressos disponíveis" iconeString="I" />
      <div className="p-0">
        {carregando ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 animate-in fade-in duration-300">
            <div className="w-8 h-8 border-3 border-teal-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="font-bold text-xs uppercase tracking-widest">Sincronizando Banco de Dados...</p>
          </div>
        ) : (
          <TabelaIng ingressos={ingressos} />
        )}
      </div>
    </LayoutGeral>
  );
}