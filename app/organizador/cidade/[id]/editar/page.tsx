
import { chamadaAPI } from "../../../../../backend/chamadaPadrao";
import { redirect } from "next/navigation";
import Form from "@/app/_components/Form";
import "../../../../globals.css";

var idCidade : string

async function editarCidade (formData: FormData) {
  'use server'

  const json = Object.fromEntries(
    Array.from(formData.entries()).filter(([key]) => !key.startsWith('$ACTION_')
  ));

  const response = await chamadaAPI(
    `/cidade/${idCidade}`, 
    "PUT", 
    json
  )
  
  if (!response) {
    console.error("Falha na edição de cidade")
    return
  }
  
  redirect ("/organizador/cidade") 
}

async function getCidade () {
  const response = await chamadaAPI(
    `/cidade?id=${idCidade}`, 
    "GET", 
  )
  
  if (!response) {
    console.error("Falha na obtenção de cidade")
    return
  }
  
  return response.content
}

export default async function editar ({ params }: { params: { id: string } }) {
  idCidade = (await params).id
  const cidade = (await getCidade())[0]

  return (
    <div className="flex flex-row justify-center">
      <main className="w-3/5">
        <Form
          title="Editar Cidade"
          action={editarCidade}
          buttons={
            <>
              <button type="submit" className="botao-primario">Editar cidade</button>
            </>
          }
        >
          <div className="flex flex-col gap-2">
            <label htmlFor="nome">Nome</label>
            <input 
              type="text" 
              name="nome" 
              id="nome" 
              placeholder="Nome" 
              className="border border-slate-200 rounded-xl p-2" 
              defaultValue={cidade.nome}
              required 
            />

            <label htmlFor="descricao">Descrição</label>
            <textarea 
              name="descricao" 
              id="descricao" 
              rows={4} 
              defaultValue={cidade.descricao}
              className="border border-slate-200 rounded-xl p-2" 
              required 
            />
          </div>
        </Form>
      </main>
    </div>
  );
}
