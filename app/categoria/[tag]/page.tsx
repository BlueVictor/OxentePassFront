
import { CidadeCard } from "@/app/_components/Cidade/CidadeCard";
import { chamadaAPI } from "../../../backend/chamadaPadrao";
import { EventoCard } from "../../_components/EventoCard";
import "../../globals.css";
import HeaderCard from "@/app/_components/HeaderCard";
import { Paginacao } from "@/app/_components/Paginacao";

async function getEventos (tag: string, pagina: number) {
  const response = await chamadaAPI(
    `/evento/comImg?tag=${tag}&page=${pagina}&size=6`,
    "GET"
  )

  if (!response) {
    console.error("Falha no carregamento de eventos")
    return []
  }

  return response
}

async function getCidades (tag: string, pagina: number) {
  const response = await chamadaAPI(
    `/cidade/filtro?tag=${tag}&page=${pagina}&size=4`,
    "GET"
  )

  if (!response) {
    console.error("Falha no carregamento de cidades")
    return []
  }

  return response
}

export default async function categoria (props: any) {
  const {tag} = await props.params
  const searchParams = await props.searchParams;
  const paginaEvento = Number(searchParams?.pagEvento ?? 0);
  const paginaCidade = Number(searchParams?.pagCidade ?? 0);

  const eventos = await getEventos(tag, paginaEvento)
  const cidades = await getCidades(tag, paginaCidade)

  return (
    <div className="flex justify-center">
      <main className="w-17/20">
        <HeaderCard
          pageTitle="Categoria"
          headerTitle={tag}
          details={`Veja eventos e cidades com a categoria ${tag}`}
          highlightLabel="Itens da categoria"
          highlightValue={eventos.content.length + cidades.content.length}
        />
        {/* Eventos ativos */}
        <h2 className="text-3xl mt-10">Eventos</h2>
        <div className="flex flex-row flex-wrap mt-5 mb-3 gap-4 justify-center">
          {eventos.content.map((item: any) => (
            <EventoCard key={item.id} item={item} />
          ))}
        </div>

        <Paginacao 
          page={paginaEvento} 
          totalPages={eventos.totalPages} 
          index="pagEvento"
        />

        {/* Eventos futuros */}
        <h2 className="text-3xl mt-10">Cidades</h2>
        <div className="flex flex-row flex-wrap mt-5 mb-3 gap-4 justify-center">
          {cidades.content.map((item: any) => (
            <CidadeCard key={item.id} item={item} />
          ))}
        </div>

        <Paginacao 
          page={paginaCidade} 
          totalPages={cidades.totalPages} 
          index="pagCidade"
        />
      </main>
    </div>
  );
}
