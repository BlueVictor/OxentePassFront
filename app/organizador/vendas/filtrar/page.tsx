'use client'
import { useState } from 'react';
import { Filter } from "lucide-react";
import { chamadaAPI } from "../../../../backend/chamadaPadrao";
import { LayoutGeral } from "../../../_components/LayoutGeral";
import { HeaderInterno } from "../../../_components/HeaderInterno";
import { TabelaSimples } from "../../../_components/Organizador/Vendas/TabelaSimples";

export default function FiltrarVendas() {
  const [status, setStatus] = useState(''); 
  const [vendas, setVendas] = useState<any[]>([]);
  const [buscou, setBuscou] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const statusDisponiveis = ['ABERTA', 'PAGA', 'FINALIZADA', 'CANCELADA'];

  const handleStatusClick = async (statusSelecionado: string) => {
    setStatus(statusSelecionado); 
    setBuscou(false);
    setCarregando(true);
    
    try {
      const response = await chamadaAPI(`/venda/listar?page=0&size=1000`, "GET");

      let todasAsVendas: any[] = [];
      
      if (response && Array.isArray(response.content)) {
        todasAsVendas = response.content;
      } else if (Array.isArray(response)) {
        todasAsVendas = response;
      }

      const vendasFiltradas = todasAsVendas.filter((v: any) => 
        v.status && v.status.toUpperCase() === statusSelecionado.toUpperCase()
      );
      
      setVendas(vendasFiltradas);
      setBuscou(true);
      
    } catch (error) { 
      console.error("Erro ao buscar vendas:", error);
      setVendas([]); 
      setBuscou(true);
    } finally { 
      setCarregando(false); 
    }
  };

  return (
    <LayoutGeral voltarLink="/organizador/vendas" scroll>
      <HeaderInterno titulo="Filtrar Vendas" subtitulo="Selecione um status para visualizar" icone={<Filter size={24} className="text-teal-600" />} />
      
      <div className="p-0">
        <div className="p-10 border-b border-slate-50">
          <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">Escolha o status</label>
          <div className="flex flex-wrap gap-3">
            {statusDisponiveis.map((s) => (
              <button 
                key={s} 
                type="button" 
                disabled={carregando} 
                onClick={() => handleStatusClick(s)}
                className={`px-5 py-3 rounded-2xl font-bold text-xs tracking-widest transition-all border-2 uppercase ${
                  status === s 
                    ? 'border-teal-500 bg-teal-50 text-teal-700' 
                    : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200'
                }`}
              >
                {carregando && status === s ? 'Buscando...' : s}
              </button>
            ))}
          </div>
        </div>

        {carregando && (
          <div className="p-10 text-center text-slate-400 font-bold text-xs uppercase tracking-widest animate-pulse">
            Carregando vendas...
          </div>
        )}

        {buscou && !carregando && (
          <TabelaSimples vendas={vendas} mensagemVazio={`Nenhuma venda encontrada com o status ${status}.`} />
        )}
      </div>
    </LayoutGeral>
  );
}