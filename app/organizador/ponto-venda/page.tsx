import { OrgLista } from "@/app/_components/Organizador/OrgLista";
import { Paginacao } from "@/app/_components/Paginacao";
import { chamadaAPI } from "../../../backend/chamadaPadrao";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import Image from "next/image";
import "../../globals.css";

async function getPontosVenda(pagina: number) {
  const response = await chamadaAPI(
    `/pontovenda?page=${pagina}&size=10`,
    "GET"
  );

  if (!response) {
    console.error("Falha no carregamento dos pontos de venda");
    return [];
  }

  return response;
}

async function deletarPontoVenda(id: string) {
  const response = await chamadaAPI(
    `/pontovenda/${id}`,
    "DELETE"
  );

  if (!response) {
    console.error("Falha na exclusão do ponto de venda");
    return [];
  }

  return response.content;
}

async function deletar(formData: FormData) {
  'use server';

  const id = formData.get("id");

  if (typeof id !== "string" || !id) {
    console.error("Id do ponto de venda não informado para exclusão");
    return;
  }

  await deletarPontoVenda(id);

  revalidatePath("/organizador/ponto-venda");
}

export default async function OrgListPontoVenda(props: { searchParams?: Promise<{ pag?: string }> }) {
  const searchParams = await props.searchParams;
  const pagina = Number(searchParams?.pag ?? 0);

  const pontosVenda = await getPontosVenda(pagina);

  return (
    <div className="flex flex-row justify-center">
      <main className="w-4/5">
        <div className="mb-6 flex flex-row items-center justify-between">
          <h1 className="text-4xl">Pontos de Venda</h1>
          <Link href={"/organizador/ponto-venda/criar"}>
            <button className="flex cursor-pointer flex-row gap-2 rounded-2xl bg-blue-500 p-3 text-xl text-white">
              Criar Ponto de Venda
              <Image
                src={"/criar.png"}
                alt="icone mais"
                height={24}
                width={26}
              />
            </button>
          </Link>
        </div>

        <OrgLista
          data={pontosVenda.content}
          columns={[
            { header: "Nome", accessor: "nome" },
            { header: "Detalhes", accessor: "detalhes" },
            { header: "CEP", accessor: "endereco.cep" },
            { header: "Bairro", accessor: "endereco.bairro" },
            { header: "Rua", accessor: "endereco.rua" },
            { header: "Numero", accessor: "endereco.numero" },
          ]}
          editBasePath={"/organizador/ponto-venda"}
          deleteAction={deletar}
        />

        <Paginacao page={pagina} totalPages={pontosVenda.totalPages} />
      </main>
    </div>
  );
}
