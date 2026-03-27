import { OrgLista } from "@/app/_components/Organizador/OrgLista";
import { Paginacao } from "@/app/_components/Paginacao";
import { chamadaAPI } from "../../../backend/chamadaPadrao";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import Image from "next/image";
import "../../globals.css";
import { ListSearchBar } from "@/app/_components/Organizador/ListSearchBar";

const EVENTO_FILTER_OPTIONS = [
  { label: "Nome", value: "nome" },
  { label: "Cidade", value: "cidade" },
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
  return EVENTO_FILTER_OPTIONS.some((option) => option.value === campo)
    ? campo
    : EVENTO_FILTER_OPTIONS[0].value;
}

async function getEventos(pagina: number, campo?: string, termoBusca?: string) {
  const params = new URLSearchParams({
    page: pagina.toString(),
    size: "10",
  });

  if (termoBusca && campo) {
    params.set(campo, termoBusca);
  }

  const response = await chamadaAPI(`/evento/filtro?${params.toString()}`, "GET");

  if (!response) {
    console.error("Falha no carregamento dos eventos");
    return EMPTY_PAGE;
  }

  return response;
}

async function deletarEvento(id: string) {
  const response = await chamadaAPI(`/evento/${id}`, "DELETE");

  if (!response) {
    console.error("Falha na exclusão do evento");
    return null;
  }

  return response.content;
}

async function deletar(formData: FormData) {
  'use server';

  const id = formData.get("id");

  if (typeof id !== "string" || !id) {
    console.error("Id do evento não informado para exclusão");
    return;
  }

  await deletarEvento(id);

  revalidatePath("/organizador/evento");
}

export default async function OrgListEvento(props: { searchParams?: SearchParams }) {
  const searchParams = await props.searchParams;
  const pagina = Number(searchParams?.pag ?? 0);
  const termoBusca = searchParams?.q?.trim() ?? "";
  const campo = termoBusca ? normalizarCampo(searchParams?.campo) : EVENTO_FILTER_OPTIONS[0].value;
  const eventos = await getEventos(pagina, campo, termoBusca);

  return (
    <div className="flex flex-row justify-center">
      <main className="w-4/5">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <h1 className="text-4xl">Eventos</h1>
          <Link href={"/organizador/evento/criar"}>
            <button className="flex cursor-pointer flex-row gap-2 rounded-2xl bg-blue-500 p-3 text-xl text-white">
              Criar Evento
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
          placeholder="Busque por nome, cidade ou categoria"
          initialQuery={termoBusca}
          initialField={campo}
          filterOptions={EVENTO_FILTER_OPTIONS}
        />

        <OrgLista
          data={eventos.content}
          columns={[
            { header: "Nome", accessor: "nome" },
            { header: "Descrição", accessor: "descricao" }, 
            { header: "Cidade", accessor: "cidade.nome" }, 
            { header: "Início", accessor: "dataHoraInicio", type: "date"}, 
            { header: "Fim", accessor: "dataHoraFim", type: "date"}, 
          ]}
          editBasePath={"/organizador/evento"}
          deleteAction={deletar}
          subEventSupport={true}
        />

        <Paginacao page={pagina} totalPages={eventos.totalPages} />
      </main>
    </div>
  );
}
