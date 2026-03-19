
import { chamadaAPI } from "../../../backend/chamadaPadrao";
import { getS3URL, converterDataHora } from "../../../funcoes/helpers";
import Image from "next/image";
import Link from "next/link";
import "../../globals.css";
import "./page.css"
import PontoVendaCard from "@/app/_components/PontoVendaCard";

async function getEvento (idEvento: string) {
  const response = await chamadaAPI(
    `/evento/filtro?id=${idEvento}`,
    "GET"
  )

  if (!response) {
    console.error("Falha no carregamento do evento")
    return
  }

  return response.content
}

async function getImagens (idEvento: string) {
  const response = await chamadaAPI(
    `/evento/${idEvento}/imagens`,
    "GET"
  )

  if (!response) {
    console.error("Falha no carregamento das imagens")
    return []
  }

  return response.content
}

export default async function Evento ({ params }: { params: { id: string } }) {
  const {id} = await params
  const eventoTmp = await getEvento(id)
  const evento = eventoTmp[0]
  const imagens = await getImagens(id)

  return (
    <div className="flex justify-center">
      <main className="flex flex-row relative w-7/10">
        <div> {/* Lado "esquerdo" */}
          {/* Imagens */}
          <div className="p-5 w-230 overflow-x-auto"> 
            {(imagens.length == 0) ? 
              <div 
                className="relative w-100 h-50 shrink-0"
              >
                <Image
                  src="/placeholder.png"
                  alt="imagem de placeholder"
                  fill
                  className="object-cover rounded-xl"
                />
              </div>
              :
              <div className="flex gap-4 min-w-max">
                {imagens.map((item: any) => (
                  <div 
                    key={item.id}
                    className="relative w-100 h-50 shrink-0"
                  >
                    <Image
                      src={getS3URL(item.chaveS3)}
                      alt={item.nome}
                      fill
                      className="object-cover rounded-xl"
                    />
                  </div>
                ))}
              </div>
            }
          </div>
          {/* Info geral */}
          <div className="evento-conteudo">
            {/* Nome e descrição */}
            <h1 className="titulo">{evento.nome}</h1>
            <p className="mt-2 text-lg">{evento.descricao}</p>

            {/* Data e local */}
            <div className="flex flex-row gap-5">
              <div className="evento-conteudo-card">
                <h2 className="text-3xl">Onde?</h2>    
                <p className="mt-2 mb-1 text-lg">{evento.cidade.nome}, {evento.endereco.bairro}</p>
                <p className="mb-2 text-lg">{evento.endereco.rua}, nº{evento.endereco.numero}</p>
                <hr />
                <p className="mt-2 mb-1 text-lg">CEP: {evento.endereco.cep}</p>
              </div>

              <div className="evento-conteudo-card">
                <h2 className="text-3xl">Quando?</h2>    
                <p className="mt-2 mb-1.5 text-lg">{converterDataHora(evento.dataHoraInicio)}</p>
                <p className="mb-1.5 text-lg">a</p>
                <p className="text-lg">{converterDataHora(evento.dataHoraFim)}</p>
              </div>
            </div>

            {/* Tags/Categorias */}
            <div>
              <h2 className="text-3xl mt-10">Categorias</h2>
              <p className="mt-2 mb-4">Categorias em que esse evento se enquadra!</p>
              <div className="flex flex-row gap-2">
                {evento.tags.map((item: any) => (
                  <Link
                    key={item.id}
                    href={`/categoria/${item.tag}`}
                    className="cursor-pointer"
                  >
                    <div className="tag-card">
                      <h3 className="text-lg">{item.tag}</h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
             
            {/* Pontos de venda */}
            <h2 className="text-3xl mt-10">Pontos de Venda</h2>
            <p className="mt-2 mb-4">Não curte comprar online? Seguem alguns pontos de venda presenciais para você!</p>
            <div className="flex flex-row flex-wrap gap-3">
              {evento.pontosVenda.map((item: any) => (
                <PontoVendaCard 
                  key={item.id}
                  id={item.id}
                  nome={item.nome}
                  detalhes={item.detalhes}
                  endereco={item.endereco}
                />
              ))}
            </div>
            
            {/* Organização */}
            <h2 className="text-3xl mt-10 mb-3">Organização</h2>
            <div className="w-200 space-y-4">
              {/* BLOCO 1 - Organizador */}
              <div className="grid grid-cols-6 border border-slate-300 rounded-xl overflow-hidden">
                <div className="border-r border-slate-300 p-2 font-semibold bg-gray-200 text-center">
                  Organizador:
                </div>
                <div className="col-span-5 p-2 bg-gray-100">
                  {evento.organizador.nome}
                </div>
              </div>

              {/* BLOCO 2 - Email + Telefone */}
              <div className="grid grid-cols-2 gap-4">
                {/* Email */}
                <div className="grid grid-cols-3 border border-slate-300 rounded-xl overflow-hidden">
                  <div className="border-r border-slate-300 p-2 font-semibold bg-gray-200 text-center">
                    E-mail:
                  </div>
                  <div className="col-span-2 p-2 bg-gray-100">
                    {evento.emailContato}
                  </div>
                </div>
                {/* Telefone */}
                <div className="grid grid-cols-3 border border-slate-300 rounded-xl overflow-hidden">
                  <div className="border-r border-slate-300  p-2 font-semibold bg-gray-200 text-center">
                    Telefone:
                  </div>
                  <div className="col-span-2 p-2 bg-gray-100">
                    {evento.telefoneContato}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
        <div className=""> {/* Lado "direito" */}
          {/* Ingressos (barra lateral) */}
          <div className="evento-ingressos">
            <h2 className="text-3xl">Ingressos</h2>
            {evento.ingressos.map((item: any) => (
              <div className="ingresso-card" key={item.id}>
                <h3 className="text-xl mb-2">{item.tipo}</h3>
                <p>R$ {item.valorBase.toFixed(2)}</p>
                <p>Qtde restante: {item.quantidadeDisponivel} unidade(s)</p>
                <p>Meia entrada: {(item.temMeiaEntrada == true) ? "Sim" : "Não"}</p>
                <Link
                  href={`/ingresso/${item.id}`}
                >
                  <button className="botao-primario mt-3">
                    Comprar Ingresso
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
