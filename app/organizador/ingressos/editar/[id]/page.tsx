'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { chamadaAPI } from "@/backend/chamadaPadrao";
import { LayoutGeral } from "../../../../_components/LayoutGeral";
import { HeaderInterno } from "../../../../_components/HeaderInterno";
import { Ticket, CircleDollarSign, Layers, Info, CheckCircle2, Sparkles } from "lucide-react";

export default function EditarIngressoPage() {
  const router = useRouter();
  const params = useParams();
  const idIngresso = params?.id;

  const searchParams = useSearchParams();
  const urlDeVolta = searchParams?.get('from') || '/organizador/ingressos/listar';

  const [eventos, setEventos] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  const [formData, setFormData] = useState({
    eventoId: '',
    tipoIngresso: '',
    preco: '',
    quantidade: '',
    temMeiaEntrada: false,
    descricao: ''
  });

  useEffect(() => {
    async function carregarDados() {
      if (!idIngresso) return;
      
      try {
        setCarregando(true);

        const dadosEventos = await chamadaAPI("/evento", "GET");
        setEventos(dadosEventos?.content || dadosEventos || []);

        const dadosIngresso = await chamadaAPI(`/ingresso/buscar/${idIngresso}`, "GET");
        
        if (dadosIngresso) {
          setFormData({
            eventoId: dadosIngresso.eventoId?.toString() || dadosIngresso.evento?.id?.toString() || '',
            tipoIngresso: dadosIngresso.tipo || dadosIngresso.tipoIngresso || '',
            preco: dadosIngresso.valorBase?.toString() || '',
            quantidade: dadosIngresso.quantidadeDisponivel?.toString() || '',
            temMeiaEntrada: dadosIngresso.temMeiaEntrada || false,
            descricao: dadosIngresso.descricao || '' 
          });
        }
      } catch (error) {
        console.error("Erro ao carregar dados", error);
      } finally {
        setCarregando(false);
      }
    }
    carregarDados();
  }, [idIngresso]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalvando(true);

    const payload = {
      tipo: formData.tipoIngresso,
      valorBase: Number(formData.preco),
      quantidadeDisponivel: Number(formData.quantidade),
      temMeiaEntrada: formData.temMeiaEntrada,
      descricao: formData.descricao
    };

    try {
      await chamadaAPI(`/ingresso/editar/${idIngresso}`, "PUT", payload);
      
      router.push(urlDeVolta); 

    } catch (error) {
      console.error("Erro ao salvar", error);
      alert("Erro ao salvar as edições do lote.");
    } finally {
      setSalvando(false);
    }
  };

  const nomeEventoSelecionado = eventos.find(e => e.id.toString() === formData.eventoId)?.nome || "Evento Vinculado";

  return (
    <LayoutGeral voltarLink={urlDeVolta} scroll>
      <HeaderInterno 
        titulo="Editar Lote" 
        subtitulo="Atualize a precificação e detalhes do ingresso" 
        iconeString="✏️" 
      />

      <div className="max-w-7xl mx-auto p-6 lg:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          <div className="lg:col-span-5 lg:sticky lg:top-32 space-y-6">
            <div className="flex items-center gap-2 ml-2 text-slate-400">
              <Sparkles className="w-4 h-4 text-emerald-500" />
              <span className="text-[12px] font-black uppercase tracking-[0.3em]">Preview do Cliente</span>
            </div>
            
            <div className="relative w-full bg-emerald-600 rounded-[2.5rem] shadow-2xl shadow-emerald-200 overflow-hidden text-white transition-all duration-500 hover:scale-[1.01]">
              <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-slate-50 rounded-full z-20"></div>
              <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-slate-50 rounded-full z-20"></div>
              
              <div className="p-8 space-y-6">
                <div className="flex justify-between items-start">
                  <div className="bg-white/20 backdrop-blur-md p-3 rounded-2xl">
                    <Ticket className="w-8 h-8" />
                  </div>
                  <div className="text-right">
                    <p className="text-[12px] font-black opacity-60 uppercase tracking-widest">Status</p>
                    <p className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full inline-block mt-1 uppercase tracking-tight">Modo Edição</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-bold opacity-70 uppercase tracking-tighter truncate">{nomeEventoSelecionado}</p>
                  <h3 className="text-3xl font-black leading-none tracking-tighter break-words">
                    {formData.tipoIngresso || "Setor / Lote"}
                  </h3>
                </div>

                {formData.descricao && (
                  <div className="bg-black/10 rounded-2xl p-4 border border-white/10 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="flex items-center gap-2 mb-2">
                      <Info className="w-3 h-3 text-emerald-200" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-emerald-100/60 font-sans">Informações Adicionais</span>
                    </div>
                    <p className="text-xs leading-relaxed opacity-90 italic font-medium whitespace-pre-wrap break-words">
                      "{formData.descricao}"
                    </p>
                  </div>
                )}

                <div className="border-t-2 border-dashed border-white/30 my-4 relative">
                  <div className="absolute inset-0 bg-white/5 blur-sm -top-1"></div>
                </div>

                <div className="flex justify-between items-end gap-4">
                  <div className="min-w-0">
                    <p className="text-[12px] font-black opacity-60 uppercase tracking-widest mb-1">Valor Unitário</p>
                    <p className="text-2xl font-black italic tracking-tighter flex items-baseline gap-1">
                      <span className="text-sm font-bold not-italic opacity-70">R$</span>
                      {formData.preco ? Number(formData.preco).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : "0,00"}
                    </p>
                  </div>
                  <div className="text-right flex flex-col items-end gap-2 shrink-0">
                    {formData.temMeiaEntrada && (
                      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/20 rounded-lg text-[12px] font-black uppercase tracking-tighter">
                        <CheckCircle2 className="w-3 h-3 text-emerald-300" /> Meia-entrada
                      </div>
                    )}
                    <p className="text-[11px] font-bold bg-black/20 px-4 py-2 rounded-xl border border-white/5">
                      {formData.quantidade || "0"} Unidades
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-white rounded-[3rem] border border-slate-100 shadow-sm p-8 md:p-12 relative overflow-hidden">
            {carregando ? (
              <div className="py-20 flex flex-col items-center justify-center space-y-4">
                <div className="w-10 h-10 border-4 border-emerald-100 border-t-emerald-500 rounded-full animate-spin"></div>
                <span className="font-black text-slate-300 uppercase tracking-widest text-xs">Carregando Lote...</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-10 animate-in fade-in duration-500">
                
                <section className="space-y-4">
                  <div className="flex items-center gap-3 ml-1">
                    <Layers className="w-4 h-4 text-slate-400" />
                    <label className="font-black text-slate-500 uppercase tracking-[0.2em] text-[12px]">Evento Vinculado</label>
                  </div>
                  <select
                    required
                    disabled
                    value={formData.eventoId}
                    onChange={(e) => setFormData({...formData, eventoId: e.target.value})}
                    className="w-full bg-slate-100/70 border-2 border-slate-100 rounded-2xl p-5 outline-none text-slate-500 font-bold appearance-none cursor-not-allowed"
                  >
                    <option value="">Selecione o evento</option>
                    {eventos.map((evt) => (
                      <option key={evt.id} value={evt.id.toString()}>{evt.nome}</option>
                    ))}
                  </select>
                </section>

                <section className="space-y-4">
                  <div className="flex items-center gap-3 ml-1">
                    <CircleDollarSign className="w-4 h-4 text-slate-400" />
                    <label className="font-black text-slate-500 uppercase tracking-[0.2em] text-[12px]">Definição de Lote</label>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input
                      required
                      placeholder="Ex: VIP"
                      value={formData.tipoIngresso}
                      onChange={(e) => setFormData({...formData, tipoIngresso: e.target.value})}
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-5 outline-none focus:border-emerald-500 focus:bg-white transition-all font-bold"
                    />
                    <input
                      required
                      type="number"
                      step="0.01"
                      placeholder="Preço R$ 0,00"
                      value={formData.preco}
                      onChange={(e) => setFormData({...formData, preco: e.target.value})}
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-5 outline-none focus:border-emerald-500 focus:bg-white transition-all font-black text-emerald-600 text-lg"
                    />
                  </div>
                </section>

                <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 ml-1">
                            <Ticket className="w-4 h-4 text-slate-400" />
                            <label className="font-black text-slate-500 uppercase tracking-[0.2em] text-[12px]">Carga de Ingressos</label>
                        </div>
                        <input
                            required
                            type="number"
                            placeholder="Quantidade total"
                            value={formData.quantidade}
                            onChange={(e) => setFormData({...formData, quantidade: e.target.value})}
                            className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-5 outline-none focus:border-emerald-500 focus:bg-white transition-all font-bold"
                        />
                    </div>

                    <label className={`flex items-center justify-between p-5 rounded-2xl border-2 transition-all cursor-pointer h-[68px] ${formData.temMeiaEntrada ? 'bg-emerald-50 border-emerald-500' : 'bg-slate-50 border-slate-100'}`}>
                        <div className="flex flex-col">
                            <span className={`font-black text-[11px] uppercase tracking-wider ${formData.temMeiaEntrada ? 'text-emerald-700' : 'text-slate-500'}`}>Meia-Entrada</span>
                            <span className="text-[9px] font-bold text-slate-400 uppercase italic">Desconto de 50%</span>
                        </div>
                        <input
                            type="checkbox"
                            checked={formData.temMeiaEntrada}
                            onChange={(e) => setFormData({...formData, temMeiaEntrada: e.target.checked})}
                            className="w-6 h-6 rounded-lg text-emerald-500 focus:ring-emerald-500 cursor-pointer"
                        />
                    </label>
                </section>

                <section className="space-y-4">
                  <div className="flex items-center gap-3 ml-1">
                    <Info className="w-4 h-4 text-slate-400" />
                    <label className="font-black text-slate-500 uppercase tracking-[0.2em] text-[12px]">Benefícios e Descrição</label>
                  </div>
                  <textarea
                    rows={6}
                    placeholder="Quais experiências estão incluídas neste lote? Descreva detalhadamente aqui..."
                    value={formData.descricao}
                    onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl p-6 outline-none focus:border-emerald-500 focus:bg-white transition-all font-medium text-slate-600 leading-relaxed resize-none"
                  />
                </section>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={salvando}
                    className="w-full py-7 rounded-[2rem] bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-[0.35em] text-xs shadow-xl transition-all active:scale-[0.97] disabled:bg-slate-200"
                  >
                    {salvando ? "Salvando Alterações..." : "Salvar Alterações do Lote"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </LayoutGeral>
  );
}