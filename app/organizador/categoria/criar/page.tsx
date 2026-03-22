
import { chamadaAPI } from "../../../../backend/chamadaPadrao";
import { redirect } from "next/navigation";
import Form from "@/app/_components/Form";
import "../../../globals.css";

async function criarCategoria (formData: FormData) {
  'use server'

  // Criação da categoria
  const data = {
    tag: formData.get("tag"),
  }

  const cidade = await chamadaAPI(
    "/tag", "POST", data
  )
  
  if (!cidade) {
    console.error("Falha na criação da categoria")
    return
  }

  redirect ("/organizador/categoria") 
}


export default async function criar () {
  return (
    <div className="flex flex-row justify-center">
      <main className="w-3/5">
        <Form
          title="Criar Categoria"
          action={criarCategoria}
          buttons={
            <>
              <button type="submit" className="botao-primario">Criar categoria</button>
            </>
          }
        >
          <div className="flex flex-col gap-2">
            <label htmlFor="tag">Nome <b className="text-red-500">*</b></label>
            <input 
              type="text" 
              name="tag" 
              id="tag" 
              placeholder="Nome da categoria" 
              className="border border-slate-200 rounded-xl p-2"
              required 
            />
          </div>
        </Form>
      </main>
    </div>
  );
}
