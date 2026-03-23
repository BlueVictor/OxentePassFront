
import { OrgLista } from "@/app/_components/Organizador/OrgLista";
import { Paginacao } from "@/app/_components/Paginacao";
import { chamadaAPI } from "../../../backend/chamadaPadrao";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import Image from "next/image";
import "../../globals.css";

async function getEventos (pagina: number) {
  const response = await chamadaAPI(
    `/evento?page=${pagina}&size=10`, //to do: listar somente os eventos do organizador logado
    "GET"
  )

  if (!response) {
    console.error("Falha no carregamento dos eventos")
    return []
  }

  return response
}

//Faz a comunicação com o back
async function deletarEvento (id: any) {
  const response = await chamadaAPI(
    `/evento/${id}`,
    "DELETE"
  )

  if (!response) {
    console.error("Falha na exclusão do evento")
    return
  }

  return response.content
}

//Pega o dado da pagina de listagem
async function deletar(formData: FormData) {
  'use server';

  const id = formData.get('id');
  await deletarEvento(id);

  revalidatePath('/organizador/evento');
}

export default async function OrgListEvento (props: any) {
  const searchParams = await props.searchParams;
  const pagina = Number(searchParams?.pag ?? 0);

  const eventos = await getEventos(pagina)

  return (
    <div className="flex flex-row justify-center">
      <main className="w-4/5">
        <div className="flex flex-row justify-between items-center mb-6">
          <h1 className="text-4xl">Eventos</h1>
          <Link
            href={"/organizador/evento/criar"}
          >
            <button className="p-3 flex flex-row gap-2 bg-blue-500 text-white rounded-2xl cursor-pointer text-xl">
              Criar Evento
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
          data={eventos.content}
          columns={[
            { header: "Nome", accessor: "nome" },
            { header: "Descrição", accessor: "descricao" }, 
            { header: "Cidade", accessor: "cidade.nome" }, 
            { header: "Início", accessor: "dataHoraInicio", type: "date"}, 
            { header: "Fim", accessor: "dataHoraFim", type: "date"}, 
          ]}
          editBasePath={"/organizador/evento"}
          deleteAction={deletar}
          subEventSupport={true}
        />

        <Paginacao page={pagina} totalPages={eventos.totalPages}/>
      </main>
    </div>
  );
}
