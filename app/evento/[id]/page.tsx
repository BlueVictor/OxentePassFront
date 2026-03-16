
import { chamadaAPI } from "../../../backend/chamadaPadrao";
import "../../globals.css";


async function getEvento (idEvento: string) {
  const response = await chamadaAPI(
    `/evento/filtro?id=${idEvento}`,
    "GET"
  )

  if (!response) {
    console.error("Falha no carregamento de eventos")
    return
  }

  return response.content
}

function converterData (dataAlvo: string) {
    return new Date(dataAlvo).toLocaleString()
}

export default async function Evento ({ params }: { params: { id: string } }) {
  const {id} = await params
  const eventoTmp = await getEvento(id)
  const evento = eventoTmp[0]

  return (
    <div>
      <main>
        <div className="titulo">{evento.nome}</div>
        <p>{evento.descricao}</p>
        <p>Localidade: {evento.cidade.nome}, {evento.endereco.bairro}</p>
        <p>Data: {converterData(evento.dataHoraInicio)} - {converterData(evento.dataHoraFim)}</p>
      </main>
    </div>
  );
}
