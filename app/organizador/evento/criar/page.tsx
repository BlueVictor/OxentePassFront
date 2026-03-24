'use client'
import { chamadaAPI } from "../../../../backend/chamadaPadrao";
import { redirect } from "next/navigation";
import Form from "@/app/_components/Form";
import CategoriaSelector from "@/app/_components/Organizador/CategoriaSelector";
import { useToast } from "@/app/_components/ToastProvider";
import { useEffect, useState } from "react";
import "../../../globals.css";
import "./page.css"
import { useAuth } from "@/app/_components/Auth/AuthProvider";
import PontoVendaSelector from "@/app/_components/Organizador/PontoVendaSelector";
import IngressoSelector from "@/app/_components/Organizador/IngressoSelector";

type Ingresso = {
  tipoIngresso: string,
  valorBase: number,
  quantidadeDisponivel: number,
  temMeiaEntrada: boolean
}

function formatarData(data: string): string {
  if (!data) return ""

  return data.replace("T", " ") + ":00"
}

export default function criar () {
  const { usuario } = useAuth();
  const { showToast } = useToast();
  const [categorias, setCategorias] = useState<any[]>([]);				      //todas as categorias
  const [cidades, setCidades] = useState<any[]>([]);				            //todas as cidades
  const [pontoVendas, setPontoVendas] = useState<any[]>([]);            //todos os pontos de venda
  
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    tipo: "simples",
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
  const [tagSelecionadas, setTagSelecionadas] = useState<number[]>([]); //categorias pós-modificação
  const [tagNovas, setTagNovas] = useState<string[]>([]);								//categorias novas (criadas no input de texto)
  const [pontoVendaSelecionados, setPontoVendaSelecionados] = useState<number[]>([]); //ponto-venda pós-modificação
  const [ingressos, setIngressos] = useState<Ingresso[]>([]); //ingressos inseridos
  
  const criarEvento = async () => {
    console.log(formData.dataHoraInicio)
    console.log("cidade: " + formData.cidade)


    // Criação do evento
    const data = {
      nome: formData.nome,
      descricao: formData.descricao,
      idOrganizador: 1,
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

    // Adição de categorias
		tagSelecionadas.forEach(async tag => {
			await addCategExistente(evento.data.id, tag.toString())
		});

		tagNovas.forEach(async tag => {
			await addCategNova(evento.data.id, tag.toString())
		});

    // Adição de pontos de venda
    pontoVendaSelecionados.forEach(async ponto => {
      await addPontoVenda(evento.data.id, ponto.toString())
    })

    // Adição de ingressos
    ingressos.forEach(async ing => {
      await addIngresso(evento.data.id, ing)
    })

		showToast("Evento criado!", "success")
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

  useEffect(() => {
    async function carregar() {
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
          title="Criar Evento"
          action={criarEvento}
          buttons={
            <>
              <button type="submit" className="botao-primario">Criar Evento</button>
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
                id="simples"
                value="simples"
                checked={formData.tipo === "simples"}
                onChange={handleChange}
              /> 
              <div className="mr-4">Não</div>

              <input 
                type="radio" 
                name="tipo" 
                id="composto"
                value="composto"
                checked={formData.tipo === "composto"}
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
            
            <h1 className="mt-1.5">Data e hora <b className="text-red-500">*</b></h1>
            <div className="flex flex-row gap-6 border border-slate-200 rounded-xl p-3 mb-1.5">
              <div className="flex flex-col gap-2 w-1/2">
                <label htmlFor="dataHoraInicio">Início do evento</label>
                <input 
                  type="datetime-local" 
                  name="dataHoraInicio" 
                  id="dataHoraInicio"
                  value={formData.dataHoraInicio}
							    onChange={handleChange}
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

          <CategoriaSelector 
            tagsExistentes={categorias}
            selecionadas={tagSelecionadas}
            setSelecionadas={setTagSelecionadas}
            novas={tagNovas}
            setNovas={setTagNovas}
          />

          <IngressoSelector
            ingressos={ingressos}
            setIngressos={setIngressos}
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
