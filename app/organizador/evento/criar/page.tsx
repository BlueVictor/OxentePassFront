
import { chamadaAPI } from "../../../../backend/chamadaPadrao";
import { redirect } from "next/navigation";
import Form from "@/app/_components/Form";
import CategoriaSelector from "@/app/_components/Organizador/CategoriaSelector";
import "../../../globals.css";
import "./page.css"

async function criarEvento (formData: FormData) {
  'use server'
  // Criação do evento
  const data = {
    nome: formData.get("nome"),
    descricao: formData.get("descricao") //pegar o resto dos dados
  }

  const evento = await chamadaAPI(
    "/evento", "POST", data
  )
  
  if (!evento) {
    console.error("Falha na criação do evento")
    return
  }

  // Adição de categorias
  const tagsExistentes = formData.getAll('tagsExistentes');
  const tagsNovas = formData.getAll('tagsNovas');

  tagsExistentes.forEach(async tag => {
    await addCategExistente(evento.id, tag.toString())
  });

  tagsNovas.forEach(async tag => {
    await addCategNova(evento.id, tag.toString())
  });

  redirect ("/organizador/evento") 
}

async function addCategExistente (idCidade: string, categ: string) {
  const response = await chamadaAPI(
    `/evento/${idCidade}/addTag/${categ}`, "PATCH"
  )
  
  if (!response) {
    console.error("Falha na adição da categoria " + categ)
    return
  }
}

async function addCategNova (idCidade: string, categ: string) {
  const response = await chamadaAPI(
    `/evento/${idCidade}/addTag`, "PATCH", {tag: categ}
  )
  
  if (!response) {
    console.error("Falha na adição da categoria " + categ)
    return
  }
}

async function getCategorias () {
  const response = await chamadaAPI(
    `/tag`, 
    "GET" 
  )
  
  if (!response) {
    console.error("Falha na obtenção das categorias")
    return
  }
  
  return response.content
}

async function getCidades () {
  const response = await chamadaAPI(
    `/cidade`, 
    "GET" 
  )
  
  if (!response) {
    console.error("Falha na obtenção das cidades")
    return
  }
  
  return response.content
}

export default async function criar () {
  const categorias = await getCategorias()
  const cidades = await getCidades()

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
              placeholder="Nome" 
              className="border border-slate-200 rounded-xl p-2 mb-1.5"
              required 
            />

            <label htmlFor="descricao">Descrição <b className="text-red-500">*</b></label>
            <textarea 
              name="descricao" 
              id="descricao" 
              rows={4} 
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
                defaultChecked
              /> 
              <div className="mr-4">Não</div>

              <input 
                type="radio" 
                name="tipo" 
                id="composto"
                value="composto"
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
                  className="border border-slate-200 rounded-xl p-2"
                  required
                />
              </div>

              <div className="flex flex-col gap-2 w-1/2">
                <label htmlFor="dataHoraInicio">Fim do evento</label>
                <input 
                  type="datetime-local" 
                  name="dataHoraFim" 
                  id="dataHoraFim" 
                  className="border border-slate-200 rounded-xl p-2"
                  required
                />
              </div>
            </div>

            <label htmlFor="classificacao">Classificação indicativa</label>
            <select 
              name="classificacao" 
              id="classificacao"
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
                  className="border border-slate-200 rounded-xl p-2"
                />
              </div>
              <div className="flex flex-col gap-2 w-1/2">
                <label htmlFor="telefone">Telefone</label>
                <input 
                  type="tel" 
                  name="telefone" 
                  id="telefone"
                  className="border border-slate-200 rounded-xl p-2"
                />
              </div>
            </div>
          </div>

          <CategoriaSelector 
            tagsExistentes={categorias}
          />
        </Form>
      </main>
    </div>
  );
}
