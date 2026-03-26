import { OrgLista } from "@/app/_components/Organizador/OrgLista";
import { Paginacao } from "@/app/_components/Paginacao";
import { chamadaAPI } from "../../../backend/chamadaPadrao";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import Image from "next/image";
import "../../globals.css";
import { ListSearchBar } from "@/app/_components/Organizador/ListSearchBar";

const CIDADE_FILTER_OPTIONS = [
  { label: "Nome", value: "nome" },
  { label: "Categoria", value: "tag" },
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
  return CIDADE_FILTER_OPTIONS.some((option) => option.value === campo)
    ? campo
    : CIDADE_FILTER_OPTIONS[0].value;
}

async function getCidades(pagina: number, campo?: string, termoBusca?: string) {
  const params = new URLSearchParams({
    page: pagina.toString(),
    size: "10",
  });

  if (termoBusca && campo) {
    params.set(campo, termoBusca);
  }

  const response = await chamadaAPI(`/cidade/filtro?${params.toString()}`, "GET");

  if (!response) {
    console.error("Falha no carregamento das cidades");
    return EMPTY_PAGE;
  }

  return response;
}

async function deletarCidade(id: string) {
  const response = await chamadaAPI(`/cidade/${id}`, "DELETE");

  if (!response) {
    console.error("Falha na exclusão de cidade")
    return null;
  }

  return response.content;
}

async function deletar(formData: FormData) {
  'use server';

  const id = formData.get("id");

  if (typeof id !== "string" || !id) {
    console.error("Id da cidade não informado para exclusão");
    return;
  }

  await deletarCidade(id);

  revalidatePath("/organizador/cidade");
}

export default async function OrgListCidade(props: { searchParams?: SearchParams }) {
  const searchParams = await props.searchParams;
  const pagina = Number(searchParams?.pag ?? 0);
  const termoBusca = searchParams?.q?.trim() ?? "";
  const campo = termoBusca ? normalizarCampo(searchParams?.campo) : CIDADE_FILTER_OPTIONS[0].value;
  const cidades = await getCidades(pagina, campo, termoBusca);

  return (
    <div className="flex flex-row justify-center">
      <main className="w-4/5">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <h1 className="text-4xl">Cidades</h1>
          <Link href={"/organizador/cidade/criar"}>
            <button className="flex cursor-pointer flex-row gap-2 rounded-2xl bg-blue-500 p-3 text-xl text-white">
              Criar Cidade
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
          placeholder="Busque por nome da cidade ou categoria"
          initialQuery={termoBusca}
          initialField={campo}
          filterOptions={CIDADE_FILTER_OPTIONS}
        />

        <OrgLista
          data={cidades.content}
          columns={[
            { header: "Nome", accessor: "nome" },
            { header: "Descrição", accessor: "descricao" },
          ]}
          editBasePath={"/organizador/cidade"}
          deleteAction={deletar}
        />

        <Paginacao page={pagina} totalPages={cidades.totalPages} />
      </main>
    </div>
  );
}
