
import { chamadaAPI } from "../backend/chamadaPadrao";
import Link from 'next/link';
import Image from "next/image";
import "./globals.css";

const pagina = 0

async function getEventos () {
  const response = await chamadaAPI(
    `/evento/comImg?page=${pagina}&size=3`,
    "GET"
  )

  if (!response) {
    console.error("Falha no carregamento de eventos")
    return []
  }

  return response.content
}

function getURL(dado: string) {
  return `${process.env.NEXT_PUBLIC_AWS_BASE_LINK}${dado}`
}

export default async function home() {
  const eventos = await getEventos()

  return (
    <div>
      <main>
        <div className="titulo">Eventos</div>
        <div className="flex flex-row flex-wrap mt-5 gap-4 justify-center">
          {eventos.map((item: any) => (
            <Link
              key={item.id} 
              href={`/evento/${item.id}`}
              className="cursor-pointer"
            >
              <div className="evento-card">
                <Image
                  src={item.imagem ? getURL(item.imagem.chaveS3) : "/placeholder.png"}
                  alt={item.imagem?.nome || "placeholder"}
                  width={300}
                  height={250}
                  className="object-cover rounded"
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
