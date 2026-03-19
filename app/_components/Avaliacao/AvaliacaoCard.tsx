'use client'

import EstrelasAvaliacao from "./EstrelasAvaliacao";

type AvaliacaoCardProps = {
    nomeUsuario: string;
    nota: number;
    comentario: string;
};

export default function AvaliacaoCard({ nomeUsuario, nota, comentario }: AvaliacaoCardProps) {
    return (
        <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-lg font-semibold tracking-tight text-slate-900">
                        {nomeUsuario}
                    </p>
                </div>

                <EstrelasAvaliacao nota={nota} />
            </div>

            <p className="mt-5 text-sm leading-7 text-slate-600">
                {comentario}
            </p>
        </article>
    );
}
