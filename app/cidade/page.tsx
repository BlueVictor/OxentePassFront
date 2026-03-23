
import { chamadaAPI } from "../../backend/chamadaPadrao";
import HeaderCard from "../_components/HeaderCard";
import { CidadeCard } from "../_components/Cidade/CidadeCard";
import { Paginacao } from "../_components/Paginacao";
import "../globals.css";
import "./page.css";

async function getCidades (pagina: number) {
  const response = await chamadaAPI(
    `/cidade?page=${pagina}&size=6`,
    "GET"
  )

  if (!response) {
    console.error("Falha no carregamento de cidades")
    return []
  }

  return response
}

export default async function cidades (props: any) {
  const searchParams = await props.searchParams;
  const pagina = Number(searchParams?.pag ?? 0);
  
  const cidades = await getCidades(pagina)

  return (
    <div className="flex justify-center">
      <main className="w-3/5">
        <HeaderCard
          pageTitle="Catalogo"
          headerTitle="Cidades"
          details="Verifique os eventos nas suas cidades favoritas!"
          highlightLabel="Cidades cadastradas"
          highlightValue={cidades.content.length}
        />

        <div className="flex flex-row flex-wrap mt-5 mb-3 gap-4 justify-center">
          {cidades.content.map((item: any) => (
            <CidadeCard key={item.id} item={item} />
          ))}
        </div>

        <Paginacao
          page={pagina}
          totalPages={cidades.totalPages}
        />
      </main>
    </div>
  );
}
