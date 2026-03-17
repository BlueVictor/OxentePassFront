// import { ApiError } from "./ApiError";

// Chamada básica
export async function chamadaAPI (rota, metodo, body = {}) {
    try {
        const apiResponse = await fetch (`${process.env.NEXT_PUBLIC_BACKEND_API_URL}${rota}`, {
            headers: {
                "Content-Type": "application/json"
            },
            method: metodo,
            body: metodo !== "GET" ? JSON.stringify(body) : undefined
        })

        const text = await apiResponse.text();

        if (!apiResponse.ok) {
            console.error("Erro no Backend: ", text)
            return
            
            /* 
            const erroJSON = JSON.parse(text)

            throw new ApiError(
                erroJSON.status,
                erroJSON.erro,
                erroJSON.mensagem,
                erroJSON.path,
                erroJSON.detalhes
            )
            */
        }

        // Certas rotas do back retornam texto puro
        // É bom mudar o back depois, padronizar pra ficar tudo JSON
        try {
            return JSON.parse(text);
        }
        catch {
            return text;
        }
        
    }
    catch (erro) {
        console.error("Erro no Backend: ", erro)
        throw new Error (erro.message)
        /*
        throw new ApiError(
            500,
            "Erro Interno",
            "erro no servidor",
            "/",
            ""
        )
        */
    }
}