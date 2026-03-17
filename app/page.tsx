
import { chamadaAPI } from "../backend/chamadaPadrao";
import Link from 'next/link';
import Image from "next/image";
import "./globals.css";

const pagina = 0

async function getEventos () {
  const response = await chamadaAPI(
    `/evento?page=${pagina}&size=3`,
    "GET"
  )

  if (!response) {
    console.error("Falha no carregamento de eventos")
    return []
  }

  return response.content
}

async function getImagemEvento (idEvento: string) {
  const response = await chamadaAPI(
    `/evento/${idEvento}/imagens`,
    "GET"
  )

  if (!response) {
    console.error("Falha no carregamento de imagens")
    return
  }

  if (response.empty == true){
    return {
      chaveS3: "/next.svg", 
      nome: "imagem placeholder" 
    }
  }
  else {
    return response.content[0]
  }
}

function getURL(dado: string) {
  if (dado.charAt(0) == '/') {
    return dado
  }
  else {
    return `${process.env.NEXT_PUBLIC_AWS_BASE_LINK}${dado}`
  }
}

export default async function home() {
  const eventos = await getEventos()

  const eventosComImagem = await Promise.all(
    eventos.map(async (evento: any) => {
      const imagens = await getImagemEvento(evento.id)

      return {
        ...evento,
        imagem: imagens
      }
    })
  )

  return (
    <div>
      <main>
        <div className="titulo">Eventos</div>
        <div className="flex flex-row flex-wrap mt-5 gap-4 justify-center">
          {eventosComImagem.map((item: any) => (
            <Link
              key={item.id} 
              href={`/evento/${item.id}`}
              className="cursor-pointer"
            >
              <div className="evento-card">
                <Image
                  src={getURL(item.imagem.chaveS3)}
                  alt={item.imagem.nome}
                  width={200}
                  height={100}
                />
                <h2 className="text-lg">{item.nome}</h2>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
