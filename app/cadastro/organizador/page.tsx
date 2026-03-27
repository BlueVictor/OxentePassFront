'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { chamadaAPI } from "../../../backend/chamadaPadrao";
import { useToast } from "../../_components/ToastProvider";
import { useAuth } from "../../_components/Auth/AuthProvider";
import { LayoutGeral } from "@/app/_components/LayoutGeral";
import { HeaderInterno } from "@/app/_components/HeaderInterno";
import { Building2, Phone, FileText, CheckCircle2, ShieldCheck } from "lucide-react";

export default function CadastroOrganizadorPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const { usuario, autenticado, loading, atualizarUsuario } = useAuth();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    cnpj: "",
    telefone: "",
    biografia: ""
  });

  useEffect(() => {
    if (!loading && !autenticado) {
      router.push("/login");
    }
  }, [autenticado, loading, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const formAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!usuario?.id) {
      showToast("Não foi possível identificar o usuário autenticado.", "error");
      setIsSubmitting(false);
      return;
    }

    const response = await chamadaAPI(
      "/organizador/promover",
      "POST",
      {
        usuarioId: usuario.id,
        cnpj: formData.cnpj,
        telefone: formData.telefone,
        biografia: formData.biografia,
      }
    );

    if (!response) {
      showToast("Não foi possível realizar o cadastro com os dados informados.", "error");
      setIsSubmitting(false);
      return;
    }

    await atualizarUsuario();
    showToast("Você agora é um Organizador!", "success");
    router.push("/usuario/me");
    router.refresh();
  }

  if (loading) {
    return (
      <LayoutGeral voltarLink="/usuario/me">
        <div className="flex h-[60vh] items-center justify-center w-full">
          <span className="text-sm font-black text-emerald-600 animate-pulse uppercase tracking-[0.2em]">Carregando perfil...</span>
        </div>
      </LayoutGeral>
    );
  }

  const inputClass = "w-full border border-slate-200 rounded-2xl py-4 pr-4 pl-12 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-slate-50/50 text-sm font-bold text-slate-700 placeholder:text-slate-300";
  const labelClass = "text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 block mb-2";

  return (
    <LayoutGeral voltarLink="/usuario/me" scroll>
      <HeaderInterno 
        titulo="Perfil de Organizador"
        subtitulo="Preencha os dados da sua empresa para poder criar e gerenciar eventos na plataforma."
        iconeString="🏢"
      />

      <div className="p-8 lg:p-12 w-full max-w-4xl mx-auto flex flex-col lg:flex-row gap-12">
        
        <div className="w-full lg:w-1/3 flex flex-col gap-6">
          <div className="bg-emerald-600 text-white rounded-[2rem] p-8 shadow-xl shadow-emerald-200/50">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
              <ShieldCheck size={28} className="text-white" />
            </div>
            <h3 className="text-xl font-black mb-2 tracking-tight">Crie Eventos Incríveis</h3>
            <p className="text-sm text-emerald-50 font-medium leading-relaxed opacity-90">
              Ao se tornar um organizador validado, você terá acesso ao painel de controle completo para publicar ingressos, gerenciar pontos de venda e acompanhar suas métricas em tempo real.
            </p>
          </div>
        </div>

        <div className="w-full lg:w-2/3">
          <form onSubmit={formAction} className="flex flex-col gap-6 bg-white p-8 sm:p-10 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/30">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col relative">
                <label htmlFor="cnpj" className={labelClass}>CNPJ <span className="text-emerald-500">*</span></label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    name="cnpj"
                    id="cnpj"
                    value={formData.cnpj}
                    onChange={handleChange}
                    maxLength={14}
                    placeholder="Somente números"
                    className={inputClass}
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col relative">
                <label htmlFor="telefone" className={labelClass}>Telefone Comercial <span className="text-emerald-500">*</span></label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                  <input
                    type="tel"
                    name="telefone"
                    id="telefone"
                    value={formData.telefone}
                    onChange={handleChange}
                    minLength={10}
                    maxLength={11}
                    placeholder="(00) 00000-0000"
                    className={inputClass}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col relative mt-2">
              <label htmlFor="biografia" className={labelClass}>Biografia / Descrição da Empresa <span className="text-emerald-500">*</span></label>
              <div className="relative">
                <FileText className="absolute left-4 top-4 w-5 h-5 text-slate-400 pointer-events-none" />
                <textarea
                  name="biografia"
                  id="biografia"
                  rows={5}
                  value={formData.biografia}
                  onChange={handleChange}
                  placeholder="Fale um pouco sobre a sua produtora, tipo de eventos que organiza, história no mercado..."
                  className={`${inputClass} resize-none`}
                  required
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 mt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-5 rounded-2xl shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-70"
              >
                {isSubmitting ? (
                  <span className="animate-pulse tracking-widest uppercase text-xs">Processando...</span>
                ) : (
                  <>
                    <CheckCircle2 size={20} />
                    <span className="tracking-widest uppercase text-xs">Ativar Conta de Organizador</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

      </div>
    </LayoutGeral>
  );
}