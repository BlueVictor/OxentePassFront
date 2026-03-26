'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { chamadaAPI } from "../../../backend/chamadaPadrao";
import { LayoutGeral } from "../../_components/LayoutGeral";
import { HeaderInterno } from "../../_components/HeaderInterno";
import { FormBuscaPadrao } from "../../_components/FormBuscaPadrao";
import { GridCards } from "../../_components/GridCards";
import { ConfirmationModal } from "../../_components/Organizador/Ingressos/ConfirmationModal";
import { ToastCentral } from "../../_components/Organizador/Ingressos/ToastCentral";

export default function BuscarIngressoId() {
  const router = useRouter(); 
  const [id, setId] = useState('');
  const [ingresso, setIngresso] = useState<any>(null);
  const [buscou, setBuscou] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isToastOpen, setIsToastOpen] = useState(false);
  const [toastConfig, setToastConfig] = useState({ title: "", message: "", type: 'success' as 'success' | 'error' });

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
  
  const handleDeletar = async () => {
    try {
      const eventoId = ingresso?.eventoId;
      await chamadaAPI(`/evento/${eventoId}/removerIngresso/${ingresso.id}`, "PATCH");
      setIngresso(null);
      setToastConfig({ title: "Sucesso", message: "Lote excluído com sucesso!", type: "success" });
      setIsToastOpen(true);
    } catch (error) {
      setToastConfig({ title: "Erro", message: "Falha ao excluir o lote.", type: "error" });
      setIsToastOpen(true);
    } finally {
      setIsModalOpen(false);
    }
  };

  return (
    <LayoutGeral voltarLink="/ingressos" compacto>
      <HeaderInterno titulo="Buscar Ingresso" subtitulo="Busca de ingresso por Id" iconeString="🔍" />
      
      <div className="bg-white">
        <FormBuscaPadrao label="ID do Ingresso" placeholder="Ex: 1" valor={id} setValor={setId} onSubmit={handleBuscar} carregando={carregando} textoBotao="Pesquisar Lote" />

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
                onEditar={(id) => router.push(`/ingressos/editar/${id}?from=/ingressos/buscar-id`)}
                onDeletar={() => setIsModalOpen(true)}
              />
            </div>
          )}
        </div>
      </div>

      <ConfirmationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onConfirm={handleDeletar} 
        title="Excluir Lote?" 
        message="Deseja realmente apagar este ingresso permanentemente?" 
      />
      <ToastCentral isOpen={isToastOpen} onClose={() => setIsToastOpen(false)} title={toastConfig.title} message={toastConfig.message} type={toastConfig.type} />
    </LayoutGeral>
  );
}