'use client'

import { useToast } from "@/app/_components/ToastProvider";
import { chamadaAPI } from "../../../../backend/chamadaPadrao";
import { redirect } from "next/navigation";
import { useState } from "react";
import { LayoutGeral } from "@/app/_components/LayoutGeral";
import { HeaderInterno } from "@/app/_components/HeaderInterno";
import { Store, MapPin, CheckCircle2 } from "lucide-react";
import "../../../globals.css";

export default function CriarPontoVendaPage() {
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    detalhes: "",
    cep: "",
    bairro: "",
    rua: "",
    numero: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const criarPontoVenda = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const response = await chamadaAPI(
      "/pontovenda",
      "POST",
      {
        ...formData,
        numero: Number(formData.numero),
      },
      { returnMeta: true }
    );

    if (!response?.ok) {
      showToast("Não foi possível criar o ponto de venda.", "error");
      setIsSubmitting(false);
      return;
    }

    showToast("Ponto de venda criado com sucesso!", "success");
    redirect("/organizador/ponto-venda");
  };

  const inputClass = "w-full border border-slate-200 rounded-2xl p-4 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-slate-50/50 font-semibold text-sm text-slate-700";
  const labelClass = "text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 block mb-2";
  const sectionTitleClass = "flex items-center gap-2 text-slate-400 border-b border-slate-100 pb-2 mb-6 mt-8 first:mt-0";

  return (
    <LayoutGeral voltarLink="/organizador/ponto-venda">
      <HeaderInterno 
        titulo="Criar Ponto de Venda"
        subtitulo="Cadastre um novo local físico para venda de ingressos"
        iconeString="🏪"
      />

      <div className="p-8 lg:p-12 w-full max-w-4xl mx-auto">
        <form onSubmit={criarPontoVenda}>
          
          <div className={sectionTitleClass}>
            <Store size={18} />
            <h2 className="text-sm font-bold uppercase tracking-widest">Informações Gerais</h2>
          </div>

          <div className="flex flex-col gap-6 mb-8">
            <div className="flex flex-col">
              <label htmlFor="nome" className={labelClass}>Nome do Estabelecimento <span className="text-emerald-500">*</span></label>
              <input
                type="text"
                name="nome"
                id="nome"
                value={formData.nome}
                onChange={handleChange}
                placeholder="Ex: Loja Central"
                className={inputClass}
                required
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="detalhes" className={labelClass}>Detalhes <span className="text-emerald-500">*</span></label>
              <textarea
                name="detalhes"
                id="detalhes"
                value={formData.detalhes}
                onChange={handleChange}
                rows={4}
                placeholder="Horário de funcionamento, referências, etc."
                className={`${inputClass} resize-none`}
                required
              />
            </div>
          </div>

          <div className={sectionTitleClass}>
            <MapPin size={18} />
            <h2 className="text-sm font-bold uppercase tracking-widest">Endereço do Local</h2>
          </div>

          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label htmlFor="cep" className={labelClass}>CEP <span className="text-emerald-500">*</span></label>
                <input
                  type="text"
                  name="cep"
                  id="cep"
                  maxLength={8}
                  placeholder="00000000"
                  value={formData.cep}
                  onChange={handleChange}
                  className={inputClass}
                  required
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="bairro" className={labelClass}>Bairro <span className="text-emerald-500">*</span></label>
                <input
                  type="text"
                  name="bairro"
                  id="bairro"
                  value={formData.bairro}
                  onChange={handleChange}
                  className={inputClass}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col md:col-span-2">
                <label htmlFor="rua" className={labelClass}>Rua <span className="text-emerald-500">*</span></label>
                <input
                  type="text"
                  name="rua"
                  id="rua"
                  value={formData.rua}
                  onChange={handleChange}
                  className={inputClass}
                  required
                />
              </div>
              <div className="flex flex-col md:col-span-1">
                <label htmlFor="numero" className={labelClass}>Número <span className="text-emerald-500">*</span></label>
                <input
                  type="number"
                  name="numero"
                  id="numero"
                  value={formData.numero}
                  onChange={handleChange}
                  className={inputClass}
                  required
                />
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-100 mt-8">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-5 rounded-2xl shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-70 uppercase tracking-widest text-[12px]"
            >
              {isSubmitting ? (
                <span className="animate-pulse">Cadastrando...</span>
              ) : (
                <>
                  <CheckCircle2 size={20} />
                  Cadastrar Ponto de Venda
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </LayoutGeral>
  );
}