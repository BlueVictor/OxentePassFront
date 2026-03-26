import { OrgLista } from "@/app/_components/Organizador/OrgLista";
import { Paginacao } from "@/app/_components/Paginacao";
import { chamadaAPI } from "../../../backend/chamadaPadrao";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import Image from "next/image";
import "../../globals.css";
import { ListSearchBar } from "@/app/_components/Organizador/ListSearchBar";

const CATEGORIA_FILTER_OPTIONS = [
  { label: "Nome da categoria", value: "tag" },
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

async function getCategorias(pagina: number, termoBusca?: string) {
  const params = new URLSearchParams({
    page: pagina.toString(),
    size: "10",
  });

  if (termoBusca) {
    params.set("tag", termoBusca);
  }

  const response = await chamadaAPI(`/tag/filtro?${params.toString()}`, "GET");

  if (!response) {
    console.error("Falha no carregamento das categorias");
    return EMPTY_PAGE;
  }

  return response;
}

async function deletarCategoria(id: string) {
  const response = await chamadaAPI(`/tag/${id}`, "DELETE");

  if (!response) {
    console.error("Falha na exclusão da categoria")
    return null;
  }

  return response.content;
}

async function deletar(formData: FormData) {
  'use server';

  const id = formData.get("id");

  if (typeof id !== "string" || !id) {
    console.error("Id da categoria não informado para exclusão");
    return;
  }

  await deletarCategoria(id);

  revalidatePath("/organizador/categoria");
}

export default async function OrgListCategoria(props: { searchParams?: SearchParams }) {
  const searchParams = await props.searchParams;
  const pagina = Number(searchParams?.pag ?? 0);
  const termoBusca = searchParams?.q?.trim() ?? "";
  const categorias = await getCategorias(pagina, termoBusca);

  return (
    <div className="flex flex-row justify-center">
      <main className="w-4/5">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <h1 className="text-4xl">Categorias</h1>
          <Link href={"/organizador/categoria/criar"}>
            <button className="flex cursor-pointer flex-row gap-2 rounded-2xl bg-blue-500 p-3 text-xl text-white">
              Criar Categoria
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
          key={termoBusca}
          placeholder="Busque pelo nome da categoria"
          initialQuery={termoBusca}
          initialField={CATEGORIA_FILTER_OPTIONS[0].value}
          filterOptions={CATEGORIA_FILTER_OPTIONS}
        />

        <OrgLista
          data={categorias.content}
          columns={[
            { header: "Nome", accessor: "tag" },
          ]}
          deleteAction={deletar}
        />

        <Paginacao page={pagina} totalPages={categorias.totalPages} />
      </main>
    </div>
  );
}
