
import { chamadaAPI } from "../../../backend/chamadaPadrao";
import Link from 'next/link';
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
    `/evento/filtro?cidade=${cidade}&page=${pagina}&size=6`,
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
    <div>
      <main>
        <div className="titulo">{cidade.nome}</div>
        <p>{cidade.descricao}</p>

        <div className="flex flex-row flex-wrap mt-5 gap-4 justify-center">
          {eventos.map((item: any) => (
            <Link
              key={item.id} 
              href={`/evento/${item.id}`}
              className="cursor-pointer"
            >
              <div className="evento-card">
                <h2 className="text-lg">{item.nome}</h2>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
