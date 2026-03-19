
import { chamadaAPI } from "../../../backend/chamadaPadrao";
import HeaderCard from "@/app/_components/HeaderCard";
import { EventoCard } from "@/app/_components/EventoCard";
import "../../globals.css";

const pagina = 0

async function getCidade (idCidade: string) {
  const response = await chamadaAPI(
    `/cidade/filtro?id=${idCidade}`,
    "GET"
  )

  if (!response) {
    console.error("Falha no carregamento da cidade")
    return
  }

  return response.content
}

async function getEventosCidade (cidade: string) {
  const response = await chamadaAPI(
    `/evento/comImg?cidade=${cidade}&page=${pagina}&size=6`,
    "GET"
  )

  if (!response) {
    console.error("Falha no carregamento de eventos")
    return []
  }

  return response.content
}


export default async function cidade ({ params }: { params: { id: string } }) {
  const {id} = await params
  const cidadeTmp = await getCidade(id)
  const cidade = cidadeTmp[0]
  const eventos = await getEventosCidade(cidade.nome)

  return (
    <div className="flex justify-center">
      <main className="w-17/20">
        <HeaderCard
          pageTitle="Cidade"
          headerTitle={cidade.nome}
          details={cidade.descricao}
          highlightLabel="Eventos cadastrados"
          highlightValue={eventos.length}
        />

        <div className="flex flex-row flex-wrap mt-5 gap-4 justify-center">
          {eventos.map((item: any) => (
            <EventoCard key={item.id} item={item} />
          ))}
        </div>
      </main>
    </div>
  );
}
