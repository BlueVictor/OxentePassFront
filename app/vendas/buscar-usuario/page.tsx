'use client'
import { useState } from 'react';
import { UserSearch } from "lucide-react";
import { chamadaAPI } from "../../../backend/chamadaPadrao";
import { LayoutGeral } from "../../_components/LayoutGeral";
import { HeaderInterno } from "../../_components/HeaderInterno";
import { FormBuscaPadrao } from "../../_components/FormBuscaPadrao";
import { TabelaSimples } from "../../_components/Organizador/Vendas/TabelaSimples";

export default function BuscarVendaPorUsuario() {
  const [idUsuario, setIdUsuario] = useState('');
  const [vendas, setVendas] = useState<any[]>([]);
  const [buscou, setBuscou] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const handleBuscar = async (e: React.FormEvent) => {
    e.preventDefault();
    setBuscou(false);
    setCarregando(true);

    try {
      const response = await chamadaAPI(`/venda/listar?page=0&size=1000`, "GET");
      let todasAsVendas = response?.content || response || [];
      const vendasDoUsuario = todasAsVendas.filter((v: any) => v.usuario && v.usuario.id === Number(idUsuario));
      setVendas(vendasDoUsuario);
      setBuscou(true);
    } catch (error) { console.error("Erro", error); } 
    finally { setCarregando(false); }
  };

  return (
    <LayoutGeral voltarLink="/vendas" scroll>
      <HeaderInterno titulo="Histórico por Usuário" subtitulo="Histórico completo de transações do cliente" icone={<UserSearch size={24} className="text-teal-600" />} />
      
      <div className="p-0">
        <FormBuscaPadrao 
          label="ID do Usuário" 
          placeholder="Digite o ID (Ex: 1)" 
          valor={idUsuario} 
          setValor={setIdUsuario} 
          onSubmit={handleBuscar} 
          carregando={carregando} 
          textoBotao="Buscar Histórico" 
        />

        {carregando && (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400 animate-in fade-in duration-300">
            <div className="w-8 h-8 border-3 border-teal-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="font-bold text-xs uppercase tracking-widest">Buscando registros...</p>
          </div>
        )}

        {buscou && !carregando && (
          <TabelaSimples vendas={vendas} mensagemVazio="Nenhuma venda vinculada a este ID." />
        )}
      </div>
    </LayoutGeral>
  );
}