
import { chamadaAPI } from "../../../backend/chamadaPadrao";
import "../../globals.css";

const pagina = 0

async function getCidades () {
  const response = await chamadaAPI(
    `/cidade?page=${pagina}&size=10`,
    "GET"
  )

  if (!response) {
    console.error("Falha no carregamento de eventos")
    return []
  }

  return response.content
}

export default async function orgListCidade () {
  const cidades = await getCidades()

  return (
    <div>
      <main>
        <h1 className="titulo">Cidades</h1>
        <div className="flex flex-col flex-wrap mt-5 gap-4 justify-center">
          {cidades.map((item: any) => (
            <div key={item.id} className="flex flex-row gap-5">
                <p>ID: {item.id}</p>
                <p>Nome: {item.nome}</p>
                <hr className="text-black"/>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
