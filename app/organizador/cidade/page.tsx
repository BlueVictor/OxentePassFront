
import { OrgLista } from "@/app/_components/Organizador/OrgLista";
import { Paginacao } from "@/app/_components/Paginacao";
import { chamadaAPI } from "../../../backend/chamadaPadrao";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import Image from "next/image";
import "../../globals.css";

async function getCidades (pagina: number) {
  const response = await chamadaAPI(
    `/cidade?page=${pagina}&size=10`,
    "GET"
  )

  if (!response) {
    console.error("Falha no carregamento das cidades")
    return []
  }

  return response
}

//Faz a comunicação com o back
async function deletarCidade (id: any) {
  const response = await chamadaAPI(
    `/cidade/${id}`,
    "DELETE"
  )

  if (!response) {
    console.error("Falha na exclusão de cidade")
    return []
  }

  return response.content
}

//Pega o dado da pagina de listagem
async function deletar(formData: FormData) {
  'use server';

  const id = formData.get('id');
  await deletarCidade(id);

  revalidatePath('/organizador/cidade');
}

export default async function OrgListCidade (props: any) {
  const searchParams = await props.searchParams;
  const pagina = Number(searchParams?.pag ?? 0);

  const cidades = await getCidades(pagina)

  return (
    <div className="flex flex-row justify-center">
      <main className="w-4/5">
        <div className="flex flex-row justify-between items-center mb-6">
          <h1 className="text-4xl">Cidades</h1>
          <Link
            href={"/organizador/cidade/criar"}
          >
            <button className="p-3 flex flex-row gap-2 bg-blue-500 text-white rounded-2xl cursor-pointer text-xl">
              Criar Cidade
              <Image 
                src={"/criar.png"}
                alt="icone mais"
                height={24}
                width={26}
              />
            </button>
          </Link>
        </div>

        <OrgLista
          data={cidades.content}
          columns={[
            { header: "Nome", accessor: "nome" },
            { header: "Descrição", accessor: "descricao" },
          ]}
          editBasePath={"/organizador/cidade"}
          deleteAction={deletar}
        />

        <Paginacao page={pagina} totalPages={cidades.totalPages}/>
      </main>
    </div>
  );
}
