'use client'
import { chamadaAPI } from "../../../../../backend/chamadaPadrao";
import { criarImagem } from "../../../../../backend/chamadasImagem";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import Form from "@/app/_components/Form";
import { useToast } from "@/app/_components/ToastProvider";
import { useAuth } from "@/app/_components/Auth/AuthProvider";
import CategoriaSelector from "@/app/_components/Organizador/CategoriaSelector";
import PontoVendaSelector from "@/app/_components/Organizador/PontoVendaSelector";
import IngressoSelector from "@/app/_components/Organizador/IngressoSelector";
import ImagemSelector from "@/app/_components/Organizador/ImagemSelector";
import "../../../../globals.css";
import "../../criar/page.css"

type Ingresso = {
  tipoIngresso: string,
  valorBase: number,
  quantidadeDisponivel: number,
  temMeiaEntrada: boolean
}

type Imagem = {
  file: File,
  capa: boolean
}

function formatarData(data: string): string {
  if (!data) return ""

  return data.replace("T", " ") + ":00"
}

const formatarDataInput = (data: string) => {
  return data.slice(0, 16)
}

export default function criar (props: any) {
  const { usuario } = useAuth();
  const { showToast } = useToast();
  const [idEventoPai, setIdEventoPai] = useState<any>();      //id da URL
  const [eventoPai, setEventoPai] = useState<any>();          //evento Pai
  const [categorias, setCategorias] = useState<any[]>([]);		//todas as categorias
  const [cidades, setCidades] = useState<any[]>([]);				  //todas as cidades
  const [pontoVendas, setPontoVendas] = useState<any[]>([]);  //todos os pontos de venda
  
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    tipo: "Simples",
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
  const [tagNovas, setTagNovas] = useState<string[]>([]);								              //categorias novas (criadas no input de texto)
  const [pontoVendaSelecionados, setPontoVendaSelecionados] = useState<number[]>([]); //ponto-venda pós-modificação
  const [ingressos, setIngressos] = useState<Ingresso[]>([]);                         //ingressos inseridos
  const [imagens, setImagens] = useState<Imagem[]>([]);                               //imagens inseridas
  
  const criarSubEvento = async () => {
    // Criação do subevento
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

    const subevento = await chamadaAPI(
      `/evento/${idEventoPai}/addSubevento${formData.tipo}`, "PATCH", data, {
        returnMeta: true,
        silenciarErro: false,
      }
    )
    
    if (!subevento.ok) {
      console.error("Falha na criação do evento")
      showToast(String(subevento.data.mensagem), "error")
      return
    }

    // Adição de categorias
    tagSelecionadas.forEach(async tag => {
      await addCategExistente(subevento.data.id, tag.toString())
    });

    tagNovas.forEach(async tag => {
      await addCategNova(subevento.data.id, tag.toString())
    });

    // Adição de pontos de venda
    pontoVendaSelecionados.forEach(async ponto => {
      await addPontoVenda(subevento.data.id, ponto.toString())
    })

    // Adição de ingressos
    ingressos.forEach(async ing => {
      await addIngresso(subevento.data.id, ing)
    })

    // Adição de imagens
    imagens.forEach(async img => {
      await addImagem(subevento.data.id, img)
    })

    showToast("Sub-Evento criado!", "success")
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

  const getEventoPai = async (id: any) => {
    const response = await chamadaAPI(
      `/evento/filtro?id=${id}`, "GET", {}, {
        returnMeta: true,
        silenciarErro: false,
      }
    )

    if (!response.ok) {
      console.error("Falha na obtenção do evento pai")
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

  const getCidades = async () => {
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

  const getPontoVendas = async () => {
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

  useEffect(() => {
    async function carregar() {
      const id = (await props.params).id
      if (id) setIdEventoPai(id);

      const eventoPai = await getEventoPai(id);
      if (eventoPai) setEventoPai(eventoPai);

      const tags = await getCategorias();
      if (tags) setCategorias(tags);

      const cidades = await getCidades();
      if (cidades) {
        setCidades(cidades);

        setFormData((prev) => ({
          ...prev,
          cidade: cidades[0].id
        }));
      } 

      const pontoVendas = await getPontoVendas();
      if (pontoVendas) setPontoVendas(pontoVendas);
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

  return (
    <div className="flex flex-row justify-center">
      <main className="w-3/5">
        <Form
          title="Criar Sub-Evento"
          action={criarSubEvento}
          buttons={
            <>
              <button type="submit" className="botao-primario">Criar Sub-Evento</button>
            </>
          }
        >
          <div className="flex flex-col gap-2">
            <label htmlFor="nome">Nome <b className="text-red-500">*</b></label>
            <input 
              type="text" 
              name="nome" 
              id="nome"
              value={formData.nome}
              onChange={handleChange}
              placeholder="Nome" 
              className="border border-slate-200 rounded-xl p-2 mb-1.5"
              required 
            />

            <label htmlFor="descricao">Descrição <b className="text-red-500">*</b></label>
            <textarea 
              name="descricao" 
              id="descricao" 
              rows={4} 
              value={formData.descricao}
              onChange={handleChange}
              className="border border-slate-200 rounded-xl p-2 mb-1.5"
              required 
            />
            
            <label>Haverão sub-eventos vinculados a este evento? <b className="text-red-500">*</b></label>
            <div className="flex flex-row gap-2">
              <input 
                type="radio" 
                name="tipo" 
                id="Simples"
                value="Simples"
                checked={formData.tipo === "Simples"}
                onChange={handleChange}
              /> 
              <div className="mr-4">Não</div>

              <input 
                type="radio" 
                name="tipo" 
                id="Composto"
                value="Composto"
                checked={formData.tipo === "Composto"}
                onChange={handleChange}
              /> 
              <div>Sim</div>
            </div>

            <h1 className="mt-1.5">Endereço <b className="text-red-500">*</b></h1>
            <div className="flex flex-col gap-4 border border-slate-200 rounded-xl p-3">
              <div className="flex flex-col gap-2">
                <label htmlFor="cidade">Cidade</label>
                <select 
                  name="cidade" 
                  id="cidade"
                  value={formData.cidade}
                  onChange={handleChange}
                  className="border border-slate-200 rounded-xl p-2"
                  required
                >
                  {cidades.map((item: any) => (
                    <option 
                      key={item.id}
                      value={item.id}
                    >
                      {item.nome}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-row gap-6">
                <div className="flex flex-col gap-2 w-1/2">
                  <label htmlFor="cep">CEP</label>
                  <input 
                    type="number" 
                    name="cep" 
                    id="cep"
                    maxLength={8}
                    placeholder="55111222"
                    value={formData.cep}
                    onChange={handleChange}
                    className="border border-slate-200 rounded-xl p-2"
                    required
                  />
                </div>
                <div className="flex flex-col gap-2 w-1/2">
                  <label htmlFor="bairro">Bairro</label>
                  <input 
                    type="text" 
                    name="bairro" 
                    id="bairro"
                    value={formData.bairro}
                    onChange={handleChange}
                    className="border border-slate-200 rounded-xl p-2"
                    required
                  />
                </div>
              </div>
              <div className="flex flex-row gap-6">
                <div className="flex flex-col gap-2 w-1/2">
                  <label htmlFor="rua">Rua</label>
                  <input 
                    type="text" 
                    name="rua" 
                    id="rua"
                    value={formData.rua}
                    onChange={handleChange}
                    className="border border-slate-200 rounded-xl p-2"
                    required
                  />
                </div>
                <div className="flex flex-col gap-2 w-1/2">
                  <label htmlFor="numero">Número</label>
                  <input 
                    type="text" 
                    name="numero" 
                    id="numero"
                    value={formData.numero}
                    onChange={handleChange}
                    className="border border-slate-200 rounded-xl p-2"
                    required
                  />
                </div>
              </div>
            </div>
            
            <h1 className="flex flex-row mt-1.5">Data e hora
              <b className="text-red-500 ml-1"> *</b>
              <div className="relative group cursor-pointer">
                <span className="text-gray-500">ⓘ</span>

                {/* Tooltip */}
                <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-64 
                                bg-black text-white text-xs rounded p-2
                                opacity-0 group-hover:opacity-100
                                transition-opacity pointer-events-none z-10">
                  Data e hora de Sub-Eventos devem estar contidos
                  no horário de ocorrência do seu Evento Pai.
                </div>
              </div>
            </h1>
            <div className="flex flex-row gap-6 border border-slate-200 rounded-xl p-3 mb-1.5">
              <div className="flex flex-col gap-2 w-1/2">
                <label htmlFor="dataHoraInicio">Início do evento</label>
                <input 
                  type="datetime-local" 
                  name="dataHoraInicio" 
                  id="dataHoraInicio"
                  value={formData.dataHoraInicio}
                  onChange={handleChange}
                  min={eventoPai ? formatarDataInput(eventoPai.dataHoraInicio) : undefined}
                  className="border border-slate-200 rounded-xl p-2"
                  required
                />
              </div>

              <div className="flex flex-col gap-2 w-1/2">
                <label htmlFor="dataHoraFim">Fim do evento</label>
                <input 
                  type="datetime-local" 
                  name="dataHoraFim" 
                  id="dataHoraFim" 
                  value={formData.dataHoraFim}
                  onChange={handleChange}
                  max={eventoPai ? formatarDataInput(eventoPai.dataHoraFim) : undefined}
                  className="border border-slate-200 rounded-xl p-2"
                  required
                />
              </div>
            </div>

            <label htmlFor="classificacao">Classificação indicativa</label>
            <select 
              name="classificacao" 
              id="classificacao"
              value={formData.classificacao}
              onChange={handleChange}
              className="border border-slate-200 rounded-xl p-2"
            >
              <option value="Livre">Livre</option>
              <option value="10 Anos">10 Anos</option>
              <option value="12 Anos">12 Anos</option>
              <option value="14 Anos">14 Anos</option>
              <option value="16 Anos">16 Anos</option>
              <option value="18 Anos">18 Anos</option>
            </select>

            <h1 className="mt-1.5">Contato do Organizador</h1>
            <div className="flex flex-row gap-6 border border-slate-200 rounded-xl p-3">
              <div className="flex flex-col gap-2 w-1/2">
                <label htmlFor="email">E-mail</label>
                <input 
                  type="email" 
                  name="email" 
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="border border-slate-200 rounded-xl p-2"
                />
              </div>
              <div className="flex flex-col gap-2 w-1/2">
                <label htmlFor="telefone">Telefone</label>
                <input 
                  type="tel" 
                  name="telefone" 
                  id="telefone"
                  value={formData.telefone}
                  onChange={handleChange}
                  className="border border-slate-200 rounded-xl p-2"
                />
              </div>
            </div>
          </div>

          <ImagemSelector
            imagens={imagens}
            setImagens={setImagens}
          />

          <IngressoSelector
            ingressos={ingressos}
            setIngressos={setIngressos}
          />

          <CategoriaSelector 
            tagsExistentes={categorias}
            selecionadas={tagSelecionadas}
            setSelecionadas={setTagSelecionadas}
            novas={tagNovas}
            setNovas={setTagNovas}
          />
          
          <PontoVendaSelector
            pontoVendaExistentes={pontoVendas}
            selecionados={pontoVendaSelecionados}
            setSelecionados={setPontoVendaSelecionados}
          />
        </Form>
      </main>
    </div>
  );
}
