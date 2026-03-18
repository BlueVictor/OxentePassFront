import { chamadaAPI } from "../../../backend/chamadaPadrao";
import HeaderCard from "../../_components/HeaderCard"
import DetailsCard from "../../_components/DetailsCard";

async function getPontoVendaById(id: string) {
    const response = await chamadaAPI(
        `/pontovenda/filtro?id=${id}`,
        "GET"
    )

    if (!response)
        return [];

    return response.content?.[0];
}

export default async function PontoVendaPage({ params, }: { params: Promise<{ id: string }> }) {

    const { id } = await params;
    const p = await getPontoVendaById(id);

    return (
        <main className="mx-auto flex w-full max-w-4xl flex-col gap-6">
            <HeaderCard
                pageTitle="ponto de venda"
                headerTitle={p.nome}
                details={p.detalhes}
            />

            <DetailsCard
                title="Endereco"
                description="Informacoes de localizacao do ponto de venda"
                items={[
                    {
                        label: "Bairro",
                        value: p.endereco.bairro,
                    },
                    {
                        label: "CEP",
                        value: p.endereco.cep,
                    },
                    {
                        label: "Rua",
                        value: `${p.endereco.rua}, ${p.endereco.numero}`,
                        colSpan: 2
                    },
                ]}
            />
        </main>
    )
}
