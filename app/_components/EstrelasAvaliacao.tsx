'use client'

import { Star } from "lucide-react";

type EstrelasAvaliacaoProps = {
    nota: number;
    tamanho?: number;
    mostrarNota?: boolean;
};

export default function EstrelasAvaliacao({
    nota,
    tamanho = 18,
    mostrarNota = true,
}: EstrelasAvaliacaoProps) {
    const notaNormalizada = Math.max(0, Math.min(5, nota));
    const larguraPreenchida = `${(notaNormalizada / 5) * 100}%`;

    return (
        <div className="flex items-center gap-3">
            <div className="relative">
                <div className="flex text-slate-300">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <Star
                            key={`estrela-vazia-${index}`}
                            size={tamanho}
                            className="fill-current"
                        />
                    ))}
                </div>

                <div
                    className="absolute inset-y-0 left-0 overflow-hidden text-amber-400"
                    style={{ width: larguraPreenchida }}
                >
                    <div className="flex w-max">
                        {Array.from({ length: 5 }).map((_, index) => (
                            <Star
                                key={`estrela-cheia-${index}`}
                                size={tamanho}
                                className="fill-current"
                            />
                        ))}
                    </div>
                </div>
            </div>

            {mostrarNota ? (
                <span className="text-sm font-semibold text-slate-600">
                    {notaNormalizada.toFixed(1)}
                </span>
            ) : null}
        </div>
    );
}
