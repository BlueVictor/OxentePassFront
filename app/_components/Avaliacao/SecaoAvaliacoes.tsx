'use client'

import { useEffect, useState } from "react";
import {
    buscarEventoPorId,
    buscarMinhaAvaliacaoEvento,
    editarMinhaAvaliacaoEvento,
    listarAvaliacoesEvento,
    removerMinhaAvaliacaoEvento
} from "../../../backend/chamadasEvento";
import { useAuth } from "../Auth/AuthProvider";
import { useToast } from "../ToastProvider";
import AvaliacaoCard from "./AvaliacaoCard";
import AvaliacaoForm from "./AvaliacaoForm";
import EstrelasAvaliacao from "./EstrelasAvaliacao";
import { Paginacao } from "../Paginacao";

type Avaliacao = {
    id: number;
    nota: number;
    comentario: string;
    usuarioId: number | null;
    nomeUsuario: string;
};

type SecaoAvaliacoesProps = {
    idEvento: number | string;
    mediaInicial?: number;
    quantidadeInicial?: number;
    paginaInicial?: number;
};

const PAGE_SIZE = 5;

export default function SecaoAvaliacoes({
    idEvento,
    mediaInicial = 0,
    quantidadeInicial = 0,
    paginaInicial = 0,
}: SecaoAvaliacoesProps) {
    const { autenticado, usuario, loading } = useAuth();
    const { showToast } = useToast();
    const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
    const [minhaAvaliacao, setMinhaAvaliacao] = useState<Avaliacao | null>(null);
    const [pagina, setPagina] = useState(paginaInicial);
    const [totalPages, setTotalPages] = useState(0);
    const [totalAvaliacoes, setTotalAvaliacoes] = useState(quantidadeInicial);
    const [mediaAvaliacao, setMediaAvaliacao] = useState(mediaInicial);
    const [carregandoLista, setCarregandoLista] = useState(true);
    const [carregandoMinhaAvaliacao, setCarregandoMinhaAvaliacao] = useState(false);
    const [editando, setEditando] = useState(false);
    const [removendo, setRemovendo] = useState(false);

    const carregarResumo = async () => {
        const evento = await buscarEventoPorId(idEvento);

        if (!evento) {
            return;
        }

        setMediaAvaliacao(evento.mediaAvaliacao ?? 0);
        setTotalAvaliacoes(evento.avaliacoes?.length ?? 0);
    };

    const carregarAvaliacoes = async (paginaDesejada = 0) => {
        setCarregandoLista(true);

        const response = await listarAvaliacoesEvento(idEvento, paginaDesejada, PAGE_SIZE);

        if (!response) {
            showToast("Não foi possível carregar as avaliações do evento.", "error");
            setCarregandoLista(false);
            return;
        }

        const content = response.content ?? [];
        setAvaliacoes(content);
        setPagina(response.number ?? paginaDesejada);
        setTotalPages(response.totalPages ?? 0);
        setCarregandoLista(false);
    };

    const carregarMinhaAvaliacao = async () => {
        if (!autenticado) {
            setMinhaAvaliacao(null);
            setEditando(false);
            return;
        }

        setCarregandoMinhaAvaliacao(true);
        const response = await buscarMinhaAvaliacaoEvento(idEvento);
        setMinhaAvaliacao(response);
        setEditando(false);
        setCarregandoMinhaAvaliacao(false);
    };

    const recarregarTudo = async () => {
        await Promise.all([
            carregarAvaliacoes(0),
            carregarMinhaAvaliacao(),
            carregarResumo(),
        ]);
    };

    useEffect(() => {
        const carregarInicial = async () => {
            const response = await listarAvaliacoesEvento(idEvento, paginaInicial, PAGE_SIZE);

            if (!response) {
                showToast("Não foi possível carregar as avaliações do evento.", "error");
                setCarregandoLista(false);
                return;
            }

            const content = response.content ?? [];
            setAvaliacoes(content);
            setPagina(response.number ?? paginaInicial);
            setTotalPages(response.totalPages ?? 0);
            setCarregandoLista(false);
        };

        void carregarInicial();
    }, [idEvento, paginaInicial, showToast]);

    useEffect(() => {
        if (loading) {
            return;
        }

        const carregarAvaliacaoDoUsuario = async () => {
            if (!autenticado) {
                setMinhaAvaliacao(null);
                setEditando(false);
                return;
            }

            setCarregandoMinhaAvaliacao(true);
            const response = await buscarMinhaAvaliacaoEvento(idEvento);
            setMinhaAvaliacao(response);
            setEditando(false);
            setCarregandoMinhaAvaliacao(false);
        };

        void carregarAvaliacaoDoUsuario();
    }, [autenticado, loading, idEvento]);

    const avaliacoesPublicas = usuario?.id
        ? avaliacoes.filter((item) => item.usuarioId !== usuario.id)
        : avaliacoes;

    const handleEditar = async (avaliacao: { comentario: string; nota: number }) => {
        return await editarMinhaAvaliacaoEvento(idEvento, avaliacao);
    };

    const handleSucessoFormulario = async () => {
        await recarregarTudo();
    };

    const handleRemover = async () => {
        if (!window.confirm("Deseja remover sua avaliação deste evento?")) {
            return;
        }

        setRemovendo(true);

        const response = await removerMinhaAvaliacaoEvento(idEvento);

        setRemovendo(false);

        if (!response) {
            showToast("Não foi possível remover sua avaliação agora.", "error");
            return;
        }

        showToast("Avaliação removida com sucesso.", "success");
        await recarregarTudo();
    };

    return (
        <section className="mt-12 rounded-[2rem] border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
                        Avaliações
                    </p>
                    <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                        O que o público achou do evento
                    </h2>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                        Veja a média das notas e os comentários publicados pelos participantes.
                    </p>
                </div>

                <div className="rounded-[1.75rem] border border-slate-200 bg-white px-5 py-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <EstrelasAvaliacao nota={mediaAvaliacao} tamanho={20} />
                        <span className="text-sm text-slate-500">
                            {totalAvaliacoes} {totalAvaliacoes === 1 ? "avaliação" : "avaliações"}
                        </span>
                    </div>
                </div>
            </div>

            <div className="mt-8 space-y-6">
                {loading ? (
                    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                        <p className="text-sm text-slate-500">Verificando autenticação...</p>
                    </section>
                ) : autenticado ? (
                    <>
                        {carregandoMinhaAvaliacao ? (
                            <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                                <p className="text-sm text-slate-500">Carregando sua avaliação...</p>
                            </section>
                        ) : minhaAvaliacao && !editando ? (
                            <section className="space-y-4 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                    <div>
                                        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                                            Sua avaliacao
                                        </p>
                                        <p className="mt-2 text-sm leading-6 text-slate-600">
                                            Você já avaliou este evento. Se quiser, pode atualizar ou remover seu comentário.
                                        </p>
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setEditando(true)}
                                            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleRemover}
                                            disabled={removendo}
                                            className="rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-70"
                                        >
                                            {removendo ? "Removendo..." : "Excluir"}
                                        </button>
                                    </div>
                                </div>

                                <AvaliacaoCard
                                    nomeUsuario={minhaAvaliacao.nomeUsuario}
                                    nota={minhaAvaliacao.nota}
                                    comentario={minhaAvaliacao.comentario}
                                />
                            </section>
                        ) : (
                            <AvaliacaoForm
                                key={minhaAvaliacao ? `edit-${minhaAvaliacao.id}` : `create-${idEvento}`}
                                idEvento={idEvento}
                                titulo={minhaAvaliacao ? "Edite sua avaliação" : "Deixe sua avaliação"}
                                descricao={minhaAvaliacao
                                    ? "Atualize sua nota e conte o que mudou na sua experiência."
                                    : "Compartilhe sua experiência para ajudar outras pessoas."}
                                textoBotao={minhaAvaliacao ? "Salvar alterações" : "Enviar avaliação"}
                                mensagemSucesso={minhaAvaliacao ? "Avaliação atualizada com sucesso." : "Avaliação enviada com sucesso."}
                                avaliacaoInicial={minhaAvaliacao ? {
                                    comentario: minhaAvaliacao.comentario,
                                    nota: minhaAvaliacao.nota
                                } : null}
                                onSubmitAvaliacao={minhaAvaliacao ? handleEditar : undefined}
                                onSuccess={handleSucessoFormulario}
                            />
                        )}
                    </>
                ) : (
                    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                            Sua opinião
                        </p>
                        <p className="mt-3 text-sm leading-6 text-slate-600">
                            Faça login para publicar sua avaliação deste evento.
                        </p>
                    </section>
                )}

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-bold tracking-tight text-slate-900">
                            Comentários publicados
                        </h3>

                        <div className="min-w-40">
                            <Paginacao
                                page={pagina}
                                totalPages={totalPages}
                                index="pagAvaliacao"
                            />
                        </div>
                    </div>

                    {carregandoLista ? (
                        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                            <p className="text-sm text-slate-500">Carregando avaliações...</p>
                        </section>
                    ) : avaliacoesPublicas.length > 0 ? (
                        <div className="grid gap-4">
                            {avaliacoesPublicas.map((item) => (
                                <AvaliacaoCard
                                    key={item.id}
                                    nomeUsuario={item.nomeUsuario}
                                    nota={item.nota}
                                    comentario={item.comentario}
                                />
                            ))}
                        </div>
                    ) : (
                        <section className="rounded-[2rem] border border-dashed border-slate-300 bg-white/80 p-8 text-center shadow-sm">
                            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                                Nada por aqui ainda
                            </p>
                        </section>
                    )}
                </div>
            </div>
        </section>
    );
}
