import { OrgLista } from "@/app/_components/Organizador/OrgLista";
import { Paginacao } from "@/app/_components/Paginacao";
import { chamadaAPI } from "../../../backend/chamadaPadrao";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import Image from "next/image";
import "../../globals.css";
import { ListSearchBar } from "@/app/_components/Organizador/ListSearchBar";

const PONTO_VENDA_FILTER_OPTIONS = [
  { label: "Nome", value: "nome" },
  { label: "Detalhes", value: "detalhes" },
  { label: "CEP", value: "cep" },
  { label: "Bairro", value: "bairro" },
  { label: "Rua", value: "rua" },
];

const EMPTY_PAGE = {
  content: [],
  totalPages: 0,
};

type SearchParams = Promise<{
  pag?: string;
  q?: string;
  campo?: string;
}>;

function normalizarCampo(campo?: string) {
  return PONTO_VENDA_FILTER_OPTIONS.some((option) => option.value === campo)
    ? campo
    : PONTO_VENDA_FILTER_OPTIONS[0].value;
}

async function getPontosVenda(pagina: number, campo?: string, termoBusca?: string) {
  const params = new URLSearchParams({
    page: pagina.toString(),
    size: "10",
  });

  if (termoBusca && campo) {
    params.set(campo, termoBusca);
  }

  const response = await chamadaAPI(`/pontovenda/filtro?${params.toString()}`, "GET");

  if (!response) {
    console.error("Falha no carregamento dos pontos de venda");
    return EMPTY_PAGE;
  }

  return response;
}

async function deletarPontoVenda(id: string) {
  const response = await chamadaAPI(`/pontovenda/${id}`, "DELETE");

  if (!response) {
    console.error("Falha na exclusão do ponto de venda");
    return null;
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

export default async function OrgListPontoVenda(props: { searchParams?: SearchParams }) {
  const searchParams = await props.searchParams;
  const pagina = Number(searchParams?.pag ?? 0);
  const termoBusca = searchParams?.q?.trim() ?? "";
  const campo = termoBusca ? normalizarCampo(searchParams?.campo) : PONTO_VENDA_FILTER_OPTIONS[0].value;
  const pontosVenda = await getPontosVenda(pagina, campo, termoBusca);

  return (
    <div className="flex flex-row justify-center">
      <main className="w-4/5">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
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

        <ListSearchBar
          key={`${campo}:${termoBusca}`}
          placeholder="Busque por nome, detalhes, CEP, bairro ou rua"
          initialQuery={termoBusca}
          initialField={campo}
          filterOptions={PONTO_VENDA_FILTER_OPTIONS}
        />

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
