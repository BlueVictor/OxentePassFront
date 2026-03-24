'use client'

import { chamadaAPI } from "../../../../backend/chamadaPadrao";
import { redirect } from "next/navigation";
import Form from "@/app/_components/Form";
import CategoriaSelector from "@/app/_components/Organizador/CategoriaSelector";
import { useToast } from "@/app/_components/ToastProvider";
import { useEffect, useState } from "react";
import "../../../globals.css";

export default function criar () {
	const { showToast } = useToast();
	const [categorias, setCategorias] = useState<any[]>([]);				//todas as categorias

	const [formData, setFormData] = useState({
		nome: "",
		descricao: ""
	});
	const [selecionadas, setSelecionadas] = useState<number[]>([]); //categorias pós-modificação
  const [novas, setNovas] = useState<string[]>([]);								//categorias novas (criadas no input de texto)

	const criarCidade = async () => {
		// Criação da cidade
		const data = {
			nome: formData.nome,
			descricao: formData.descricao
		}

		const cidade = await chamadaAPI(
			"/cidade", "POST", data, {
        returnMeta: true,
        silenciarErro: false,
      }
		)
		
		if (!cidade.ok) {
			console.error("Falha na criação de cidade")
			showToast(String(cidade.data.mensagem), "error")
			return
		}

		// Adição de categorias
		selecionadas.forEach(async tag => {
			await addCategExistente(cidade.data.id, tag.toString())
		});

		novas.forEach(async tag => {
			await addCategNova(cidade.data.id, tag.toString())
		});

		showToast("Cidade criada!", "success")
		redirect ("/organizador/cidade") 
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

	const addCategExistente = async (idCidade: string, categ: string) => {
		const response = await chamadaAPI(
			`/cidade/${idCidade}/addTag/${categ}`, "PATCH", {}, {
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

	const addCategNova = async (idCidade: string, categ: string) => {
		const response = await chamadaAPI(
			`/cidade/${idCidade}/addTag`, "PATCH", {tag: categ}, {
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

	useEffect(() => {
    async function carregar() {
      const data = await getCategorias();
      if (data) setCategorias(data);
    }

    carregar();
  }, []);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => {
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
					title="Criar Cidade"
					action={criarCidade}
					buttons={
						<>
							<button type="submit" className="botao-primario">Criar cidade</button>
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
							className="border border-slate-200 rounded-xl p-2"
							required 
						/>

						<label htmlFor="descricao">Descrição <b className="text-red-500">*</b></label>
						<textarea 
							name="descricao" 
							id="descricao" 
							value={formData.descricao}
							onChange={handleChange}
							rows={4} 
							className="border border-slate-200 rounded-xl p-2"
							required 
						/>
					</div>

					<CategoriaSelector 
						tagsExistentes={categorias}
						selecionadas={selecionadas}
						setSelecionadas={setSelecionadas}
						novas={novas}
						setNovas={setNovas}
					/>
				</Form>
			</main>
		</div>
  );
}
