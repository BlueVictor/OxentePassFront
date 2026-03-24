'use client'
import { chamadaAPI } from "../../../../../backend/chamadaPadrao";
import { redirect } from "next/navigation";
import Form from "@/app/_components/Form";
import CategoriaSelector from "@/app/_components/Organizador/CategoriaSelector";
import { useEffect, useState } from "react";
import { useToast } from "@/app/_components/ToastProvider";
import "../../../../globals.css";

export default function editar (props: any) {
  const { showToast } = useToast();
  const [idCidade, setIdCidade] = useState<any>();
  const [categorias, setCategorias] = useState<any[]>([]);        //todas as categorias
  const [cidadeCateg, setCidadeCateg] = useState<any[]>([]);      //categorias previamente selecionadas

  const [formData, setFormData] = useState({
    nome: "",
    descricao: ""
  });
  const [selecionadas, setSelecionadas] = useState<number[]>([]); //categorias pós-modificação
  const [novas, setNovas] = useState<string[]>([]);               //categorias novas (criadas no input de texto)

  const editarCidade = async () => {
    // Edição da cidade
    const data = {
      nome: formData.nome,
      descricao: formData.descricao
    }

    const cidade = await chamadaAPI(
      `/cidade/${idCidade}`, "PUT", data, {
        returnMeta: true,
        silenciarErro: false,
      }
    )
    
    if (!cidade.ok) {
      console.error("Falha na edição de cidade")
      showToast(String(cidade.data.mensagem), "error")
      return
    }

    // Adição e remoção de categorias
    selecionadas.forEach(async tag => {
      if (!cidadeCateg.includes(Number(tag))) {
        await addCategExistente(idCidade, tag.toString())
      }
    });

    cidadeCateg.forEach(async tagCidade => {
      if (!selecionadas.includes(Number(tagCidade))) {
        await delCategExistente(idCidade, tagCidade.toString())
      }
    });

    novas.forEach(async tag => {
      await addCategNova(idCidade, tag.toString())
    });

    showToast("Cidade editada!", "success")
    redirect ("/organizador/cidade") 
  }

  const getCidade = async (id: any) => {
    const response = await chamadaAPI(
      `/cidade/filtro?id=${id}`, "GET", {}, {
        returnMeta: true,
        silenciarErro: false,
      } 
    )
    
    if (!response.ok) {
      console.error("Falha na obtenção de cidade")
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

  const delCategExistente = async (idCidade: string, categ: string) => {
    const response = await chamadaAPI(
      `/cidade/${idCidade}/removerTag/${categ}`, "PATCH", {}, {
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
      const id = (await props.params).id
      if (id) setIdCidade(id);

      const cidade = await getCidade(id)
      if(cidade) {
        setFormData({nome: cidade.nome, descricao: cidade.descricao})
        setSelecionadas(cidade.tags.map((tag: any) => tag.id))
        setCidadeCateg(cidade.tags.map((tag: any) => tag.id))
      } 

      const tags = await getCategorias();
      if (tags) setCategorias(tags);
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
          title="Editar Cidade"
          action={editarCidade}
          buttons={
            <>
              <button type="submit" className="botao-primario">Editar cidade</button>
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

