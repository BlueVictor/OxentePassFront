'use client'

import { chamadaAPI } from "../../../../backend/chamadaPadrao";
import { criarImagem } from "../../../../backend/chamadasImagem";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Form from "@/app/_components/Form";
import { useToast } from "@/app/_components/ToastProvider";
import { useAuth } from "@/app/_components/Auth/AuthProvider";
import CategoriaSelector from "@/app/_components/Organizador/CategoriaSelector";
import PontoVendaSelector from "@/app/_components/Organizador/PontoVendaSelector";
import IngressoSelector from "@/app/_components/Organizador/IngressoSelector";
import ImagemSelector from "@/app/_components/Organizador/ImagemSelector";
import { LayoutGeral } from "@/app/_components/LayoutGeral";
import { HeaderInterno } from "@/app/_components/HeaderInterno";
import { MapPin, Calendar, Users, Phone, Info, CheckCircle2, Store, Ticket, ImageIcon } from "lucide-react";
import "../../../globals.css";

type Ingresso = {
  tipoIngresso: string,
  valorBase: number,
  quantidadeDisponivel: number,
  temMeiaEntrada: boolean
}

type Imagem = {
  id: number,
  S3: string,
  file: File,
  nome: string,
  capa: boolean
}

function formatarData(data: string): string {
  if (!data) return ""
  return data.replace("T", " ") + ":00"
}

export default function CriarEventoPage() {
  const { usuario } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  const [categorias, setCategorias] = useState<any[]>([]);
  const [cidades, setCidades] = useState<any[]>([]);
  const [pontoVendas, setPontoVendas] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    nome: "", descricao: "", tipo: "simples", cidade: '', cep: '', bairro: '', rua: '', numero: '',
    dataHoraInicio: '', dataHoraFim: '', classificacao: 'Livre', email: '', telefone: ''
  });

  const [tagSelecionadas, setTagSelecionadas] = useState<number[]>([]);
  const [tagNovas, setTagNovas] = useState<string[]>([]);
  const [pontoVendaSelecionados, setPontoVendaSelecionados] = useState<number[]>([]);
  const [ingressos, setIngressos] = useState<Ingresso[]>([]);
  const [imagens, setImagens] = useState<Imagem[]>([]);
  
  const inputClass = "w-full border border-slate-200 rounded-2xl p-4 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-slate-50/50";
  const labelClass = "text-sm font-bold text-slate-700 flex items-center gap-1 mb-2";
  const sectionTitleClass = "flex items-center gap-2 text-slate-400 border-b border-slate-100 pb-2 mb-6 mt-10 first:mt-0";

  const criarEvento = async () => {
    const data = {
      nome: formData.nome,
      descricao: formData.descricao,
      idOrganizador: usuario?.id,
      idCidade: formData.cidade,
      dataHoraInicio: formatarData(formData.dataHoraInicio),
      dataHoraFim: formatarData(formData.dataHoraFim),
      endereco: {
        cep: formData.cep,
        bairro: formData.bairro,
        rua: formData.rua,
        numero: formData.numero
      },
      classificacao: formData.classificacao,
      emailContato: formData.email,
      telefoneContato: formData.telefone
    }

    const evento = await chamadaAPI(
      `/evento/${formData.tipo}`, "POST", data, {
        returnMeta: true,
        silenciarErro: false,
      }
    )
    
    if (!evento.ok) {
      console.error("Falha na criação do evento")
      showToast(String(evento.data.mensagem), "error")
      return
    }

    tagSelecionadas.forEach(async tag => {
      await addCategExistente(evento.data.id, tag.toString())
    });

    tagNovas.forEach(async tag => {
      await addCategNova(evento.data.id, tag.toString())
    });

    pontoVendaSelecionados.forEach(async ponto => {
      await addPontoVenda(evento.data.id, ponto.toString())
    })

    ingressos.forEach(async ing => {
      await addIngresso(evento.data.id, ing)
    })

    imagens.forEach(async img => {
      await addImagem(evento.data.id, img)
    })

    showToast("Evento criado com sucesso!", "success")
    router.push("/organizador/evento") 
  }

  const addCategExistente = async (idEvento: string, categ: string) => {
    const response = await chamadaAPI(`/evento/${idEvento}/addTag/${categ}`, "PATCH", {}, { returnMeta: true, silenciarErro: false })
    if (!response.ok) showToast(String(response.data.mensagem), "error")
  }

  const addCategNova = async (idEvento: string, categ: string) => {
    const response = await chamadaAPI(`/evento/${idEvento}/addTag`, "PATCH", {tag: categ}, { returnMeta: true, silenciarErro: false })
    if (!response.ok) showToast(String(response.data.mensagem), "error")
  }

  const addPontoVenda = async (idEvento: string, ponto: string) => {
    const response = await chamadaAPI(`/evento/${idEvento}/addPontoVenda/${ponto}`, "PATCH", {}, { returnMeta: true, silenciarErro: false })
    if (!response.ok) showToast(String(response.data.mensagem), "error")
  }

  const addIngresso = async (idEvento: string, ingresso: Ingresso) => {
    const response = await chamadaAPI(`/evento/${idEvento}/addIngresso`, "PATCH", {
        tipoIngresso: ingresso.tipoIngresso,
        valorBase: ingresso.valorBase,
        quantidadeDisponivel: ingresso.quantidadeDisponivel,
        temMeiaEntrada: ingresso.temMeiaEntrada
      }, { returnMeta: true, silenciarErro: false })
    if (!response.ok) showToast(String(response.data.mensagem), "error")
  }

  const addImagem = async (idEvento: string, img: Imagem) => {
    const imgData = new FormData()
    imgData.append("file", img.file)
    const response = await criarImagem(idEvento, img.capa, imgData)
    if (!response.ok) showToast("Falha na adição das imagens", "error")
  }

  const getCategorias = async () => {
    const response = await chamadaAPI(`/tag`, "GET", {}, { returnMeta: true, silenciarErro: false })
    return response.ok ? response.data.content : []
  }

  async function getCidades () {
    const response = await chamadaAPI(`/cidade`, "GET", {}, { returnMeta: true, silenciarErro: false })
    return response.ok ? response.data.content : []
  }

  async function getPontoVendas () {
    const response = await chamadaAPI(`/pontovenda`, "GET", {}, { returnMeta: true, silenciarErro: false })
    return response.ok ? response.data.content : []
  }

  useEffect(() => {
    async function carregar() {
      const tags = await getCategorias();
      if (tags) setCategorias(tags);

      const cidadesResp = await getCidades();
      if (cidadesResp) {
        setCidades(cidadesResp);
        setFormData((prev) => ({ ...prev, cidade: cidadesResp[0]?.id || '' }));
      } 

      const pontos = await getPontoVendas();
      if (pontos) setPontoVendas(pontos);
    }
  
    carregar();
  }, []);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <LayoutGeral voltarLink="/organizador/evento" scroll>
      <HeaderInterno 
        titulo="Criar Novo Evento"
        subtitulo="Preencha os detalhes para publicar seu evento na plataforma"
        iconeString="🎉"
      />

      <div className="p-8 lg:p-12">
        <Form
          title=""
          action={criarEvento}
          buttons={
            <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-5 rounded-2xl shadow-lg shadow-emerald-200 transition-all active:scale-[0.98] mt-8 flex items-center justify-center gap-2">
              <CheckCircle2 size={20} />
              CRIAR EVENTO
            </button>
          }
        >
          <div className="flex flex-col">
            
            {/* Seção 1: Informações Gerais */}
            <div className={sectionTitleClass}>
              <Info size={18} />
              <h2 className="text-sm font-bold uppercase tracking-widest">Informações Gerais</h2>
            </div>
            
            <div className="flex flex-col mb-4">
              <label className={labelClass} htmlFor="nome">Nome do Evento <span className="text-red-500">*</span></label>
              <input type="text" name="nome" id="nome" value={formData.nome} onChange={handleChange} placeholder="Ex: Festival de Verão 2026" className={inputClass} required />
            </div>

            <div className="flex flex-col mb-6">
              <label className={labelClass} htmlFor="descricao">Descrição Completa <span className="text-red-500">*</span></label>
              <textarea name="descricao" id="descricao" value={formData.descricao} onChange={handleChange} rows={4} placeholder="Descreva os detalhes e atrações..." className={`${inputClass} resize-none`} required />
            </div>

            <div className="flex flex-col mb-4">
              <label className={labelClass}>Haverão sub-eventos vinculados?</label>
              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center gap-3 p-4 border border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-50 transition-all has-[:checked]:border-emerald-500 has-[:checked]:bg-emerald-50/50">
                  <input type="radio" name="tipo" value="simples" checked={formData.tipo === "simples"} onChange={handleChange} className="accent-emerald-600 w-4 h-4" />
                  <span className="text-sm font-bold text-slate-600">Não</span>
                </label>
                <label className="flex items-center gap-3 p-4 border border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-50 transition-all has-[:checked]:border-emerald-500 has-[:checked]:bg-emerald-50/50">
                  <input type="radio" name="tipo" value="composto" checked={formData.tipo === "composto"} onChange={handleChange} className="accent-emerald-600 w-4 h-4" />
                  <span className="text-sm font-bold text-slate-600">Sim</span>
                </label>
              </div>
            </div>

            {/* Seção 2: Localização */}
            <div className={sectionTitleClass}>
              <MapPin size={18} />
              <h2 className="text-sm font-bold uppercase tracking-widest">Localização</h2>
            </div>
            
            <div className="flex flex-col mb-6">
              <label className={labelClass} htmlFor="cidade">Cidade</label>
              <select name="cidade" id="cidade" value={formData.cidade} onChange={handleChange} className={inputClass} required>
                {cidades.map((item: any) => (
                  <option key={item.id} value={item.id}>{item.nome}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div className="flex flex-col">
                <label className={labelClass} htmlFor="cep">CEP</label>
                <input type="number" name="cep" id="cep" value={formData.cep} onChange={handleChange} placeholder="00000000" className={inputClass} required />
              </div>
              <div className="flex flex-col">
                <label className={labelClass} htmlFor="bairro">Bairro</label>
                <input type="text" name="bairro" id="bairro" value={formData.bairro} onChange={handleChange} className={inputClass} required />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
              <div className="flex flex-col md:col-span-2">
                <label className={labelClass} htmlFor="rua">Rua</label>
                <input type="text" name="rua" id="rua" value={formData.rua} onChange={handleChange} className={inputClass} required />
              </div>
              <div className="flex flex-col md:col-span-1">
                <label className={labelClass} htmlFor="numero">Número</label>
                <input type="text" name="numero" id="numero" value={formData.numero} onChange={handleChange} className={inputClass} required />
              </div>
            </div>

            {/* Seção 3: Programação */}
            <div className={sectionTitleClass}>
              <Calendar size={18} />
              <h2 className="text-sm font-bold uppercase tracking-widest">Data e Classificação</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="flex flex-col">
                <label className={labelClass} htmlFor="dataHoraInicio">Início do Evento</label>
                <input type="datetime-local" name="dataHoraInicio" id="dataHoraInicio" value={formData.dataHoraInicio} onChange={handleChange} className={inputClass} required />
              </div>
              <div className="flex flex-col">
                <label className={labelClass} htmlFor="dataHoraFim">Fim do Evento</label>
                <input type="datetime-local" name="dataHoraFim" id="dataHoraFim" value={formData.dataHoraFim} onChange={handleChange} className={inputClass} required />
              </div>
            </div>

            <div className="flex flex-col mb-4">
              <label className={labelClass} htmlFor="classificacao">Classificação Indicativa</label>
              <select name="classificacao" id="classificacao" value={formData.classificacao} onChange={handleChange} className={inputClass}>
                {["Livre", "10 Anos", "12 Anos", "14 Anos", "16 Anos", "18 Anos"].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Seção 4: Contato */}
            <div className={sectionTitleClass}>
              <Phone size={18} />
              <h2 className="text-sm font-bold uppercase tracking-widest">Contato</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="flex flex-col">
                <label className={labelClass} htmlFor="email">E-mail</label>
                <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className={inputClass} />
              </div>
              <div className="flex flex-col">
                <label className={labelClass} htmlFor="telefone">Telefone</label>
                <input type="tel" name="telefone" id="telefone" value={formData.telefone} onChange={handleChange} className={inputClass} />
              </div>
            </div>

            {/* Seção 5: Configurações Extras (Imagens, Ingressos, Tags, Pontos) */}
            <div className={sectionTitleClass}>
              <ImageIcon size={18} />
              <h2 className="text-sm font-bold uppercase tracking-widest">Mídia</h2>
            </div>
            <div className="mb-8">
              <ImagemSelector imagens={imagens} setImagens={setImagens} />
            </div>

            <div className={sectionTitleClass}>
              <Ticket size={18} />
              <h2 className="text-sm font-bold uppercase tracking-widest">Ingressos</h2>
            </div>
            <div className="mb-8">
              <IngressoSelector ingressos={ingressos} setIngressos={setIngressos} />
            </div>

            <div className={sectionTitleClass}>
              <Users size={18} />
              <h2 className="text-sm font-bold uppercase tracking-widest">Categorias</h2>
            </div>
            <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100 mb-8">
              <CategoriaSelector 
                tagsExistentes={categorias}
                selecionadas={tagSelecionadas}
                setSelecionadas={setTagSelecionadas}
                novas={tagNovas}
                setNovas={setTagNovas}
              />
            </div>

            <div className={sectionTitleClass}>
              <Store size={18} />
              <h2 className="text-sm font-bold uppercase tracking-widest">Pontos de Venda</h2>
            </div>
            <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100 mb-4">
              <PontoVendaSelector
                pontoVendaExistentes={pontoVendas}
                selecionados={pontoVendaSelecionados}
                setSelecionados={setPontoVendaSelecionados}
              />
            </div>

          </div>
        </Form>
      </div>
    </LayoutGeral>
  );
}