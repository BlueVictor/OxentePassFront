
import { chamadaAPI } from "../../backend/chamadaPadrao";
import Link from 'next/link';
import "../globals.css";

const pagina = 0

async function getCidades () {
  const response = await chamadaAPI(
    `/cidade?page=${pagina}&size=20`,
    "GET"
  )

  if (!response) {
    console.error("Falha no carregamento de cidades")
    return []
  }

  return response.content
}

export default async function cidades () {
  const cidades = await getCidades()

  return (
    <div>
      <main>
        <div className="titulo">Cidades</div>
        <div className="flex flex-row flex-wrap mt-5 gap-4 justify-center">
          {cidades.map((item: any) => (
            <Link
              key={item.id} 
              href={`/cidade/${item.id}`}
              className="cursor-pointer"
            >
              <div className="cidade-card">
                <h2 className="text-lg">{item.nome}</h2>
                <p className="mt-2">{item.descricao}</p>

                <div className="flex flex-row gap-1.5 justify-center mt-2">
                  {item.tags.map((tag: any) => (
                    <div key={tag.id} className="tag-card">
                      {tag.tag}
                    </div>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
