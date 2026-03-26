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

export default function IngressosDisponiveis() {
  const router = useRouter();
  const [idEvento, setIdEvento] = useState('');
  const [ingressos, setIngressos] = useState<any[]>([]);
  const [buscou, setBuscou] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isToastOpen, setIsToastOpen] = useState(false);
  const [idParaDeletar, setIdParaDeletar] = useState<number | null>(null);
  const [toastConfig, setToastConfig] = useState({ title: "", message: "", type: 'success' as 'success' | 'error' });

  const handleBuscar = async (e: React.FormEvent) => {
    e.preventDefault(); setCarregando(true); setBuscou(false);
    try {
      const data = await chamadaAPI(`/ingresso/disponivel/${idEvento}?page=0&size=100`, "GET");
      const lista = data?.content || data || [];
      
      setIngressos(lista.map((ing: any) => ({
        ...ing,
        tipo: ing.tipo || ing.tipoIngresso
      })));
    } catch (error) { setIngressos([]); } 
    finally { setCarregando(false); setBuscou(true); }
  };

  const confirmarDeletar = async () => {
    if (!idParaDeletar) return;
    try {
      await chamadaAPI(`/evento/${idEvento}/removerIngresso/${idParaDeletar}`, "PATCH");
      setIngressos(prev => prev.filter(ing => ing.id !== idParaDeletar));
      setToastConfig({ title: "Sucesso", message: "Lote excluído com sucesso!", type: "success" });
      setIsToastOpen(true);
    } catch (error) {
      setToastConfig({ title: "Erro", message: "Falha ao excluir lote.", type: "error" });
      setIsToastOpen(true);
    } finally { setIsModalOpen(false); }
  };

  return (
    <LayoutGeral voltarLink="/ingressos" scroll>
      <HeaderInterno titulo="Disponibilidade" subtitulo="Verifique o estoque de um evento específico" iconeString="📊" />
      
      <div className="bg-white">
        <FormBuscaPadrao label="ID do Evento" placeholder="Ex: 1" valor={idEvento} setValor={setIdEvento} onSubmit={handleBuscar} carregando={carregando} textoBotao="Ver Lotes" />

        <div className="p-8 sm:p-10">
          {carregando && <div className="text-center py-12 text-slate-400 font-bold text-xs uppercase">Buscando estoques...</div>}
          
          {buscou && !carregando && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6 px-2">Lotes do Evento #{idEvento}</h2>
              <GridCards 
                ingressos={ingressos} 
                mensagemVazio="Nenhum ingresso encontrado para este Evento." 
                onEditar={(id) => router.push(`/ingressos/editar/${id}?from=/ingressos/disponivel`)}
                onDeletar={(id) => { setIdParaDeletar(id); setIsModalOpen(true); }}
              />
            </div>
          )}
        </div>
      </div>
      <ConfirmationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onConfirm={confirmarDeletar} title="Excluir Lote?" message="Isso removerá o ingresso deste evento permanentemente." />
      <ToastCentral isOpen={isToastOpen} onClose={() => setIsToastOpen(false)} title={toastConfig.title} message={toastConfig.message} type={toastConfig.type} />
    </LayoutGeral>
  );
}