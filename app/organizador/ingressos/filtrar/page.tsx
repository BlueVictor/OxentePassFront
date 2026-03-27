'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { chamadaAPI } from "../../../../backend/chamadaPadrao";
import { LayoutGeral } from "../../../_components/LayoutGeral";
import { HeaderInterno } from "../../../_components/HeaderInterno";
import { GridCards } from "../../../_components/GridCards";
import { ConfirmationModal } from "../../../_components/Organizador/Ingressos/ConfirmationModal";
import { ToastCentral } from "../../../_components/Organizador/Ingressos/ToastCentral";

export default function FiltrarIngressos() {
  const router = useRouter();
  const [ingressos, setIngressos] = useState<any[]>([]);
  const [filtros, setFiltros] = useState({ tipo: '', ValorMenor: '' });
  const [buscou, setBuscou] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erroValidacao, setErroValidacao] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isToastOpen, setIsToastOpen] = useState(false);
  const [idParaDeletar, setIdParaDeletar] = useState<number | null>(null);
  const [toastConfig, setToastConfig] = useState({ title: "", message: "", type: 'success' as 'success' | 'error' });

  const handleFiltrar = async (e: React.FormEvent) => {
    e.preventDefault(); setErroValidacao('');
    const termo = filtros.tipo.trim(); const valor = filtros.ValorMenor.trim();
    if (!termo && !valor) return setErroValidacao('Preencha pelo menos um dos campos.');
    if (termo.length > 0 && termo.length < 3) return setErroValidacao('Digite pelo menos 3 letras.');

    setCarregando(true); setBuscou(false);
    try {
      const data = await chamadaAPI(`/ingresso/listar?page=0&size=1000`, "GET");
      let resultadosDaApi = data?.content || data || [];

      if (termo) resultadosDaApi = resultadosDaApi.filter((ing: any) => 
        (ing.tipo || ing.tipoIngresso)?.toLowerCase().includes(termo.toLowerCase())
      );
      if (valor) {
        const valorMax = parseFloat(valor);
        if (!isNaN(valorMax)) resultadosDaApi = resultadosDaApi.filter((ing: any) => ing.valorBase <= valorMax);
      }

      setIngressos(resultadosDaApi.map((ing: any) => ({
        ...ing,
        tipo: ing.tipo || ing.tipoIngresso
      })));
      
      setBuscou(true);
    } catch (error) { console.error("Erro", error); } 
    finally { setCarregando(false); }
  };

  const confirmarDeletar = async () => {
    if (!idParaDeletar) return;
    const ing = ingressos.find(i => i.id === idParaDeletar);
    
    const eventoId = ing?.eventoId || ing?.evento?.id;

    try {
      await chamadaAPI(`/evento/${eventoId}/removerIngresso/${idParaDeletar}`, "PATCH");
      setIngressos(prev => prev.filter(i => i.id !== idParaDeletar));
      setToastConfig({ title: "Sucesso", message: "Lote removido com sucesso!", type: "success" });
      setIsToastOpen(true);
    } catch (error) {
      setToastConfig({ title: "Erro", message: "Falha ao remover lote.", type: "error" });
      setIsToastOpen(true);
    } finally { setIsModalOpen(false); }
  };

  return (
    <LayoutGeral voltarLink="/organizador/ingressos" scroll>
      <HeaderInterno titulo="Filtrar Ingressos" subtitulo="Busca avançada de Ingressos" iconeString="⚡" />
      
      <div className="p-8 sm:p-10 bg-white">
        <form onSubmit={handleFiltrar} className="mb-8 border-b border-slate-100 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-2">
            <div>
              <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Palavra-chave (Lote)</label>
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

        {buscou && !carregando && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between mb-6 px-2">
              <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">Resultados Encontrados</h2>
              <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase">{ingressos.length} Registros</span>
            </div>
            <GridCards 
                ingressos={ingressos} 
                mensagemVazio="Nenhum ingresso atende a estes critérios." 
                onEditar={(id) => router.push(`/ingressos/editar/${id}?from=/ingressos/filtrar`)}
                onDeletar={(id) => { setIdParaDeletar(id); setIsModalOpen(true); }}
            />
          </div>
        )}
      </div>
      <ConfirmationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onConfirm={confirmarDeletar} title="Excluir Lote?" message="Esta ação não pode ser desfeita." />
      <ToastCentral isOpen={isToastOpen} onClose={() => setIsToastOpen(false)} title={toastConfig.title} message={toastConfig.message} type={toastConfig.type} />
    </LayoutGeral>
  );
}