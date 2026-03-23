'use client'

import { chamadaAPI } from "../../../../backend/chamadaPadrao";
import { redirect } from "next/navigation";
import Form from "@/app/_components/Form";
import { useState } from "react";
import { useToast } from "@/app/_components/ToastProvider";
import "../../../globals.css";

export default function criar () {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    tag: ""
  });

  const criarCategoria = async () => {
    // Criação da categoria
    const data = {
      tag: formData.tag
    }

    const response = await chamadaAPI(
      "/tag", "POST", data, {
        returnMeta: true,
        silenciarErro: false,
      }
    )
    
    if (!response.ok) {
      console.error("Falha na criação da categoria")
      showToast(String(response.data.mensagem), "error")
      return
    }

    showToast("Categoria criada!", "success")
    redirect ("/organizador/categoria")
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
              value={formData.tag}
              onChange={handleChange}
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
