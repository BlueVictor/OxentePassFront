
import { chamadaAPI } from "../../backend/chamadaPadrao";
import "../globals.css";
import "./page.css";
import HeaderCard from "../_components/HeaderCard";
import { CidadeCard } from "../_components/CidadeCard";

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
    <div className="flex justify-center">
      <main className="w-3/5">
        <HeaderCard
          pageTitle="Catalogo"
          headerTitle="Cidades"
          details="Verifique os eventos nas suas cidades favoritas!"
          highlightLabel="Cidades cadastradas"
          highlightValue={cidades.length}
        />

        <div className="flex flex-row flex-wrap mt-5 gap-4 justify-center">
          {cidades.map((item: any) => (
            <CidadeCard key={item.id} item={item} />
          ))}
        </div>
      </main>
    </div>
  );
}
