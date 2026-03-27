'use client'
import { chamadaAPI } from "../../../../../backend/chamadaPadrao";
import { redirect, useRouter } from "next/navigation";
import CategoriaSelector from "@/app/_components/Organizador/CategoriaSelector";
import { useEffect, useState } from "react";
import { useToast } from "@/app/_components/ToastProvider";
import { LayoutGeral } from "@/app/_components/LayoutGeral";
import { HeaderInterno } from "@/app/_components/HeaderInterno";
import { MapPin, AlignLeft, CheckCircle2 } from "lucide-react";
import "../../../../globals.css";

export default function EditarCidade(props: any) {
  const { showToast } = useToast();
  const router = useRouter();
  
  const [idCidade, setIdCidade] = useState<any>();
  const [categorias, setCategorias] = useState<any[]>([]);        
  const [cidadeCateg, setCidadeCateg] = useState<any[]>([]);      
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    nome: "",
    descricao: ""
  });
  const [selecionadas, setSelecionadas] = useState<number[]>([]); 
  const [novas, setNovas] = useState<string[]>([]);               

  const editarCidade = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data = {
      nome: formData.nome,
      descricao: formData.descricao
    }

    const cidade = await chamadaAPI(
      `/cidade/${idCidade}`, "PUT", data, { returnMeta: true, silenciarErro: false }
    )
    
    if (!cidade.ok) {
      console.error("Falha na edição de cidade")
      showToast(String(cidade.data.mensagem), "error")
      setIsSubmitting(false);
      return
    }

    try {
      // ARRAY TIPADO PARA RESOLVER O ERRO DO TYPESCRIPT E SALVAR CORRETAMENTE
      const promises: Promise<any>[] = [];

      selecionadas.forEach(tag => {
        if (!cidadeCateg.includes(Number(tag))) {
          promises.push(chamadaAPI(`/cidade/${idCidade}/addTag/${tag}`, "PATCH", {}, { returnMeta: true, silenciarErro: false }));
        }
      });

      cidadeCateg.forEach(tagCidade => {
        if (!selecionadas.includes(Number(tagCidade))) {
          promises.push(chamadaAPI(`/cidade/${idCidade}/removerTag/${tagCidade}`, "PATCH", {}, { returnMeta: true, silenciarErro: false }));
        }
      });

      novas.forEach(tag => {
        promises.push(chamadaAPI(`/cidade/${idCidade}/addTag`, "PATCH", { tag: tag }, { returnMeta: true, silenciarErro: false }));
      });

      // Aguarda TODAS as atualizações de categorias finalizarem
      await Promise.all(promises);

      showToast("Cidade atualizada com sucesso!", "success")
      router.push("/organizador/cidade") 
    } catch (error) {
      console.error("Erro ao salvar categorias", error);
      showToast("Ocorreu um erro ao vincular as categorias.", "error");
      setIsSubmitting(false);
    }
  }

  const getCidade = async (id: any) => {
    const response = await chamadaAPI(`/cidade/filtro?id=${id}`, "GET", {}, { returnMeta: true, silenciarErro: false })
    if (!response.ok) {
      showToast(String(response.data.mensagem), "error")
      return null
    }
    return response.data.content[0]
  }

  const getCategorias = async () => {
    const response = await chamadaAPI(`/tag`, "GET", {}, { returnMeta: true, silenciarErro: false })
    if (!response.ok) return []
    return response.data.content
  }

  useEffect(() => {
    async function carregar() {
      const id = (await props.params).id
      if (id) setIdCidade(id);

      const cidade = await getCidade(id)
      if(cidade) {
        setFormData({nome: cidade.nome, descricao: cidade.descricao})
        setSelecionadas(cidade.tags.map((tag: any) => tag.id))
        setCidadeCateg(cidade.tags.map((tag: any) => tag.id))
      } 

      const tags = await getCategorias();
      if (tags) setCategorias(tags);
    }
    carregar();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <LayoutGeral voltarLink="/organizador/cidade">
      <HeaderInterno 
        titulo="Editar Cidade"
        subtitulo="Modifique as informações e categorias deste destino"
        iconeString="🏙️"
      />

      <form onSubmit={editarCidade} className="p-8 lg:p-12 space-y-10">
        
        {/* Seção: Informações Básicas */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 text-slate-400 border-b border-slate-100 pb-2 mb-6">
            <MapPin size={18} />
            <h2 className="text-sm font-bold uppercase tracking-widest">Informações Geográficas</h2>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="nome" className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 block mb-1">
                Nome da Cidade <span className="text-emerald-500">*</span>
              </label>
              <input 
                type="text" 
                name="nome" 
                id="nome" 
                value={formData.nome}
                onChange={handleChange}
                placeholder="Ex: Rio de Janeiro" 
                className="w-full border border-slate-200 rounded-2xl p-4 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-slate-50/50 font-semibold text-sm text-slate-700"
                required 
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="descricao" className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 block mb-1">
                Descrição <span className="text-emerald-500">*</span>
              </label>
              <textarea 
                name="descricao" 
                id="descricao" 
                value={formData.descricao}
                onChange={handleChange}
                rows={4} 
                placeholder="Conte um pouco sobre a cidade..."
                className="w-full border border-slate-200 rounded-2xl p-4 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-slate-50/50 resize-none font-semibold text-sm text-slate-700"
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
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-5 rounded-2xl shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-70 uppercase tracking-widest text-[12px] cursor-pointer disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="animate-pulse">Salvando Alterações...</span>
            ) : (
              <>
                <CheckCircle2 size={20} />
                Salvar Alterações
              </>
            )}
          </button>
        </div>
      </form>
    </LayoutGeral>
  );
}