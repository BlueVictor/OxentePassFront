'use client'
import { useState } from 'react';
import { chamadaAPI } from "../../../backend/chamadaPadrao";
import { LayoutGeral } from "../../_components/LayoutGeral";
import { HeaderInterno } from "../../_components/HeaderInterno";
import { FormBuscaPadrao } from "../../_components/FormBuscaPadrao";

export default function BuscarVendaPorId() {
  const [idBusca, setIdBusca] = useState('');
  const [venda, setVenda] = useState<any | null>(null);
  const [carregando, setCarregando] = useState(false);

  const handleBuscar = async (e: React.FormEvent) => {
    e.preventDefault();
    setVenda(null);
    setCarregando(true);
    try {
      const response = await chamadaAPI(`/venda/buscar/${idBusca}`, "GET");
      if (response && response.id) {
        setVenda(response);
      } else {
        alert("Venda não encontrada!");
      }
    } finally { setCarregando(false); }
  };

  return (
    <LayoutGeral voltarLink="/vendas">
      <HeaderInterno titulo="Consultar Venda" subtitulo="Buscar venda por id" iconeString="O" />
      
      <div className="p-0">
        <FormBuscaPadrao 
          label="ID da Transação" 
          placeholder="Ex: 1" 
          valor={idBusca} 
          setValor={setIdBusca} 
          onSubmit={handleBuscar} 
          carregando={carregando} 
        />

        {venda && (
          <div className="p-10 animate-in zoom-in-95 duration-500">
            <div className="max-w-xl mx-auto bg-[#f2fcf9] border border-[#d1f4e6] rounded-[2rem] p-8 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-sm font-black text-teal-800 uppercase tracking-widest flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full animate-pulse ${venda.status?.toUpperCase() === 'CANCELADA' ? 'bg-red-500' : 'bg-teal-500'}`}></span>
                  Venda #{venda.id}
                </h3>
                <span className="px-3 py-1 bg-white text-teal-600 border border-teal-100 rounded-full text-[10px] font-black shadow-sm">
                  IDENTIFICADA
                </span>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status da Venda</span>
                  <span className={`font-bold uppercase text-xs ${venda.status?.toUpperCase() === 'CANCELADA' ? 'text-red-600' : 'text-slate-700'}`}>
                    {venda.status}
                  </span>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Código do Cliente</span>
                  <span className="font-bold text-slate-700">{venda.usuario?.id || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </LayoutGeral>
  );
}