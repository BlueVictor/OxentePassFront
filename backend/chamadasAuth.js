import { chamadaAPI } from "./chamadaPadrao";

export async function buscarUsuarioAutenticado() {
    return await chamadaAPI("/auth/me", "GET");
}

export async function logoutUsuario() {
    return await chamadaAPI("/auth/logout", "POST");
}
