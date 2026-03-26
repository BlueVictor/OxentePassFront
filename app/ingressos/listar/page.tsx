'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { chamadaAPI } from "../../../backend/chamadaPadrao";
import { LayoutGeral } from "../../_components/LayoutGeral";
import { HeaderInterno } from "../../_components/HeaderInterno";
import { TabelaIng } from "../../_components/Organizador/Ingressos/TabelaIng";
import { ConfirmationModal } from "../../_components/Organizador/Ingressos/ConfirmationModal";
import { ToastCentral } from "../../_components/Organizador/Ingressos/ToastCentral";

export default function ListarIngressosPage() {
  const router = useRouter();
  
  const [ingressos, setIngressos] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [idParaDeletar, setIdParaDeletar] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isToastOpen, setIsToastOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toastConfig, setToastConfig] = useState<{title: string, message: string, type: 'success' | 'error'}>({
    title: "", message: "", type: "success"
  });

  const buscarDados = async () => {
    try {
      const data = await chamadaAPI("/ingresso/listar?page=0&size=1000", "GET");
      setIngressos(data?.content || data || []);
    } catch (error) { 
      console.error("Erro ao buscar ingressos:", error); 
    } finally { 
      setCarregando(false); 
    }
  };

  useEffect(() => {
    buscarDados();
  }, []);

  const handleEditar = (id: number) => {
    router.push(`/ingressos/editar/${id}`);
  };

  const handleDeletar = (id: number) => {
    setIdParaDeletar(id);
    setIsModalOpen(true);
  };

  const fecharModal = () => {
    setIsModalOpen(false);
    setIdParaDeletar(null);
  };

  const confirmarDeletar = async () => {
    if (!idParaDeletar) return;
    setIsDeleting(true);

    const ingressoParaDeletar = ingressos.find((ing) => ing.id === idParaDeletar);
    const eventoId = ingressoParaDeletar?.eventoId;

    if (!eventoId) {
      setToastConfig({
        title: "Erro na Exclusão",
        message: "Não foi possível identificar o evento dono deste ingresso.",
        type: "error"
      });
      setIsToastOpen(true);
      fecharModal();
      setIsDeleting(false);
      return;
    }

    try {
      await chamadaAPI(`/evento/${eventoId}/removerIngresso/${idParaDeletar}`, "PATCH");
      
      setIngressos(prev => prev.filter((ing) => ing.id !== idParaDeletar));
      
      setToastConfig({
        title: "Lote Excluído",
        message: "O lote de ingressos foi removido com sucesso.",
        type: "success"
      });
      setIsToastOpen(true);
      
    } catch (error) {
      console.error("Erro na exclusão:", error);
      
      setToastConfig({
        title: "Falha na Operação",
        message: "Erro ao excluir o ingresso. Verifique sua conexão e tente novamente.",
        type: "error"
      });
      setIsToastOpen(true);
    } finally {
      fecharModal();
      setIsDeleting(false);
    }
  };

  return (
    <LayoutGeral voltarLink="/ingressos" scroll>
      <HeaderInterno 
        titulo="Estoque de Lotes" 
        subtitulo="Gestão e listagem de ingressos disponíveis" 
        iconeString="🎟️" 
      />
      <div className="p-0 animate-in fade-in duration-500">
        {carregando ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400">
            <div className="w-10 h-10 border-4 border-emerald-100 border-t-emerald-500 rounded-full animate-spin mb-4"></div>
            <p className="font-black text-xs uppercase tracking-[0.2em]">Sincronizando Banco de Dados...</p>
          </div>
        ) : (
          <TabelaIng 
            ingressos={ingressos} 
            onEditar={handleEditar}
            onDeletar={handleDeletar} 
          />
        )}
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={fecharModal}
        onConfirm={confirmarDeletar}
        title="Tem Certeza?"
        message="Você está prestes a excluir este lote. Esta ação é irreversível e removerá todos os ingressos associados. Deseja continuar?"
        confirmLabel="Sim, Excluir Lote"
        cancelLabel="Cancelar"
        isLoading={isDeleting}
      />

      <ToastCentral
        isOpen={isToastOpen}
        onClose={() => setIsToastOpen(false)}
        title={toastConfig.title}
        message={toastConfig.message}
        type={toastConfig.type}
        duration={3000}
      />
    </LayoutGeral>
  );
}