import Link from "next/link";

type PontoVendaCardProps = {
    id: string | number;
    nome: string;
    detalhes: string;
    endereco: {
        rua: string;
        numero: string | number;
    };
};

export default function PontoVendaCard({ id, nome, detalhes, endereco }: PontoVendaCardProps) {
    return (
        <Link
            href={`/ponto-venda/${id}`}
            className="group"
        >
            <article className="flex h-full flex-col overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md">
                <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
                                Unidade
                            </span>
                            <h2 className="mt-4 text-xl font-semibold tracking-tight text-slate-900">
                                {nome}
                            </h2>
                        </div>
                        <span className="text-lg text-slate-300 transition group-hover:translate-x-1 group-hover:text-emerald-500">
                            {">"}
                        </span>
                    </div>

                    <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">
                        {detalhes}
                    </p>
                </div>

                <div className="border-t border-slate-100 bg-slate-50/80 px-6 py-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                        Endereco
                    </p>
                    <p className="mt-2 text-sm font-medium text-slate-800">
                        {endereco.rua}, {endereco.numero}
                    </p>
                </div>
            </article>
        </Link>
    );
}
