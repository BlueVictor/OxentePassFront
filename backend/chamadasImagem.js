
export async function criarImagem (idEvento, capa, imgData) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/evento/${idEvento}/imagens/capa/${capa}`, {
      method: "POST",
      body: imgData,
      credentials: "include"
    })

    return response
}