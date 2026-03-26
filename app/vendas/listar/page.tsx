'use client'
import { useState, useEffect } from 'react';
import { ClipboardList } from "lucide-react";
import { chamadaAPI } from "../../../backend/chamadaPadrao";
import { LayoutGeral } from "../../_components/LayoutGeral";
import { HeaderInterno } from "../../_components/HeaderInterno";
import { TabelaCompleta } from "../../_components/Organizador/Vendas/TabelaCompleta";
import { ModalAcoes } from "../../_components/ModalAcoes";
import "../../globals.css";

export default function ListarVendas() {
  const [vendas, setVendas] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [toast, setToast] = useState({ visivel: false, mensagem: '', tipo: 'sucesso' });
  const [modal, setModal] = useState<{ visivel: boolean; acao: 'finalizar' | 'cancelar' | 'adicionar' | 'remover' | null; idVenda: number | null }>({ visivel: false, acao: null, idVenda: null });
  const [inputIngresso, setInputIngresso] = useState('');
  const [inputQtd, setInputQtd] = useState('1');
  const [processandoAcao, setProcessandoAcao] = useState(false);

  useEffect(() => { carregarVendas(); }, []);

  const carregarVendas = async () => {
    setCarregando(true);
    try {
      const response = await chamadaAPI(`/venda/listar?page=0&size=50&_t=${new Date().getTime()}`, "GET");
      if (response && response.content) setVendas(response.content);
      else if (Array.isArray(response)) setVendas(response);
    } catch (error) { mostrarToast("Erro de conexão ao carregar as vendas.", "erro"); } 
    finally { setCarregando(false); }
  };

  const mostrarToast = (mensagem: string, tipo: 'sucesso' | 'erro') => {
    setToast({ visivel: true, mensagem, tipo });
    setTimeout(() => setToast((prev) => ({ ...prev, visivel: false })), 4000);
  };

  const abrirModal = (acao: any, idVenda: number) => {
    setInputIngresso(''); setInputQtd('1');
    setModal({ visivel: true, acao, idVenda });
  };

  const confirmarAcao = async () => {
    if (!modal.idVenda || !modal.acao) return;

    const vendaAtual = vendas.find(v => v.id === modal.idVenda);
    if (vendaAtual) {
      const status = vendaAtual.status?.toUpperCase();
      if (status === 'CANCELADA') return mostrarToast("⚠️ Esta venda está cancelada.", "erro");
      if (modal.acao === 'finalizar' && status !== 'PAGA') return mostrarToast("⚠️ A venda só pode ser finalizada se estiver PAGA.", "erro");
    }

    setProcessandoAcao(true);
    try {
      let response;
      const idIngNum = parseInt(inputIngresso.trim(), 10);
      const qtdNum = parseInt(inputQtd.trim(), 10);

      if (modal.acao === 'finalizar') response = await chamadaAPI(`/venda/finalizar/${modal.idVenda}`, "POST", {});
      else if (modal.acao === 'cancelar') response = await chamadaAPI(`/venda/cancelar/${modal.idVenda}`, "POST", {});
      else if (modal.acao === 'adicionar') {
        if (isNaN(idIngNum) || isNaN(qtdNum) || qtdNum <= 0) return mostrarToast("ID e Quantidade inválidos.", "erro");
        response = await chamadaAPI(`/venda/adicionaringresso/${modal.idVenda}`, "PUT", { ingresso: { id: idIngNum }, quantidade: qtdNum });
      } else if (modal.acao === 'remover') {
        if (isNaN(idIngNum) || isNaN(qtdNum) || qtdNum <= 0) return mostrarToast("ID e Quantidade inválidos.", "erro");
        response = await chamadaAPI(`/venda/removeringresso/${modal.idVenda}/${idIngNum}`, "PUT", { quantidade: qtdNum });
      }

      if (response && (response.erro || response.status >= 400)) {
        mostrarToast(response.mensagem || "Operação negada pelo servidor.", "erro");
      } else {
        mostrarToast("Operação realizada com sucesso!", "sucesso");
        setModal({ visivel: false, acao: null, idVenda: null });
        await carregarVendas();
      }
    } catch (error: any) { mostrarToast(error?.mensagem || "Erro ao processar requisição.", "erro"); } 
    finally { setProcessandoAcao(false); }
  };

  return (
    <LayoutGeral voltarLink="/vendas" scroll>
      
      {toast.visivel && (
        <div className={`fixed bottom-6 right-6 z-[100] px-6 py-4 rounded-2xl shadow-2xl font-bold flex items-center gap-3 animate-in slide-in-from-bottom-6 fade-in duration-300 border ${
          toast.tipo === 'sucesso' ? 'bg-teal-600 text-white border-teal-500' : 'bg-red-500 text-white border-red-400'
        }`}>
          {toast.mensagem}
        </div>
      )}

      <ModalAcoes 
        modal={modal} fecharModal={() => setModal({ visivel: false, acao: null, idVenda: null })} 
        confirmarAcao={confirmarAcao} processandoAcao={processandoAcao} 
        inputIngresso={inputIngresso} setInputIngresso={setInputIngresso} 
        inputQtd={inputQtd} setInputQtd={setInputQtd} 
      />

      <HeaderInterno titulo="Histórico de Vendas" subtitulo="OxentePass • Painel de Controle" icone={<ClipboardList size={24} className="text-teal-600" />} />
      
      <div className="p-0">
        <TabelaCompleta vendas={vendas} abrirModal={abrirModal} />
        
        <div className="mt-8 mb-6 flex justify-between items-center text-[10px] font-black text-slate-300 uppercase tracking-widest px-10">
          <p>{vendas.length} Vendas totais</p>
          <p>Filtro: Últimos 50 registros</p>
        </div>
      </div>
      
    </LayoutGeral>
  );
}