export async function chamadaAPI(rota, metodo, body = {}, options = {}) {
    const {
        returnMeta = false,
        silenciarErro = false,
    } = options;

    try {
        const apiResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}${rota}`, {
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            method: metodo,
            body: metodo !== "GET" ? JSON.stringify(body) : undefined
        });

        const text = await apiResponse.text();

        if (!apiResponse.ok && !silenciarErro) {
            console.error("Erro no Backend: ", text);
        }

        let data;

        try {
            data = JSON.parse(text);
        }
        catch {
            data = text;
        }

        if (returnMeta) {
            return {
                ok: apiResponse.ok,
                status: apiResponse.status,
                data
            };
        }

        return data;
    }
    catch (erro) {
        console.error("Erro no Backend: ", erro);
        return null;
    }
}
