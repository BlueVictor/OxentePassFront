'use client';

import { useAuth } from "@/app/_components/Auth/AuthProvider";
import HeaderCard from "@/app/_components/HeaderCard";
import { chamadaAPI } from "@/backend/chamadaPadrao";
import {
    Building2,
    CalendarRange,
    MapPin,
    Shapes,
    Store,
    Ticket,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
    Bar,
    BarChart,
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

type UsuarioAutenticado = {
    id: number;
    nome: string;
    tipoUsuario: string;
};

type Cidade = {
    id: number;
    nome: string;
    descricao?: string;
};

type Tag = {
    id: number;
    tag: string;
};

type Endereco = {
    rua?: string;
    numero?: string | number;
    bairro?: string;
    cep?: string;
};

type PontoVenda = {
    id: number;
    nome: string;
    endereco?: Endereco;
};

type Ingresso = {
    id: number;
    tipo?: string;
    valorBase?: number;
};

type EventoDashboard = {
    id: number;
    nome: string;
    cidade?: Cidade | null;
    tags?: Tag[];
    pontosVenda?: PontoVenda[];
    ingressos?: Ingresso[];
};

type ItemComEventos = {
    id: number;
    nome: string;
    descricao?: string;
    detalhes?: string;
    eventos: Array<{
        id: number;
        nome: string;
    }>;
};

type CategoriaOferta = {
    id: number;
    nome: string;
    quantidadeEventos: number;
    percentualEventos: number;
    fill: string;
};

type DashboardData = {
    eventos: EventoDashboard[];
    pontosVenda: ItemComEventos[];
    cidades: ItemComEventos[];
    categorias: CategoriaOferta[];
};

const CHART_COLORS = ["#0f766e", "#0d9488", "#14b8a6", "#2dd4bf", "#f59e0b", "#f97316"];
const EVENTOS_PREVIEW_LIMIT = 6;
const CIDADES_PREVIEW_LIMIT = 6;
const PONTOS_PREVIEW_LIMIT = 0;
const CATEGORIAS_PREVIEW_LIMIT = 5;

async function buscarEventosDoOrganizador(organizadorId: number) {
    const eventos: EventoDashboard[] = [];
    let pagina = 0;

    while (true) {
        const response = await chamadaAPI(
            `/evento/filtro?organizador.id=${organizadorId}&page=${pagina}&size=50`,
            "GET"
        );

        if (!response || !Array.isArray(response.content)) {
            return null;
        }

        eventos.push(...response.content);
        pagina += 1;

        if (pagina >= (response.totalPages ?? 1)) {
            break;
        }
    }

    return eventos;
}

function formatarEndereco(endereco?: Endereco) {
    if (!endereco) {
        return "";
    }

    return [
        endereco.rua ? `${endereco.rua}${endereco.numero ? `, ${endereco.numero}` : ""}` : "",
        endereco.bairro,
        endereco.cep ? `CEP ${endereco.cep}` : "",
    ]
        .filter(Boolean)
        .join(" • ");
}

function construirPontosVenda(eventos: EventoDashboard[]) {
    const pontosMap = new Map<number, ItemComEventos>();

    eventos.forEach((evento) => {
        evento.pontosVenda?.forEach((ponto) => {
            const pontoExistente = pontosMap.get(ponto.id);
            const eventoVinculado = { id: evento.id, nome: evento.nome };

            if (!pontoExistente) {
                pontosMap.set(ponto.id, {
                    id: ponto.id,
                    nome: ponto.nome,
                    detalhes: formatarEndereco(ponto.endereco),
                    eventos: [eventoVinculado],
                });
                return;
            }

            if (!pontoExistente.eventos.some((item) => item.id === evento.id)) {
                pontoExistente.eventos.push(eventoVinculado);
            }
        });
    });

    return Array.from(pontosMap.values()).sort((a, b) => {
        if (b.eventos.length !== a.eventos.length) {
            return b.eventos.length - a.eventos.length;
        }

        return a.nome.localeCompare(b.nome);
    });
}

function construirCidades(eventos: EventoDashboard[]) {
    const cidadesMap = new Map<number, ItemComEventos>();

    eventos.forEach((evento) => {
        if (!evento.cidade) {
            return;
        }

        const cidadeExistente = cidadesMap.get(evento.cidade.id);
        const eventoVinculado = { id: evento.id, nome: evento.nome };

        if (!cidadeExistente) {
            cidadesMap.set(evento.cidade.id, {
                id: evento.cidade.id,
                nome: evento.cidade.nome,
                descricao: evento.cidade.descricao,
                eventos: [eventoVinculado],
            });
            return;
        }

        if (!cidadeExistente.eventos.some((item) => item.id === evento.id)) {
            cidadeExistente.eventos.push(eventoVinculado);
        }
    });

    return Array.from(cidadesMap.values()).sort((a, b) => {
        if (b.eventos.length !== a.eventos.length) {
            return b.eventos.length - a.eventos.length;
        }

        return a.nome.localeCompare(b.nome);
    });
}

function construirCategorias(eventos: EventoDashboard[]) {
    const categoriasMap = new Map<number, { id: number; nome: string; eventoIds: Set<number> }>();

    eventos.forEach((evento) => {
        evento.tags?.forEach((tag) => {
            const categoriaExistente = categoriasMap.get(tag.id);

            if (!categoriaExistente) {
                categoriasMap.set(tag.id, {
                    id: tag.id,
                    nome: tag.tag,
                    eventoIds: new Set([evento.id]),
                });
                return;
            }

            categoriaExistente.eventoIds.add(evento.id);
        });
    });

    const totalEventos = eventos.length || 1;

    return Array.from(categoriasMap.values())
        .map((categoria, index): CategoriaOferta => ({
            id: categoria.id,
            nome: categoria.nome,
            quantidadeEventos: categoria.eventoIds.size,
            percentualEventos: Math.round((categoria.eventoIds.size / totalEventos) * 100),
            fill: CHART_COLORS[index % CHART_COLORS.length],
        }))
        .sort((a, b) => {
            if (b.quantidadeEventos !== a.quantidadeEventos) {
                return b.quantidadeEventos - a.quantidadeEventos;
            }

            return a.nome.localeCompare(b.nome);
        });
}

function montarDashboardData(eventos: EventoDashboard[]): DashboardData {
    return {
        eventos,
        pontosVenda: construirPontosVenda(eventos),
        cidades: construirCidades(eventos),
        categorias: construirCategorias(eventos),
    };
}

function TooltipChart({
    active,
    payload,
    label,
}: {
    active?: boolean;
    payload?: Array<{ value?: number; name?: string; payload?: { nome?: string } }>;
    label?: string;
}) {
    if (!active || !payload?.length) {
        return null;
    }

    const item = payload[0];
    const nome = item.payload?.nome ?? item.name ?? label;

    return (
        <div className="rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-md">
            <p className="text-sm font-semibold text-slate-900">{nome}</p>
            <p className="mt-1 text-xs text-slate-500">{item.value} vínculo(s)</p>
        </div>
    );
}

export default function OrganizadorDashboardPage() {
    const router = useRouter();
    const { usuario, autenticado, loading } = useAuth();
    const [dashboard, setDashboard] = useState<DashboardData | null>(null);
    const [carregandoDashboard, setCarregandoDashboard] = useState(true);
    const [erroDashboard, setErroDashboard] = useState(false);

    useEffect(() => {
        if (!loading && !autenticado) {
            router.push("/login");
        }
    }, [autenticado, loading, router]);

    useEffect(() => {
        const carregarDashboard = async () => {
            if (loading || !autenticado || !usuario?.id) {
                return;
            }

            const usuarioAutenticado = usuario as UsuarioAutenticado;

            if (usuarioAutenticado.tipoUsuario !== "ORGANIZADOR") {
                setCarregandoDashboard(false);
                return;
            }

            setCarregandoDashboard(true);
            setErroDashboard(false);

            const eventos = await buscarEventosDoOrganizador(usuarioAutenticado.id);

            if (!eventos) {
                setErroDashboard(true);
                setCarregandoDashboard(false);
                return;
            }

            setDashboard(montarDashboardData(eventos));
            setCarregandoDashboard(false);
        };

        carregarDashboard();
    }, [autenticado, loading, usuario]);

    const pontosVendaChart = useMemo(
        () => dashboard?.pontosVenda.slice(0, 6).map((item) => ({
            nome: item.nome,
            total: item.eventos.length,
        })) ?? [],
        [dashboard]
    );

    const cidadesChart = useMemo(
        () => dashboard?.cidades.slice(0, 6).map((item) => ({
            nome: item.nome,
            total: item.eventos.length,
        })) ?? [],
        [dashboard]
    );

    if (loading || carregandoDashboard) {
        return (
            <div className="mx-auto flex w-full max-w-5xl justify-center py-12">
                <span className="text-sm text-slate-500">Carregando dashboard...</span>
            </div>
        );
    }

    if (!usuario || (usuario as UsuarioAutenticado).tipoUsuario !== "ORGANIZADOR") {
        return (
            <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
                <HeaderCard
                    pageTitle="Organizador"
                    headerTitle="Dashboard indisponível"
                    details="Esta área é exclusiva para contas com perfil de organizador."
                />
            </div>
        );
    }

    if (erroDashboard || !dashboard) {
        return (
            <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
                <HeaderCard
                    pageTitle="Organizador"
                    headerTitle="Dashboard"
                    details="Não foi possível carregar os dados consolidados da sua organização agora."
                />

                <div className="rounded-[2rem] border border-rose-200 bg-rose-50 px-6 py-5 text-sm leading-6 text-rose-700 shadow-sm">
                    Houve um problema interno. Tente novamente em alguns instantes.
                </div>
            </div>
        );
    }

    const eventosPreview = dashboard.eventos.slice(0, EVENTOS_PREVIEW_LIMIT);
    const cidadesPreview = dashboard.cidades.slice(0, CIDADES_PREVIEW_LIMIT);
    const pontosPreview = dashboard.pontosVenda.slice(0, PONTOS_PREVIEW_LIMIT);
    const categoriasPreview = dashboard.categorias.slice(0, CATEGORIAS_PREVIEW_LIMIT);

    return (
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
            <HeaderCard
                pageTitle="Organizador"
                headerTitle={`Dashboard de ${usuario.nome}`}
                details="Acompanhe os vínculos da sua operação com foco em eventos, pontos de venda, cidades e categorias dos seus eventos."
                highlightLabel="Eventos vinculados"
                highlightValue={dashboard.eventos.length}
            />

            <section className="grid gap-4 md:grid-cols-3">
                <article className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="rounded-2xl bg-sky-50 p-3 text-sky-700">
                            <CalendarRange className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                                Eventos
                            </p>
                            <p className="mt-1 text-3xl font-bold text-slate-900">
                                {dashboard.eventos.length}
                            </p>
                        </div>
                    </div>
                    <p className="mt-4 text-sm text-slate-500">
                        Total de eventos atualmente vinculados à sua organização.
                    </p>
                </article>

                <article className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700">
                            <Store className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                                Pontos de venda
                            </p>
                            <p className="mt-1 text-3xl font-bold text-slate-900">
                                {dashboard.pontosVenda.length}
                            </p>
                        </div>
                    </div>
                    <p className="mt-4 text-sm text-slate-500">
                        Quantidade de locais físicos associados aos seus eventos.
                    </p>
                </article>

                <article className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="rounded-2xl bg-teal-50 p-3 text-teal-700">
                            <Building2 className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                                Cidades
                            </p>
                            <p className="mt-1 text-3xl font-bold text-slate-900">
                                {dashboard.cidades.length}
                            </p>
                        </div>
                    </div>
                    <p className="mt-4 text-sm text-slate-500">
                        Cidades onde sua grade atual de eventos está presente.
                    </p>
                </article>
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="rounded-2xl bg-sky-50 p-3 text-sky-700">
                                <Ticket className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                                    Eventos vinculados
                                </p>
                                <h2 className="mt-1 text-2xl font-bold text-slate-900">
                                    Seus eventos cadastrados
                                </h2>
                            </div>
                        </div>

                        <Link
                            href="/organizador/evento"
                            className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-center text-sm font-semibold text-sky-700 transition hover:border-sky-300 hover:bg-sky-100"
                        >
                            Ver mais
                        </Link>
                    </div>

                    {dashboard.eventos.length === 0 ? (
                        <div className="mt-6 rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-6 py-8 text-center text-sm text-slate-500">
                            Nenhum evento está vinculado ao seu perfil de organizador no momento.
                        </div>
                    ) : (
                        <div className="mt-6 grid gap-3 md:grid-cols-2">
                            {eventosPreview.map((evento) => (
                                <Link
                                    key={evento.id}
                                    href={`/evento/${evento.id}`}
                                    className="rounded-3xl border border-slate-200 bg-slate-50 p-4 transition hover:border-sky-300 hover:bg-sky-50"
                                >
                                    <p className="text-base font-semibold text-slate-900">
                                        {evento.nome}
                                    </p>
                                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
                                        {evento.cidade?.nome ? (
                                            <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1">
                                                <MapPin className="h-3.5 w-3.5 text-teal-600" />
                                                {evento.cidade.nome}
                                            </span>
                                        ) : null}

                                        <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1">
                                            <Store className="h-3.5 w-3.5 text-emerald-600" />
                                            {evento.pontosVenda?.length ?? 0} ponto(s)
                                        </span>

                                        <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1">
                                            <Shapes className="h-3.5 w-3.5 text-amber-600" />
                                            {evento.tags?.length ?? 0} categoria(s)
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </article>

                <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="rounded-2xl bg-amber-50 p-3 text-amber-700">
                                <Shapes className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                                    Categorias ofertadas
                                </p>
                                <h2 className="mt-1 text-2xl font-bold text-slate-900">
                                    Distribuição por categoria
                                </h2>
                            </div>
                        </div>

                        <Link
                            href="/organizador/categoria"
                            className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-center text-sm font-semibold text-amber-700 transition hover:border-amber-300 hover:bg-amber-100"
                        >
                            Ver mais
                        </Link>
                    </div>

                    {dashboard.categorias.length === 0 ? (
                        <div className="mt-6 rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-6 py-8 text-center text-sm text-slate-500">
                            Ainda não há categorias vinculadas aos seus eventos.
                        </div>
                    ) : (
                        <>
                            <div className="mt-6 h-72">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={dashboard.categorias}
                                            dataKey="quantidadeEventos"
                                            nameKey="nome"
                                            innerRadius={70}
                                            outerRadius={105}
                                            paddingAngle={3}
                                        >
                                            {dashboard.categorias.map((categoria) => (
                                                <Cell key={categoria.id} fill={categoria.fill} />
                                            ))}
                                        </Pie>
                                        <Tooltip content={<TooltipChart />} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="mt-2 space-y-3">
                                {categoriasPreview.map((categoria) => (
                                    <div key={categoria.id} className="flex items-center justify-between gap-3">
                                        <div className="flex min-w-0 items-center gap-3">
                                            <span
                                                className="h-3 w-3 rounded-full"
                                                style={{ backgroundColor: categoria.fill }}
                                            />
                                            <p className="truncate text-sm font-medium text-slate-800">
                                                {categoria.nome}
                                            </p>
                                        </div>
                                        <div className="text-right text-xs text-slate-500">
                                            <p>{categoria.quantidadeEventos} evento(s)</p>
                                            <p>{categoria.percentualEventos}%</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </article>
            </section>

            <section className="grid gap-6 xl:grid-cols-2">
                <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="rounded-2xl bg-teal-50 p-3 text-teal-700">
                                <Building2 className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                                    Cidades vinculadas
                                </p>
                                <h2 className="mt-1 text-2xl font-bold text-slate-900">
                                    Presença por cidade
                                </h2>
                            </div>
                        </div>

                        <Link
                            href="/organizador/cidade"
                            className="rounded-full border border-teal-200 bg-teal-50 px-3 py-1.5 text-center text-sm font-semibold text-teal-700 transition hover:border-teal-300 hover:bg-teal-100"
                        >
                            Ver mais
                        </Link>
                    </div>

                    {dashboard.cidades.length === 0 ? (
                        <div className="mt-6 rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-6 py-8 text-center text-sm text-slate-500">
                            Nenhuma cidade foi vinculada aos seus eventos ainda.
                        </div>
                    ) : (
                        <>
                            <div className="mt-6 h-72">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={cidadesChart} layout="vertical" margin={{ left: 16, right: 16 }}>
                                        <XAxis type="number" allowDecimals={false} hide />
                                        <YAxis
                                            type="category"
                                            dataKey="nome"
                                            width={100}
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <Tooltip content={<TooltipChart />} />
                                        <Bar dataKey="total" radius={[0, 10, 10, 0]} fill="#0f766e" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="mt-4 flex flex-wrap gap-2">
                                {cidadesPreview.map((cidade) => (
                                    <Link
                                        key={cidade.id}
                                        href={`/cidade/${cidade.id}`}
                                        className="rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-sm font-medium text-teal-700 transition hover:border-teal-300 hover:bg-teal-100"
                                    >
                                        {cidade.nome}
                                    </Link>
                                ))}
                            </div>
                        </>
                    )}
                </article>

                <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700">
                                <Store className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                                    Pontos de venda vinculados
                                </p>
                                <h2 className="mt-1 text-2xl font-bold text-slate-900">
                                    Distribuição por ponto
                                </h2>
                            </div>
                        </div>

                        <Link
                            href="/organizador/ponto-venda"
                            className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-center text-sm font-semibold text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-100"
                        >
                            Ver mais
                        </Link>
                    </div>

                    {dashboard.pontosVenda.length === 0 ? (
                        <div className="mt-6 rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-6 py-8 text-center text-sm text-slate-500">
                            Nenhum ponto de venda está associado aos seus eventos.
                        </div>
                    ) : (
                        <>
                            <div className="mt-6 h-72">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={pontosVendaChart} layout="vertical" margin={{ left: 16, right: 16 }}>
                                        <XAxis type="number" allowDecimals={false} hide />
                                        <YAxis
                                            type="category"
                                            dataKey="nome"
                                            width={150}
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <Tooltip content={<TooltipChart />} />
                                        <Bar dataKey="total" radius={[0, 10, 10, 0]} fill="#059669" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="mt-4 space-y-3">
                                {pontosPreview.map((ponto) => (
                                    <div key={ponto.id} className="flex items-start justify-between gap-4 rounded-2xl bg-slate-50 px-4 py-3">
                                        <div className="min-w-0">
                                            <Link
                                                href={`/ponto-venda/${ponto.id}`}
                                                className="text-sm font-semibold text-slate-900 transition hover:text-emerald-700"
                                            >
                                                {ponto.nome}
                                            </Link>
                                            {ponto.detalhes ? (
                                                <p className="mt-1 text-xs text-slate-500">
                                                    {ponto.detalhes}
                                                </p>
                                            ) : null}
                                        </div>
                                        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-emerald-700 shadow-sm">
                                            {ponto.eventos.length} vínculo(s)
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </article>
            </section>
        </div>
    );
}
