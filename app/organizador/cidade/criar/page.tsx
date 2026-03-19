
import { chamadaAPI } from "../../../../backend/chamadaPadrao";
import { redirect } from "next/navigation";
import Form from "@/app/_components/Form";
import "../../../globals.css";

async function criarCidade (formData: FormData) {
	'use server'

	const json = Object.fromEntries(
		Array.from(formData.entries()).filter(([key]) => !key.startsWith('$ACTION_')
	));

	const response = await chamadaAPI(
		"/cidade", 
		"POST", 
		json
	)
	
	if (!response) {
		console.error("Falha na criação de cidade")
		return
	}
	
	redirect ("/organizador/cidade") 
}

export default function () {
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
						<input type="text" name="nome" id="nome" placeholder="Nome" required className="border border-slate-200 rounded-xl p-2"/>
						<label htmlFor="descricao">Descrição</label>
						<textarea name="descricao" id="descricao" rows={4} required className="border border-slate-200 rounded-xl"/>
					</div>
				</Form>
			</main>
		</div>
  );
}
