'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { chamadaAPI } from "../../../../backend/chamadaPadrao";
import { useToast } from "@/app/_components/ToastProvider";
import { LayoutGeral } from "@/app/_components/LayoutGeral";
import { HeaderInterno } from "@/app/_components/HeaderInterno";
import CategoriaSelector from "@/app/_components/Organizador/CategoriaSelector";
import { MapPin, AlignLeft, CheckCircle2 } from "lucide-react";

export default function CriarCidade() {
  const router = useRouter();
  const { showToast } = useToast();
  const [categorias, setCategorias] = useState<any[]>([]);
  const [formData, setFormData] = useState({ nome: "", descricao: "" });
  const [selecionadas, setSelecionadas] = useState<number[]>([]);
  const [novas, setNovas] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const criarCidade = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Criação da cidade
    const data = {
      nome: formData.nome,
      descricao: formData.descricao
    };

    const cidade = await chamadaAPI("/cidade", "POST", data, {
      returnMeta: true,
      silenciarErro: false,
    });

    if (!cidade.ok) {
      showToast(String(cidade.data?.mensagem || "Ocorreu um erro ao criar a cidade"), "error");
      setIsSubmitting(false);
      return;
    }

    const promises = [
      ...selecionadas.map(tag => addCategExistente(cidade.data.id, tag.toString())),
      ...novas.map(tag => addCategNova(cidade.data.id, tag.toString()))
    ];

    await Promise.all(promises);

    showToast("Cidade criada com sucesso!", "success");
    router.push("/organizador/cidade");
  };

  const getCategorias = async () => {
    const response = await chamadaAPI("/tag", "GET", {}, { returnMeta: true });
    return response.ok ? response.data.content : [];
  };

  // Adição de categorias
  const addCategExistente = (idCidade: string, categ: string) => 
    chamadaAPI(`/cidade/${idCidade}/addTag/${categ}`, "PATCH");

  const addCategNova = (idCidade: string, categ: string) => 
    chamadaAPI(`/cidade/${idCidade}/addTag`, "PATCH", { tag: categ });

  useEffect(() => {
    async function carregar() {
      const data = await getCategorias();
      setCategorias(data);
    }
    carregar();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <LayoutGeral voltarLink="/organizador/cidade">
      <HeaderInterno 
        titulo="Cadastrar Nova Cidade"
        subtitulo="Adicione novos destinos e gerencie suas categorias de interesse"
        iconeString="🏙️"
      />

      <form onSubmit={criarCidade} className="p-8 lg:p-12 space-y-10">
        {/* Seção: Informações Básicas */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 text-slate-400 border-b border-slate-100 pb-2 mb-6">
            <MapPin size={18} />
            <h2 className="text-sm font-bold uppercase tracking-widest">Informações Geográficas</h2>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="nome" className="text-sm font-bold text-slate-700 flex items-center gap-1">
                Nome da Cidade <span className="text-emerald-500">*</span>
              </label>
              <input 
                type="text" 
                name="nome" 
                id="nome" 
                value={formData.nome}
                onChange={handleChange}
                placeholder="Ex: Rio de Janeiro" 
                className="w-full border border-slate-200 rounded-2xl p-4 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-slate-50/50"
                required 
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="descricao" className="text-sm font-bold text-slate-700 flex items-center gap-1">
                Descrição <span className="text-emerald-500">*</span>
              </label>
              <textarea 
                name="descricao" 
                id="descricao" 
                value={formData.descricao}
                onChange={handleChange}
                rows={4} 
                placeholder="Conte um pouco sobre as atrações e o perfil desta cidade..."
                className="w-full border border-slate-200 rounded-2xl p-4 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-slate-50/50 resize-none"
                required 
              />
            </div>
          </div>
        </section>

        {/* Seção: Categorias */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 text-slate-400 border-b border-slate-100 pb-2 mb-6">
            <AlignLeft size={18} />
            <h2 className="text-sm font-bold uppercase tracking-widest">Tags e Segmentação</h2>
          </div>
          
          <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
            <CategoriaSelector 
              tagsExistentes={categorias}
              selecionadas={selecionadas}
              setSelecionadas={setSelecionadas}
              novas={novas}
              setNovas={setNovas}
            />
          </div>
        </section>

        {/* Botão de Ação */}
        <div className="pt-6 border-t border-slate-100">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-5 rounded-2xl shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-70"
          >
            {isSubmitting ? (
              <span className="animate-pulse">Processando...</span>
            ) : (
              <>
                <CheckCircle2 size={20} />
                REGISTRAR CIDADE
              </>
            )}
          </button>
        </div>
      </form>
    </LayoutGeral>
  );
}