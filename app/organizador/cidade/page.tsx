
import { OrgLista } from "@/app/_components/Organizador/OrgLista";
import { chamadaAPI } from "../../../backend/chamadaPadrao";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import Image from "next/image";
import "../../globals.css";

const pagina = 0

async function getCidades () {
  const response = await chamadaAPI(
    `/cidade?page=${pagina}&size=10`,
    "GET"
  )

  if (!response) {
    console.error("Falha no carregamento das cidades")
    return []
  }

  return response.content
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

export default async function OrgListCidade () {
  const cidades = await getCidades()

  return (
    <div className="flex flex-row justify-center">
      <main className="w-4/5">
        <div className="flex flex-row justify-between items-center">
          <h1 className="text-4xl mb-10">Cidades</h1>
          <Link
            href={"/organizador/cidade/criar"}
          >
            <button className="p-3 flex flex-row gap-2 bg-blue-500 text-white rounded-2xl cursor-pointer text-xl">
              Criar Cidade
              <Image 
                src={"/criar.png"}
                alt="icone mais"
                height={24}
                width={24}
              />
            </button>
          </Link>
        </div>

        <OrgLista
          data={cidades}
          columns={[
            { header: "Nome", accessor: "nome" },
            { header: "Descrição", accessor: "descricao" },
          ]}
          editBasePath={"/organizador/cidade"}
          deleteAction={deletar}
        />
      </main>
    </div>
  );
}
