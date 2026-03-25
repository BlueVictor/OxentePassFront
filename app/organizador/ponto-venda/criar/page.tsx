'use client'

import Form from "@/app/_components/Form";
import { useToast } from "@/app/_components/ToastProvider";
import { chamadaAPI } from "../../../../backend/chamadaPadrao";
import { redirect } from "next/navigation";
import { useState } from "react";
import "../../../globals.css";

export default function CriarPontoVendaPage() {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    nome: "",
    detalhes: "",
    cep: "",
    bairro: "",
    rua: "",
    numero: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const criarPontoVenda = async () => {
    const response = await chamadaAPI(
      "/pontovenda",
      "POST",
      {
        ...formData,
        numero: Number(formData.numero),
      },
      {
        returnMeta: true,
      }
    );

    if (!response?.ok) {
      showToast("Nao foi possivel criar o ponto de venda.", "error");
      return;
    }

    showToast("Ponto de venda criado!", "success");
    redirect("/organizador/ponto-venda");
  };

  return (
    <div className="flex flex-row justify-center">
      <main className="w-3/5">
        <Form
          title="Criar Ponto de Venda"
          action={criarPontoVenda}
          buttons={<button type="submit" className="botao-primario">Criar ponto de venda</button>}
        >
          <div className="flex flex-col gap-2">
            <label htmlFor="nome">Nome <b className="text-red-500">*</b></label>
            <input
              type="text"
              name="nome"
              id="nome"
              value={formData.nome}
              onChange={handleChange}
              className="rounded-xl border border-slate-200 p-2"
              required
            />

            <label htmlFor="detalhes">Detalhes <b className="text-red-500">*</b></label>
            <textarea
              name="detalhes"
              id="detalhes"
              value={formData.detalhes}
              onChange={handleChange}
              rows={4}
              className="rounded-xl border border-slate-200 p-2"
              required
            />

            <label htmlFor="cep">CEP <b className="text-red-500">*</b></label>
            <input
              type="text"
              name="cep"
              id="cep"
              value={formData.cep}
              onChange={handleChange}
              className="rounded-xl border border-slate-200 p-2"
              required
            />

            <label htmlFor="bairro">Bairro <b className="text-red-500">*</b></label>
            <input
              type="text"
              name="bairro"
              id="bairro"
              value={formData.bairro}
              onChange={handleChange}
              className="rounded-xl border border-slate-200 p-2"
              required
            />

            <label htmlFor="rua">Rua <b className="text-red-500">*</b></label>
            <input
              type="text"
              name="rua"
              id="rua"
              value={formData.rua}
              onChange={handleChange}
              className="rounded-xl border border-slate-200 p-2"
              required
            />

            <label htmlFor="numero">Numero <b className="text-red-500">*</b></label>
            <input
              type="number"
              name="numero"
              id="numero"
              value={formData.numero}
              onChange={handleChange}
              className="rounded-xl border border-slate-200 p-2"
              required
            />
          </div>
        </Form>
      </main>
    </div>
  );
}
