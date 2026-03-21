'use client'

import { Star } from "lucide-react";
import { useState } from "react";
import { adicionarAvaliacaoEvento } from "../../../backend/chamadasEvento";
import { useToast } from "../ToastProvider";

type AvaliacaoPayload = {
    comentario: string;
    nota: number;
};

type AvaliacaoFormProps = {
    idEvento: number | string;
    titulo?: string;
    descricao?: string;
    textoBotao?: string;
    mensagemSucesso?: string;
    avaliacaoInicial?: AvaliacaoPayload | null;
    onSubmitAvaliacao?: (avaliacao: AvaliacaoPayload) => Promise<unknown>;
    onSuccess?: (avaliacao: AvaliacaoPayload) => void | Promise<void>;
};

export default function AvaliacaoForm({
    idEvento,
    titulo = "Deixe sua avaliação",
    descricao = "Conte como foi sua experiência neste evento.",
    textoBotao = "Enviar avaliação",
    mensagemSucesso = "Avaliação enviada com sucesso.",
    avaliacaoInicial = null,
    onSubmitAvaliacao,
    onSuccess,
}: AvaliacaoFormProps) {
    const { showToast } = useToast();
    const [nota, setNota] = useState(avaliacaoInicial?.nota ?? 0);
    const [comentario, setComentario] = useState(avaliacaoInicial?.comentario ?? "");
    const [enviando, setEnviando] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!nota) {
            showToast("Escolha uma nota entre 1 e 5 estrelas.", "error");
            return;
        }

        if (!comentario.trim()) {
            showToast("Escreva um comentário para concluir sua avaliação.", "error");
            return;
        }

        setEnviando(true);

        const avaliacaoPayload = {
            comentario: comentario.trim(),
            nota,
        };

        const response = onSubmitAvaliacao
            ? await onSubmitAvaliacao(avaliacaoPayload)
            : await adicionarAvaliacaoEvento(idEvento, avaliacaoPayload);

        setEnviando(false);

        if (!response) {
            showToast("Não foi possível enviar sua avaliação agora.", "error");
            return;
        }

        showToast(mensagemSucesso, "success");

        setComentario("");
        setNota(0);

        if (onSuccess) {
            await onSuccess(avaliacaoPayload);
        }
    };

    return (
        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="border-b border-slate-100 pb-4">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                    {titulo}
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                    {descricao}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                        Sua nota
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-3">
                        {Array.from({ length: 5 }).map((_, index) => {
                            const valorEstrela = index + 1;

                            return (
                                <button
                                    key={valorEstrela}
                                    type="button"
                                    onClick={() => setNota(valorEstrela)}
                                    className="cursor-pointer rounded-full border border-slate-200 p-2 transition hover:border-amber-300 hover:bg-amber-50"
                                    aria-label={`Selecionar ${valorEstrela} estrelas`}
                                >
                                    <Star
                                        size={20}
                                        className={valorEstrela <= nota ? "fill-amber-400 text-amber-400" : "text-slate-300"}
                                    />
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="comentario" className="text-sm font-semibold text-slate-700">
                        Comentario
                    </label>
                    <textarea
                        id="comentario"
                        value={comentario}
                        onChange={(event) => setComentario(event.target.value)}
                        placeholder="Escreva aqui sua opinião sobre o evento"
                        rows={5}
                        className="min-h-32 rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-gray-400"
                    />
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={enviando}
                        className="botao-primario disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        {enviando ? "Enviando..." : textoBotao}
                    </button>
                </div>
            </form>
        </section>
    );
}
