import { chamadaAPI } from "../backend/chamadaPadrao";
import { EventoCard } from "./_components/EventoCard";
import { Paginacao } from "./_components/Paginacao";
import { ListSearchBar } from "./_components/Organizador/ListSearchBar";
import "./globals.css";

const EVENTO_FILTER_OPTIONS = [
  { label: "Nome do evento", value: "nome" },
  { label: "Cidade", value: "cidade" },
  { label: "Categoria", value: "tag" },
];

const EMPTY_PAGE = {
  content: [],
  totalPages: 0,
};

type EventoItem = {
  id: number;
};

type SearchParams = Promise<{
  pag?: string;
  pag1?: string;
  pag2?: string;
  q?: string;
  campo?: string;
}>;

function normalizarCampo(campo?: string) {
  return EVENTO_FILTER_OPTIONS.some((option) => option.value === campo)
    ? campo
    : EVENTO_FILTER_OPTIONS[0].value;
}

async function getEventosAtivos(paginaAtivos: number) {
  const data = new Date().toISOString().slice(0, 19);

  const response = await chamadaAPI(
    `/evento/comImg?ativos=${data}&page=${paginaAtivos}&size=3`,
    "GET"
  );

  if (!response) {
    console.error("Falha no carregamento de eventos");
    return EMPTY_PAGE;
  }

  return response;
}

async function getEventosFuturos(paginaFuturos: number) {
  const data = new Date().toISOString().slice(0, 19);

  const response = await chamadaAPI(
    `/evento/comImg?naoIniciados=${data}&page=${paginaFuturos}&size=3`,
    "GET"
  );

  if (!response) {
    console.error("Falha no carregamento de eventos");
    return EMPTY_PAGE;
  }

  return response;
}

async function getEventosBusca(pagina: number, campo?: string, termoBusca?: string) {
  const params = new URLSearchParams({
    page: pagina.toString(),
    size: "6",
  });

  if (termoBusca && campo) {
    params.set(campo, termoBusca);
  }

  const response = await chamadaAPI(`/evento/comImg?${params.toString()}`, "GET");

  if (!response) {
    console.error("Falha no carregamento da busca de eventos");
    return EMPTY_PAGE;
  }

  return response;
}

export default async function Home(props: { searchParams?: SearchParams }) {
  const searchParams = await props.searchParams;
  const termoBusca = searchParams?.q?.trim() ?? "";
  const buscaAtiva = termoBusca.length > 0;
  const campo = buscaAtiva ? normalizarCampo(searchParams?.campo) : EVENTO_FILTER_OPTIONS[0].value;

  if (buscaAtiva) {
    const paginaBusca = Number(searchParams?.pag ?? 0);
    const eventosBusca = await getEventosBusca(paginaBusca, campo, termoBusca);

    return (
      <div className="flex flex-row justify-center">
        <main className="w-17/20">
          <ListSearchBar
            key={`${campo}:${termoBusca}`}
            placeholder="Busque eventos por nome, cidade ou categoria"
            initialQuery={termoBusca}
            initialField={campo}
            filterOptions={EVENTO_FILTER_OPTIONS}
          />

          <h1 className="titulo">Resultados da busca</h1>
          <div className="mb-3 mt-5 flex flex-row flex-wrap justify-center gap-4">
            {eventosBusca.content.map((item: EventoItem) => (
              <EventoCard key={item.id} item={item} />
            ))}
          </div>

          <Paginacao
            page={paginaBusca}
            totalPages={eventosBusca.totalPages}
          />
        </main>
      </div>
    );
  }

  const pagina1 = Number(searchParams?.pag1 ?? 0);
  const pagina2 = Number(searchParams?.pag2 ?? 0);
  const eventosAtivos = await getEventosAtivos(pagina1);
  const eventosFuturos = await getEventosFuturos(pagina2);

  return (
    <div className="flex flex-row justify-center">
      <main className="w-17/20">
        <ListSearchBar
          key="home-search"
          placeholder="Busque eventos por nome, cidade ou categoria"
          initialQuery=""
          initialField={EVENTO_FILTER_OPTIONS[0].value}
          filterOptions={EVENTO_FILTER_OPTIONS}
        />

        <h1 className="titulo">Acontecendo agora</h1>
        <div className="mb-3 mt-5 flex flex-row flex-wrap justify-center gap-4">
          {eventosAtivos.content.map((item: EventoItem) => (
            <EventoCard key={item.id} item={item} />
          ))}
        </div>

        <Paginacao
          page={pagina1}
          totalPages={eventosAtivos.totalPages}
          index="pag1"
        />

        <h1 className="titulo">Não perca o que vem por ai!</h1>
        <div className="mb-3 mt-5 flex flex-row flex-wrap justify-center gap-4">
          {eventosFuturos.content.map((item: EventoItem) => (
            <EventoCard key={item.id} item={item} />
          ))}
        </div>

        <Paginacao
          page={pagina2}
          totalPages={eventosFuturos.totalPages}
          index="pag2"
        />
      </main>
    </div>
  );
}
