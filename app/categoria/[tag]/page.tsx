
import { CidadeCard } from "@/app/_components/CidadeCard";
import { chamadaAPI } from "../../../backend/chamadaPadrao";
import { EventoCard } from "../../_components/EventoCard";
import "../../globals.css";
import HeaderCard from "@/app/_components/HeaderCard";

const paginaEventos = 0
const paginaCidades = 0

async function getEventos (tag: string) {
  const response = await chamadaAPI(
    `/evento/comImg?tag=${tag}&page=${paginaEventos}&size=6`,
    "GET"
  )

  if (!response) {
    console.error("Falha no carregamento de eventos")
    return []
  }

  return response.content
}

async function getCidades (tag: string) {
  const response = await chamadaAPI(
    `/cidade/filtro?tag=${tag}&page=${paginaCidades}&size=8`,
    "GET"
  )

  if (!response) {
    console.error("Falha no carregamento de cidades")
    return []
  }

  return response.content
}

export default async function categoria ({ params }: { params: { tag: string } }) {
  const {tag} = await params
  const eventos = await getEventos(tag)
  const cidades = await getCidades(tag)

  return (
    <div className="flex justify-center">
      <main className="w-17/20">
        <HeaderCard
          pageTitle="Categoria"
          headerTitle={tag}
          details={`Veja eventos e cidades com a categoria ${tag}`}
          highlightLabel="Itens da categoria"
          highlightValue={eventos.length + cidades.length}
        />
        {/* Eventos ativos */}
        <h2 className="text-3xl mt-10">Eventos</h2>
        <div className="flex flex-row flex-wrap mt-5 gap-4 justify-center">
          {eventos.map((item: any) => (
            <EventoCard key={item.id} item={item} />
          ))}
        </div>

        {/* Eventos futuros */}
        <h2 className="text-3xl mt-10">Cidades</h2>
        <div className="flex flex-row flex-wrap mt-5 gap-4 justify-center">
          {cidades.map((item: any) => (
            <CidadeCard key={item.id} item={item} />
          ))}
        </div>
      </main>
    </div>
  );
}
