'use client'
import { chamadaAPI } from "../../../../../backend/chamadaPadrao";
import { criarImagem } from "../../../../../backend/chamadasImagem";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { useToast } from "@/app/_components/ToastProvider";
import { useAuth } from "@/app/_components/Auth/AuthProvider";
import CategoriaSelector from "@/app/_components/Organizador/CategoriaSelector";
import PontoVendaSelector from "@/app/_components/Organizador/PontoVendaSelector";
import IngressoSelector from "@/app/_components/Organizador/IngressoSelector";
import ImagemSelector from "@/app/_components/Organizador/ImagemSelector";
import { LayoutGeral } from "@/app/_components/LayoutGeral";
import { HeaderInterno } from "@/app/_components/HeaderInterno";
import { MapPin, Calendar, Users, Phone, Info, CheckCircle2, Ticket, Image as ImageIcon, Store } from "lucide-react";
import "../../../../globals.css";

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

const formatarDataInput = (data: string) => {
  return data.slice(0, 16)
}

export default function editar (props: any) {
  const { usuario } = useAuth();
  const { showToast } = useToast();
  const [idEvento, setIdEvento] = useState<any>();                      //id da URL
  const [evento, setEvento] = useState<any>();                          //evento
  const [imgEvento, setImgEvento] = useState<any[]>([]);                //todas as imagens do evento
  const [categorias, setCategorias] = useState<any[]>([]);              //todas as categorias
  const [cidades, setCidades] = useState<any[]>([]);                    //todas as cidades
  const [pontoVendas, setPontoVendas] = useState<any[]>([]);            //todos os pontos de venda
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    cidade: '',
    cep: '',
    bairro: '',
    rua: '',
    numero: '',
    dataHoraInicio: '',
    dataHoraFim: '',
    classificacao: '',
    email: '',
    telefone: ''
  });
  const [tagSelecionadas, setTagSelecionadas] = useState<number[]>([]);               //categorias pós-modificação
  const [tagNovas, setTagNovas] = useState<string[]>([]);                              //categorias novas (criadas no input de texto)
  const [pontoVendaSelecionados, setPontoVendaSelecionados] = useState<number[]>([]); //ponto-venda pós-modificação
  const [ingressos, setIngressos] = useState<Ingresso[]>([]);                         //ingressos inseridos
  const [imagens, setImagens] = useState<Imagem[]>([]);                               //imagens inseridas
  
  const editarEvento = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Edição do evento
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

    const eventoResponse = await chamadaAPI(
      `/evento/${idEvento}`, "PUT", data, {
        returnMeta: true,
        silenciarErro: false,
      }
    )
    
    if (!eventoResponse.ok) {
      console.error("Falha na edição do evento")
      showToast(String(eventoResponse.data.mensagem), "error")
      setIsSubmitting(false);
      return
    }

    // Adição e remoção de categorias
    tagSelecionadas.forEach(async tag => {
      if (!evento.tags.map((t: any) => Number(t.id)).includes(Number(tag))) {
        await addCategExistente(evento.id, tag.toString())
      }
    });

    evento.tags.forEach(async (tagEvento: any) => {
      if (!tagSelecionadas.includes(Number(tagEvento.id))) {
        await delCategExistente(evento.id, tagEvento.id.toString())
      }
    });

    tagNovas.forEach(async tag => {
      await addCategNova(evento.id, tag.toString())
    });

    // Adição e remoção de pontos de venda
    pontoVendaSelecionados.forEach(async ponto => {
      if (!evento.pontosVenda.map((p: any) => Number(p.id)).includes(Number(ponto))) {
        await addPontoVenda(evento.id, ponto.toString())
      }
    })

    evento.pontosVenda.map((p: any) => Number(p.id)).forEach(async (ponto: any) => {
      if (!pontoVendaSelecionados.includes(Number(ponto))) {
        await delPontoVenda(evento.id, ponto.toString())
      }
    })

    // Adição e remoção de ingressos
    ingressos.forEach(async ing => {
      if (!("id" in ing) && !evento.ingressos.map((i: any) => i.tipo).includes(ing.tipoIngresso)) {
        await addIngresso(evento.id, ing)
      }
    })

    evento.ingressos.forEach(async (ing: any) => {
      if (!ingressos.map((i: Ingresso) => i.tipoIngresso).includes(ing.tipo)) {
        await delIngresso(evento.id, ing.id.toString())
      }
    })

    // Adição e remoção de imagens
    imagens.forEach(async img => {
      if (img.id == null && img.S3 == null) {
        await addImagem(evento.id, img)
      }
    })

    imgEvento.forEach(async (img: any) => {
      if(!imagens.filter((i: Imagem) => i.id != null).map((i: Imagem) => Number(i.id)).includes(img.id)){
        await delImagem(evento.id, img.id.toString())
      }
    })

    showToast("Evento editado com sucesso!", "success")
    redirect ("/organizador/evento") 
  }

  const addCategExistente = async (idEvento: string, categ: string) => {
    const response = await chamadaAPI(
      `/evento/${idEvento}/addTag/${categ}`, "PATCH", {}, {
        returnMeta: true,
        silenciarErro: false,
      }
    )
      
    if (!response.ok) {
      console.error("Falha na adição da categoria " + categ)
      showToast(String(response.data.mensagem), "error")
      return
    }
  }

  const addCategNova = async (idEvento: string, categ: string) => {
    const response = await chamadaAPI(
      `/evento/${idEvento}/addTag`, "PATCH", {tag: categ}, {
        returnMeta: true,
        silenciarErro: false,
      }
    )
    
    if (!response.ok) {
      console.error("Falha na adição da categoria " + categ)
      showToast(String(response.data.mensagem), "error")
      return
    }
  }

  const delCategExistente = async (idEvento: string, categ: string) => {
    const response = await chamadaAPI(
      `/evento/${idEvento}/removerTag/${categ}`, "PATCH", {}, {
        returnMeta: true,
        silenciarErro: false,
      }
    )
      
    if (!response.ok) {
      console.error("Falha na remoção da categoria " + categ)
      showToast(String(response.data.mensagem), "error")
      return
    }
  }

  const addPontoVenda = async (idEvento: string, ponto: string) => {
    const response = await chamadaAPI(
      `/evento/${idEvento}/addPontoVenda/${ponto}`, "PATCH", {}, {
        returnMeta: true,
        silenciarErro: false,
      }
    )
      
    if (!response.ok) {
      console.error("Falha na adição dos pontos de venda")
      showToast(String(response.data.mensagem), "error")
      return
    }
  }

  const delPontoVenda = async (idEvento: string, ponto: string) => {
    const response = await chamadaAPI(
      `/evento/${idEvento}/removerPontoVenda/${ponto}`, "PATCH", {}, {
        returnMeta: true,
        silenciarErro: false,
      }
    )
      
    if (!response.ok) {
      console.error("Falha na remoção dos pontos de venda")
      showToast(String(response.data.mensagem), "error")
      return
    }
  }

  const addIngresso = async (idEvento: string, ingresso: Ingresso) => {
    const response = await chamadaAPI(
      `/evento/${idEvento}/addIngresso`, "PATCH", {
        tipoIngresso: ingresso.tipoIngresso,
        valorBase: ingresso.valorBase,
        quantidadeDisponivel: ingresso.quantidadeDisponivel,
        temMeiaEntrada: ingresso.temMeiaEntrada
      }, {
        returnMeta: true,
        silenciarErro: false,
      }
    )
      
    if (!response.ok) {
      console.error("Falha na adição dos ingressos")
      showToast(String(response.data.mensagem), "error")
      return
    }
  }

  const delIngresso = async (idEvento: string, idIngresso: string) => {
    const response = await chamadaAPI(
      `/evento/${idEvento}/removerIngresso/${idIngresso}`, "PATCH", {}, {
        returnMeta: true,
        silenciarErro: false,
      }
    )
      
    if (!response.ok) {
      console.error("Falha na remoção dos ingressos")
      showToast(String(response.data.mensagem), "error")
      return
    }
  }

  const addImagem = async (idEvento: string, img: Imagem) => {
    const imgData = new FormData()
    imgData.append("file", img.file)

    const response = await criarImagem(idEvento, img.capa, imgData)
      
    if (!response.ok) {
      console.error("Falha na adição das imagens")
      showToast("Falha na adição das imagens", "error")
      return
    }
  }

  const delImagem = async (idEvento: string, idImagem: string) => {
    const response = await chamadaAPI(
      `/evento/${idEvento}/imagens/${idImagem}`, "DELETE", {}, {
        returnMeta: true,
        silenciarErro: false,
      }
    )
      
    if (!response.ok) {
      console.error("Falha na remoção das imagens")
      showToast("Falha na remoção das imagens", "error")
      return
    }
  }

  const getEvento = async (id: any) => {
    const response = await chamadaAPI(
      `/evento/filtro?id=${id}`, "GET", {}, {
        returnMeta: true,
        silenciarErro: false,
      }
    )

    if (!response.ok) {
      console.error("Falha na obtenção do evento")
      showToast(String(response.data.mensagem), "error")
      return
    }
        
    return response.data.content[0]
  }

  const getCategorias = async () => {
    const response = await chamadaAPI(
    `/tag`, "GET", {}, {
        returnMeta: true,
        silenciarErro: false,
      }
    )
      
    if (!response.ok) {
      console.error("Falha na obtenção das categorias")
      showToast(String(response.data.mensagem), "error")
      return
    }
        
    return response.data.content
  }

  async function getCidades () {
    const response = await chamadaAPI(
    `/cidade`, "GET", {}, {
        returnMeta: true,
        silenciarErro: false,
      }
    )
      
    if (!response.ok) {
      console.error("Falha na obtenção das cidades")
      showToast(String(response.data.mensagem), "error")
      return
    }
        
    return response.data.content
  }

  async function getPontoVendas () {
    const response = await chamadaAPI(
    `/pontovenda`, "GET", {}, {
        returnMeta: true,
        silenciarErro: false,
      }
    )
      
    if (!response.ok) {
      console.error("Falha na obtenção dos pontos de venda")
      showToast(String(response.data.mensagem), "error")
      return
    }
        
    return response.data.content
  }

  async function getImagensEvento (idEvento: string) {
    const response = await chamadaAPI(
      `/evento/${idEvento}/imagens`,
      "GET"
    )

    if (!response) {
      console.error("Falha no carregamento das imagens")
      return []
    }

    return response.content
  }

  useEffect(() => {
    async function carregar() {
      // Carregando itens
      const id = (await props.params).id
      if (id) setIdEvento(id);

      const eventoBusca = await getEvento(id);
      if (eventoBusca) setEvento(eventoBusca);

      const tags = await getCategorias();
      if (tags) setCategorias(tags);

      const cidades = await getCidades();
      if (cidades) setCidades(cidades);

      const pontoVendas = await getPontoVendas();
      if (pontoVendas) setPontoVendas(pontoVendas);

      const imgsEvento = await getImagensEvento(id);
      if (imgsEvento) setImgEvento(imgsEvento);

      // Settando states
      if (eventoBusca) {
        setFormData({
          nome: eventoBusca.nome,
          descricao: eventoBusca.descricao,
          cidade: eventoBusca.cidade.id,
          cep: eventoBusca.endereco.cep,
          bairro: eventoBusca.endereco.bairro,
          rua: eventoBusca.endereco.rua,
          numero: eventoBusca.endereco.numero,
          dataHoraInicio: formatarDataInput(eventoBusca.dataHoraInicio),
          dataHoraFim: formatarDataInput(eventoBusca.dataHoraFim),
          classificacao: eventoBusca.classificacao,
          email: eventoBusca.emailContato,
          telefone: eventoBusca.telefoneContato
        })

        if (eventoBusca.tags.length > 0){
          setTagSelecionadas(eventoBusca.tags.map((tag: any) => tag.id)) 
        }

        if (eventoBusca.ingressos.length > 0) {
          setIngressos(eventoBusca.ingressos.map((ing: any) => {
            return {
              tipoIngresso: ing.tipo,
              valorBase: ing.valorBase,
              quantidadeDisponivel: ing.quantidadeDisponivel,
              temMeiaEntrada: ing.temMeiaEntrada
            };
          }))
        }

        if (eventoBusca.pontosVenda.length > 0) {
          setPontoVendaSelecionados(eventoBusca.pontosVenda.map((ponto: any) => ponto.id))
        }

        if (imgsEvento.length > 0) {
          setImagens(imgsEvento.map((img: any) => {
            return {
              id: img.id,
              S3: img.chaveS3,
              file: null as unknown as File,
              nome: img.nome,
              capa: img.ehCapa
            };
          }))
        }
      }
    }
  
    carregar();
  }, []);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) => {
    const { name, value } = e.target;
  
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const inputClass = "w-full border border-slate-200 rounded-2xl p-4 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-slate-50/50 font-semibold text-sm text-slate-700";
  const labelClass = "text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 block mb-2";
  const sectionTitleClass = "flex items-center gap-2 text-slate-400 border-b border-slate-100 pb-2 mb-6 mt-10 first:mt-0";

  return (
    <LayoutGeral voltarLink="/organizador/evento" scroll>
      <HeaderInterno 
        titulo="Editar Evento"
        subtitulo="Atualize as informações, ingressos e mídias do seu evento"
        iconeString="📝"
      />

      <div className="p-8 lg:p-12">
        <form onSubmit={editarEvento}>
          <div className="flex flex-col">
            
            {/* Seção 1: Informações Gerais */}
            <div className={sectionTitleClass}>
              <Info size={18} />
              <h2 className="text-sm font-bold uppercase tracking-widest">Informações Gerais</h2>
            </div>
            
            <div className="flex flex-col mb-4">
              <label className={labelClass} htmlFor="nome">Nome do Evento <span className="text-emerald-500">*</span></label>
              <input 
                type="text" 
                name="nome" 
                id="nome"
                value={formData.nome}
                onChange={handleChange}
                placeholder="Ex: Festival de Verão" 
                className={inputClass}
                required 
              />
            </div>

            <div className="flex flex-col mb-6">
              <label className={labelClass} htmlFor="descricao">Descrição Completa <span className="text-emerald-500">*</span></label>
              <textarea 
                name="descricao" 
                id="descricao" 
                rows={4} 
                value={formData.descricao}
                onChange={handleChange}
                className={`${inputClass} resize-none`}
                required 
              />
            </div>
            
            {/* Seção 2: Localização */}
            <div className={sectionTitleClass}>
              <MapPin size={18} />
              <h2 className="text-sm font-bold uppercase tracking-widest">Localização</h2>
            </div>

            <div className="flex flex-col gap-6 mb-6">
              <div className="flex flex-col">
                <label className={labelClass} htmlFor="cidade">Cidade</label>
                <select 
                  name="cidade" 
                  id="cidade"
                  value={formData.cidade}
                  onChange={handleChange}
                  className={inputClass}
                  required
                >
                  {cidades.map((item: any) => (
                    <option key={item.id} value={item.id}>{item.nome}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <label className={labelClass} htmlFor="cep">CEP</label>
                  <input 
                    type="number" 
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
                  <label className={labelClass} htmlFor="bairro">Bairro</label>
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
                  <label className={labelClass} htmlFor="rua">Rua</label>
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
                  <label className={labelClass} htmlFor="numero">Número</label>
                  <input 
                    type="text" 
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
            
            {/* Seção 3: Programação */}
            <div className={sectionTitleClass}>
              <Calendar size={18} />
              <h2 className="text-sm font-bold uppercase tracking-widest">Data e Classificação</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="flex flex-col">
                <label className={labelClass} htmlFor="dataHoraInicio">Início do evento</label>
                <input 
                  type="datetime-local" 
                  name="dataHoraInicio" 
                  id="dataHoraInicio"
                  value={formData.dataHoraInicio}
                  onChange={handleChange}
                  className={inputClass}
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className={labelClass} htmlFor="dataHoraFim">Fim do evento</label>
                <input 
                  type="datetime-local" 
                  name="dataHoraFim" 
                  id="dataHoraFim" 
                  value={formData.dataHoraFim}
                  onChange={handleChange}
                  className={inputClass}
                  required
                />
              </div>
            </div>

            <div className="flex flex-col mb-4">
              <label className={labelClass} htmlFor="classificacao">Classificação indicativa</label>
              <select 
                name="classificacao" 
                id="classificacao"
                value={formData.classificacao}
                onChange={handleChange}
                className={inputClass}
              >
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
                <input 
                  type="email" 
                  name="email" 
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col">
                <label className={labelClass} htmlFor="telefone">Telefone</label>
                <input 
                  type="tel" 
                  name="telefone" 
                  id="telefone"
                  value={formData.telefone}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Seção 5: Mídias, Ingressos, Categorias e Pontos */}
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

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-5 rounded-2xl shadow-lg shadow-emerald-200 transition-all active:scale-[0.98] disabled:opacity-70 mt-8 flex items-center justify-center gap-3 uppercase tracking-widest text-[12px]"
            >
              {isSubmitting ? (
                <span className="animate-pulse">Salvando Alterações...</span>
              ) : (
                <>
                  <CheckCircle2 size={20} />
                  Salvar Alterações do Evento
                </>
              )}
            </button>

          </div>
        </form>
      </div>
    </LayoutGeral>
  );
}