import { chamadaAPI } from "../../backend/chamadaPadrao";
import "../globals.css";
import "./page.css";
import HeaderCard from "../_components/HeaderCard";
import Link from "next/link";
import { ListSearchBar } from "../_components/Organizador/ListSearchBar";
import { Paginacao } from "../_components/Paginacao";

const CATEGORIA_FILTER_OPTIONS = [
  { label: "Nome da categoria", value: "tag" },
];

const EMPTY_PAGE = {
  content: [],
  totalPages: 0,
};

type CategoriaItem = {
  id: number;
  tag: string;
};

type SearchParams = Promise<{
  pag?: string;
  q?: string;
}>;

async function getCategorias(pagina: number, termoBusca?: string) {
  const params = new URLSearchParams({
    page: pagina.toString(),
    size: "50",
  });

  if (termoBusca) {
    params.set("tag", termoBusca);
  }

  const response = await chamadaAPI(`/tag/filtro?${params.toString()}`, "GET");

  if (!response) {
    console.error("Falha no carregamento de categorias");
    return EMPTY_PAGE;
  }

  return response;
}

export default async function Categorias(props: { searchParams?: SearchParams }) {
  const searchParams = await props.searchParams;
  const pagina = Number(searchParams?.pag ?? 0);
  const termoBusca = searchParams?.q?.trim() ?? "";
  const categorias = await getCategorias(pagina, termoBusca);

  return (
    <div className="flex justify-center">
      <main className="w-3/5">
        <HeaderCard
          pageTitle="Catalogo"
          headerTitle="Categorias"
          details="Explore cidades e eventos com diversas categorias!"
          highlightLabel="Categorias cadastradas"
          highlightValue={categorias.content.length}
        />

        <ListSearchBar
          key={termoBusca}
          placeholder="Busque pelo nome da categoria"
          initialQuery={termoBusca}
          initialField={CATEGORIA_FILTER_OPTIONS[0].value}
          filterOptions={CATEGORIA_FILTER_OPTIONS}
        />

        <div className="mt-10 flex flex-row justify-center gap-2">
          {categorias.content.map((item: CategoriaItem) => (
            <Link
              key={item.id}
              href={`/categoria/${item.tag}`}
              className="cursor-pointer"
            >
              <div className="tag-card">
                <h3 className="text-lg">{item.tag}</h3>
              </div>
            </Link>
          ))}
        </div>

        <Paginacao
          page={pagina}
          totalPages={categorias.totalPages}
        />
      </main>
    </div>
  );
}
