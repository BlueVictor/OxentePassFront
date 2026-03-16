
import { chamadaAPI } from "../backend/chamadaPadrao";
import Link from 'next/link';
import "./globals.css";

async function getEventos () {
  const response = await chamadaAPI(
    "/evento?size=3",
    "GET"
  )

  if (!response) {
    console.error("Falha no carregamento de eventos")
    return []
  }

  return response.content
}

export default async function home() {
  const eventos = await getEventos()

  return (
    <div>
      <main>
        <div className="titulo">Eventos</div>
        <div className="flex flex-row mt-5 gap-4 justify-center">
          {eventos.map((item: any) => (
            <Link 
              href={`/evento/${item.id}`}
              className="cursor-pointer"
            >
              <div className="evento-card">
                {item.nome}
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
