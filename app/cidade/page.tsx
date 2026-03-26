import { chamadaAPI } from "../../backend/chamadaPadrao";
import HeaderCard from "../_components/HeaderCard";
import { CidadeCard } from "../_components/Cidade/CidadeCard";
import { Paginacao } from "../_components/Paginacao";
import { ListSearchBar } from "../_components/Organizador/ListSearchBar";
import "../globals.css";
import "./page.css";

const CIDADE_FILTER_OPTIONS = [
  { label: "Nome", value: "nome" },
  { label: "Categoria", value: "tag" },
];

const EMPTY_PAGE = {
  content: [],
  totalPages: 0,
};

type CidadeItem = {
  id: number;
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
    size: "6",
  });

  if (termoBusca && campo) {
    params.set(campo, termoBusca);
  }

  const response = await chamadaAPI(`/cidade/filtro?${params.toString()}`, "GET");

  if (!response) {
    console.error("Falha no carregamento de cidades");
    return EMPTY_PAGE;
  }

  return response;
}

export default async function Cidades(props: { searchParams?: SearchParams }) {
  const searchParams = await props.searchParams;
  const pagina = Number(searchParams?.pag ?? 0);
  const termoBusca = searchParams?.q?.trim() ?? "";
  const campo = termoBusca ? normalizarCampo(searchParams?.campo) : CIDADE_FILTER_OPTIONS[0].value;
  const cidades = await getCidades(pagina, campo, termoBusca);

  return (
    <div className="flex justify-center">
      <main className="w-3/5">
        <HeaderCard
          pageTitle="Catalogo"
          headerTitle="Cidades"
          details="Verifique os eventos nas suas cidades favoritas!"
          highlightLabel="Cidades cadastradas"
          highlightValue={cidades.content.length}
        />

        <ListSearchBar
          key={`${campo}:${termoBusca}`}
          placeholder="Busque por nome da cidade ou categoria"
          initialQuery={termoBusca}
          initialField={campo}
          filterOptions={CIDADE_FILTER_OPTIONS}
        />

        <div className="mb-3 mt-5 flex flex-row flex-wrap justify-center gap-4">
          {cidades.content.map((item: CidadeItem) => (
            <CidadeCard key={item.id} item={item} />
          ))}
        </div>

        <Paginacao
          page={pagina}
          totalPages={cidades.totalPages}
        />
      </main>
    </div>
  );
}
