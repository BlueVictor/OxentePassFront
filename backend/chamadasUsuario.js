import { chamadaAPI } from "./chamadaPadrao";

export async function buscarMeuPerfil() {
    return await chamadaAPI("/usuario/me", "GET");
}

export async function buscarMeuPerfilOrganizador() {
    return await chamadaAPI("/organizador/me", "GET");
}
