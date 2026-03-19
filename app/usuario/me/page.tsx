'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import HeaderCard from "../../_components/HeaderCard";
import DetailsCard from "../../_components/DetailsCard";
import { buscarMeuPerfil } from "../../../backend/chamadaPadrao";
import { useAuth } from "../../_components/AuthProvider";

type MeuPerfil = {
    nome: string;
    cpf: string;
    email: string;
};

export default function MeuPerfilPage() {
    const router = useRouter();
    const { autenticado, loading } = useAuth();
    const [perfil, setPerfil] = useState<MeuPerfil | null>(null);
    const [carregandoPerfil, setCarregandoPerfil] = useState(true);

    useEffect(() => {
        if (!loading && !autenticado) {
            router.push("/login");
        }
    }, [autenticado, loading, router]);

    useEffect(() => {
        const carregarPerfil = async () => {
            if (!autenticado) {
                setCarregandoPerfil(false);
                return;
            }

            const response = await buscarMeuPerfil();

            if (!response) {
                router.push("/login");
                return;
            }

            setPerfil(response);
            setCarregandoPerfil(false);
        };

        if (!loading) {
            carregarPerfil();
        }
    }, [autenticado, loading, router]);

    if (loading || carregandoPerfil) {
        return (
            <div className="mx-auto flex w-full max-w-4xl justify-center py-12">
                <span className="text-sm text-slate-500">Carregando perfil...</span>
            </div>
        );
    }

    if (!perfil) {
        return null;
    }

    return (
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
            <HeaderCard
                pageTitle="Área do usuario"
                headerTitle={perfil.nome}
                details="Visualize os dados privados vinculados a sua conta autenticada."
            />

            <DetailsCard
                title="Dados da conta"
                description="Informacoes disponiveis apenas para voce"
                items={[
                    {
                        label: "Nome",
                        value: perfil.nome,
                    },
                    {
                        label: "CPF",
                        value: perfil.cpf,
                    },
                    {
                        label: "Email",
                        value: perfil.email,
                        colSpan: 2,
                    },
                ]}
            />
        </div>
    );
}
