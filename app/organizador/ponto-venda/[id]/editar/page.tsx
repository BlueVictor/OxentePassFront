'use client'

import Form from "@/app/_components/Form";
import { useToast } from "@/app/_components/ToastProvider";
import { chamadaAPI } from "../../../../../backend/chamadaPadrao";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import "../../../../globals.css";

type PontoVenda = {
  nome: string;
  detalhes: string;
  endereco: {
    cep: string;
    bairro: string;
    rua: string;
    numero: number;
  };
};

export default function EditarPontoVendaPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { showToast } = useToast();
  const idPontoVenda = params.id;

  const [formData, setFormData] = useState({
    nome: "",
    detalhes: "",
    cep: "",
    bairro: "",
    rua: "",
    numero: "",
  });
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregarPontoVenda() {
      const response = await chamadaAPI(
        `/pontovenda/filtro?id=${idPontoVenda}`,
        "GET"
      );

      const pontoVenda = response?.content?.[0] as PontoVenda | undefined;

      if (!pontoVenda) {
        console.error("Falha na obtencao do ponto de venda");
        showToast("Nao foi possivel carregar o ponto de venda.", "error");
        setCarregando(false);
        return;
      }

      setFormData({
        nome: pontoVenda.nome,
        detalhes: pontoVenda.detalhes,
        cep: pontoVenda.endereco.cep,
        bairro: pontoVenda.endereco.bairro,
        rua: pontoVenda.endereco.rua,
        numero: String(pontoVenda.endereco.numero),
      });
      setCarregando(false);
    }

    if (idPontoVenda) {
      carregarPontoVenda();
    }
  }, [idPontoVenda, showToast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const editarPontoVenda = async () => {
    const response = await chamadaAPI(
      `/pontovenda/${idPontoVenda}`,
      "PUT",
      {
        ...formData,
        numero: Number(formData.numero),
      },
      {
        returnMeta: true,
      }
    );

    if (!response?.ok) {
      console.error("Falha na edicao do ponto de venda");
      showToast("Nao foi possivel editar o ponto de venda.", "error");
      return;
    }

    showToast("Ponto de venda editado!", "success");
    router.push("/organizador/ponto-venda");
  };

  return (
    <div className="flex flex-row justify-center">
      <main className="w-3/5">
        <Form
          title="Editar Ponto de Venda"
          action={editarPontoVenda}
          buttons={<button type="submit" className="botao-primario">Editar ponto de venda</button>}
        >
          {carregando ? (
            <p className="text-sm text-slate-500">Carregando ponto de venda...</p>
          ) : (
            <div className="flex flex-col gap-2">
              <label htmlFor="nome">Nome <b className="text-red-500">*</b></label>
              <input
                type="text"
                name="nome"
                id="nome"
                className="rounded-xl border border-slate-200 p-2"
                value={formData.nome}
                onChange={handleChange}
                required
              />

              <label htmlFor="detalhes">Detalhes <b className="text-red-500">*</b></label>
              <textarea
                name="detalhes"
                id="detalhes"
                rows={4}
                value={formData.detalhes}
                onChange={handleChange}
                className="rounded-xl border border-slate-200 p-2"
                required
              />

              <label htmlFor="cep">CEP <b className="text-red-500">*</b></label>
              <input
                type="text"
                name="cep"
                id="cep"
                className="rounded-xl border border-slate-200 p-2"
                value={formData.cep}
                onChange={handleChange}
                required
              />

              <label htmlFor="bairro">Bairro <b className="text-red-500">*</b></label>
              <input
                type="text"
                name="bairro"
                id="bairro"
                className="rounded-xl border border-slate-200 p-2"
                value={formData.bairro}
                onChange={handleChange}
                required
              />

              <label htmlFor="rua">Rua <b className="text-red-500">*</b></label>
              <input
                type="text"
                name="rua"
                id="rua"
                className="rounded-xl border border-slate-200 p-2"
                value={formData.rua}
                onChange={handleChange}
                required
              />

              <label htmlFor="numero">Numero <b className="text-red-500">*</b></label>
              <input
                type="number"
                name="numero"
                id="numero"
                className="rounded-xl border border-slate-200 p-2"
                value={formData.numero}
                onChange={handleChange}
                required
              />
            </div>
          )}
        </Form>
      </main>
    </div>
  );
}
