import Form from "@/app/_components/Form";
import { chamadaAPI } from "../../../../../backend/chamadaPadrao";
import { redirect } from "next/navigation";
import "../../../../globals.css";

async function editarPontoVenda(idPontoVenda: string, formData: FormData) {
  'use server';

  const data = {
    nome: formData.get("nome"),
    detalhes: formData.get("detalhes"),
    cep: formData.get("cep"),
    bairro: formData.get("bairro"),
    rua: formData.get("rua"),
    numero: Number(formData.get("numero")),
  };

  const response = await chamadaAPI(
    `/pontovenda/${idPontoVenda}`,
    "PUT",
    data
  );

  if (!response) {
    console.error("Falha na edicao do ponto de venda");
    return;
  }

  redirect("/organizador/ponto-venda");
}

async function getPontoVenda(idPontoVenda: string) {
  const response = await chamadaAPI(
    `/pontovenda/filtro?id=${idPontoVenda}`,
    "GET"
  );

  if (!response) {
    console.error("Falha na obtencao do ponto de venda");
    return;
  }

  return response.content;
}

export default async function EditarPontoVendaPage({ params }: { params: Promise<{ id: string }> }) {
  const idPontoVenda = (await params).id;
  const pontoVenda = (await getPontoVenda(idPontoVenda))[0];

  return (
    <div className="flex flex-row justify-center">
      <main className="w-3/5">
        <Form
          title="Editar Ponto de Venda"
          action={editarPontoVenda.bind(null, idPontoVenda)}
          buttons={<button type="submit" className="botao-primario">Editar ponto de venda</button>}
        >
          <div className="flex flex-col gap-2">
            <label htmlFor="nome">Nome <b className="text-red-500">*</b></label>
            <input
              type="text"
              name="nome"
              id="nome"
              className="rounded-xl border border-slate-200 p-2"
              defaultValue={pontoVenda.nome}
              required
            />

            <label htmlFor="detalhes">Detalhes <b className="text-red-500">*</b></label>
            <textarea
              name="detalhes"
              id="detalhes"
              rows={4}
              defaultValue={pontoVenda.detalhes}
              className="rounded-xl border border-slate-200 p-2"
              required
            />

            <label htmlFor="cep">CEP <b className="text-red-500">*</b></label>
            <input
              type="text"
              name="cep"
              id="cep"
              className="rounded-xl border border-slate-200 p-2"
              defaultValue={pontoVenda.endereco.cep}
              required
            />

            <label htmlFor="bairro">Bairro <b className="text-red-500">*</b></label>
            <input
              type="text"
              name="bairro"
              id="bairro"
              className="rounded-xl border border-slate-200 p-2"
              defaultValue={pontoVenda.endereco.bairro}
              required
            />

            <label htmlFor="rua">Rua <b className="text-red-500">*</b></label>
            <input
              type="text"
              name="rua"
              id="rua"
              className="rounded-xl border border-slate-200 p-2"
              defaultValue={pontoVenda.endereco.rua}
              required
            />

            <label htmlFor="numero">Numero <b className="text-red-500">*</b></label>
            <input
              type="number"
              name="numero"
              id="numero"
              className="rounded-xl border border-slate-200 p-2"
              defaultValue={pontoVenda.endereco.numero}
              required
            />
          </div>
        </Form>
      </main>
    </div>
  );
}
