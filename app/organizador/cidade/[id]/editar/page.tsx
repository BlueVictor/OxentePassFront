
import { chamadaAPI } from "../../../../../backend/chamadaPadrao";
import { redirect } from "next/navigation";
import Form from "@/app/_components/Form";
import CategoriaSelector from "@/app/_components/Organizador/CategoriaSelector";
import "../../../../globals.css";

var idCidade : string
var categCidade: any[] = []

async function editarCidade (formData: FormData) {
  'use server'

  // Edição da cidade
	const data = {
		nome: formData.get("nome"),
		descricao: formData.get("descricao")
	}

  const response = await chamadaAPI(
    `/cidade/${idCidade}`, "PUT", data
  )
  
  if (!response) {
    console.error("Falha na edição de cidade")
    return
  }

  // Adição e remoção de categorias
	const tagsExistentes = [...new Set(formData.getAll('tagsExistentes').map(Number))]
  const tagsNovas = formData.getAll('tagsNovas')

  console.log("tagsExistentes: " + tagsExistentes)
  console.log("tagsNovas: " + tagsNovas)
  
	tagsExistentes.forEach(async tag => {
    if (!categCidade.some(tagCidade => Number(tag) === tagCidade.id)) {
      await addCategExistente(idCidade, tag.toString())
    }
	});

  categCidade.forEach(async tagCidade => {
    if (!tagsExistentes.some(tag => Number(tag) === tagCidade.id)) {
      await delCategExistente(idCidade, tagCidade.id.toString())
    }
	});

	tagsNovas.forEach(async tag => {
		await addCategNova(idCidade, tag.toString())
	});
  
  redirect ("/organizador/cidade") 
}

async function addCategExistente (idCidade: string, categ: string) {
	const response = await chamadaAPI(
		`/cidade/${idCidade}/addTag/${categ}`, "PATCH"
	)
	
	if (!response) {
		console.error("Falha na adição da categoria " + categ)
		return
	}
}

async function delCategExistente (idCidade: string, categ: string) {
	const response = await chamadaAPI(
		`/cidade/${idCidade}/removerTag/${categ}`, "PATCH"
	)
	
	if (!response) {
		console.error("Falha na remoção da categoria " + categ)
		return
	}
}

async function addCategNova (idCidade: string, categ: string) {
	const response = await chamadaAPI(
		`/cidade/${idCidade}/addTag`, "PATCH", {tag: categ}
	)
	
	if (!response) {
		console.error("Falha na adição da categoria " + categ)
		return
	}
}

async function getCidade () {
  const response = await chamadaAPI(
    `/cidade/filtro?id=${idCidade}`, 
    "GET", 
  )
  
  if (!response) {
    console.error("Falha na obtenção de cidade")
    return
  }
  
  return response.content
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

export default async function editar ({ params }: { params: { id: string } }) {
  idCidade = (await params).id
  const cidade = (await getCidade())[0]
  const categorias = await getCategorias()
  categCidade = cidade.tags

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

            <CategoriaSelector 
              tagsExistentes={categorias}
              tagsSelecionadasInit={cidade.tags}
            />
          </div>
        </Form>
      </main>
    </div>
  );
}
