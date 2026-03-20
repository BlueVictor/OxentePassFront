
import { chamadaAPI } from "../../../../backend/chamadaPadrao";
import { redirect } from "next/navigation";
import Form from "@/app/_components/Form";
import CategoriaSelector from "@/app/_components/Organizador/CategoriaSelector";
import "../../../globals.css";

async function criarCidade (formData: FormData) {
	'use server'

	// Criação da cidade
	const data = {
		nome: formData.get("nome"),
		descricao: formData.get("descricao")
	}

	const cidade = await chamadaAPI(
		"/cidade", "POST", data
	)
	
	if (!cidade) {
		console.error("Falha na criação de cidade")
		return
	}

	// Adição de categorias
	const tagsExistentes = formData.getAll('tagsExistentes');
  const tagsNovas = formData.getAll('tagsNovas');

	tagsExistentes.forEach(async tag => {
		await addCategExistente(cidade.id, tag.toString())
	});

	tagsNovas.forEach(async tag => {
		await addCategNova(cidade.id, tag.toString())
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

async function addCategNova (idCidade: string, categ: string) {
	const response = await chamadaAPI(
		`/cidade/${idCidade}/addTag`, "PATCH", {tag: categ}
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

export default async function criar () {
	const categorias = await getCategorias()

  return (
		<div className="flex flex-row justify-center">
      <main className="w-3/5">
				<Form
					title="Criar Cidade"
					action={criarCidade}
					buttons={
						<>
							<button type="submit" className="botao-primario">Criar cidade</button>
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
							required 
						/>

						<label htmlFor="descricao">Descrição</label>
						<textarea 
							name="descricao" 
							id="descricao" 
							rows={4} 
							className="border border-slate-200 rounded-xl p-2"
							required 
						/>
					</div>

					<CategoriaSelector 
						tagsExistentes={categorias}
					/>
				</Form>
			</main>
		</div>
  );
}
