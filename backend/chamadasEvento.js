import { chamadaAPI } from "./chamadaPadrao";

export async function adicionarAvaliacaoEvento(idEvento, avaliacao) {
    return await chamadaAPI(`/evento/${idEvento}/addAvaliacao`, "PATCH", avaliacao);
}

export async function buscarEventoPorId(idEvento) {
    const response = await chamadaAPI(`/evento/filtro?id=${idEvento}`, "GET");
    return response?.content?.[0] ?? null;
}

export async function listarAvaliacoesEvento(idEvento, page = 0, size = 5) {
    return await chamadaAPI(`/evento/${idEvento}/avaliacoes?page=${page}&size=${size}`, "GET");
}

export async function buscarMinhaAvaliacaoEvento(idEvento) {
    const response = await chamadaAPI(
        `/evento/${idEvento}/minha-avaliacao`,
        "GET",
        {},
        { returnMeta: true, silenciarErro: true }
    );

    return response?.ok ? response.data : null;
}

export async function editarMinhaAvaliacaoEvento(idEvento, avaliacao) {
    const response = await chamadaAPI(
        `/evento/${idEvento}/minha-avaliacao`,
        "PUT",
        avaliacao,
        { returnMeta: true }
    );

    return response?.ok ? response.data : null;
}

export async function removerMinhaAvaliacaoEvento(idEvento) {
    const response = await chamadaAPI(
        `/evento/${idEvento}/minha-avaliacao`,
        "DELETE",
        {},
        { returnMeta: true }
    );

    return response?.ok ? response.data : null;
}
