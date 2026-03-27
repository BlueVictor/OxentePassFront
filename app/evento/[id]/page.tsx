import { chamadaAPI } from "../../../backend/chamadaPadrao";
import { getS3URL, converterDataHora } from "../../../funcoes/helpers";
import Image from "next/image";
import Link from "next/link";
import PontoVendaCard from "@/app/_components/PontoVenda/PontoVendaCard";
import SecaoAvaliacoes from "@/app/_components/Avaliacao/SecaoAvaliacoes";
import { BotaoCarrinho } from "@/app/_components/BotaoCarrinho"; 
import "../../globals.css";
import "./page.css"
import { SubEventoCard } from "@/app/_components/SubEventoCard";
import { Paginacao } from "@/app/_components/Paginacao";

async function getEvento(idEvento: string) {
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

async function getImagens(idEvento: string) {
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

async function getSubEventos (idEvento: number, paginaSubEventos: number) {
  const response = await chamadaAPI(
    `/evento/${idEvento}/subeventos/comImg?page=${paginaSubEventos}&size=2`,
    "GET"
  )

  if (!response) {
    console.error("Falha no carregamento de sub-eventos")
    return []
  }

  return response
}

export default async function Evento(props: any) {
  const { id } = await props.params
  const searchParams = await props.searchParams;
  const paginaAvaliacao = Number(searchParams?.pagAvaliacao ?? 0);
  const paginaSubEventos = Number(searchParams?.pagSubEventos ?? 0);
  const evento = (await getEvento(id))[0]
  const imagens = await getImagens(id)
  const subeventos = evento.ehSimples ? null : await getSubEventos(id, paginaSubEventos)

  return (
    <div className="flex justify-center">
      <div className="w-7/10">
        <main className="relative flex flex-row">
          <div> {/* Lado "esquerdo" */}
            {/* Imagens */}
            <div className="p-5 w-230 overflow-x-auto">
              {(imagens.length == 0) ?
                <div className="relative w-100 h-50 shrink-0">
                  <Image
                    src="/placeholder.png"
                    alt="imagem de placeholder"
                    fill
                    className="object-cover rounded-xl"
                  />
                </div>
                :
                <div className="flex gap-4 min-max-max">
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
            <div className="pl-5">
              <h1 className="titulo">{evento.nome}</h1>
              <p className="mt-2 text-lg">{evento.descricao}</p>

              <div className="flex flex-row gap-5">
                <div className="p-3 mt-5 w-80 bg-white rounded-xl border border-slate-100 text-center shadow-sm">
                  <h2 className="text-3xl">Onde?</h2>
                  <p className="mt-2 mb-1 text-lg">{evento.cidade?.nome}, {evento.endereco?.bairro}</p>
                  <p className="mb-2 text-lg">{evento.endereco?.rua}, nº{evento.endereco?.numero}</p>
                  <hr />
                  <p className="mt-2 mb-1 text-lg">CEP: {evento.endereco?.cep}</p>
                </div>

                <div className="flex flex-col p-3 mt-5 w-80 bg-white rounded-xl border border-slate-100 text-center shadow-sm">
                  <h2 className="text-3xl">Quando?</h2>
                  <div className="flex flex-col flex-1 items-center justify-center">
                    <p className="mt-2 mb-1.5 text-lg">{converterDataHora(evento.dataHoraInicio)}</p>
                    <p className="mb-1.5 text-lg">a</p>
                    <p className="text-lg">{converterDataHora(evento.dataHoraFim)}</p>
                  </div>
                </div>
              </div>

              {/* Tags/Categorias */}
              {evento.tags.length > 0 && 
                <>
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
                </>
              }

              {/* Pontos de venda */}
              {evento.pontosVenda.length > 0 &&
                <>
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
                </>
              }
              
              {/* Sub-Eventos */}
              {subeventos != null && subeventos.size > 0 &&
                <div>
                  <h2 className="text-3xl mt-10 mb-2">Sub-Eventos</h2>
                  <div className="flex flex-row flex-wrap gap-3">
                    {subeventos.content.map((item: any) => (
                      <SubEventoCard
                        key={item.id}
                        item={item}
                      />
                    ))}
                  </div>

                  <Paginacao
                    page={paginaSubEventos}
                    totalPages={subeventos.totalPages}
                    index="pagSubEventos"
                  />
                </div>
              }

              {/* Organização */}
              <h2 className="text-3xl mt-10 mb-3">Organização</h2>
              <div className="w-200 space-y-4">
                <div className="grid grid-cols-6 border border-slate-300 rounded-xl overflow-hidden">
                  <div className="border-r border-slate-300 p-2 font-semibold bg-gray-200 text-center">Organizador:</div>
                  <div className="col-span-5 p-2 bg-gray-100">{evento.organizador?.nome}</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid grid-cols-3 border border-slate-300 rounded-xl overflow-hidden">
                    <div className="border-r border-slate-300 p-2 font-semibold bg-gray-200 text-center">E-mail:</div>
                    <div className="col-span-2 p-2 bg-gray-100">{evento.emailContato}</div>
                  </div>
                  <div className="grid grid-cols-3 border border-slate-300 rounded-xl overflow-hidden">
                    <div className="border-r border-slate-300 p-2 font-semibold bg-gray-200 text-center">Telefone:</div>
                    <div className="col-span-2 p-2 bg-gray-100">{evento.telefoneContato}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="">
          <div className="absolute p-6 flex flex-col w-72 border border-slate-100 rounded-[2rem] gap-4 bg-white top-0 right-0 shadow-xl shadow-slate-200/50 z-50">
              <h2 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Ingressos</h2>
              
              <div className="space-y-3">
              {evento.ingressos.map((item: any) => (
                    <div 
                      key={item.id}
                      className="p-4 bg-slate-50 border border-slate-100 rounded-3xl transition-all hover:border-emerald-100" 
                    >
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-black text-slate-700 uppercase text-[12px] tracking-tight">{item.tipo}</h3>
                        <span className="text-[9px] font-bold bg-white px-2 py-0.5 rounded-full text-slate-400 border border-slate-100">
                          {item.quantidadeDisponivel} un.
                        </span>
                      </div>
                      
                      <p className="text-lg font-black text-emerald-600 mb-3">
                        R$ {item.valorBase.toFixed(2)}
                      </p>
                      
                      <div className="flex flex-col gap-2">
                        <Link href={`/organizador/vendas/criar?ingressoId=${item.id}`}>
                          <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3 rounded-xl text-[11px] uppercase tracking-widest shadow-md shadow-emerald-100 transition-all active:scale-[0.97]">
                            Comprar Agora
                          </button>
                        </Link>

                        {/* Botão Carrinho preservado do HEAD */}
                        <BotaoCarrinho ingresso={item} />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </main>

        <SecaoAvaliacoes
          idEvento={id}
          mediaInicial={evento.mediaAvaliacao}
          quantidadeInicial={evento.avaliacoes?.length ?? 0}
          paginaInicial={paginaAvaliacao}
        />
      </div>
    </div>
  );
}