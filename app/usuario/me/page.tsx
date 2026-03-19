'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import HeaderCard from "../../_components/HeaderCard";
import DetailsCard from "../../_components/DetailsCard";
import ActionCard from "../../_components/ActionCard";
import { buscarMeuPerfil, buscarMeuPerfilOrganizador } from "../../../backend/chamadaPadrao";
import { useAuth } from "../../_components/Auth/AuthProvider";
import { useToast } from "../../_components/ToastProvider";

type MeuPerfil = {
    nome: string;
    cpf: string;
    email: string;
};

type PerfilOrganizador = {
    cnpj: string;
    telefone: string;
    biografia: string;
};

export default function MeuPerfilPage() {
    const router = useRouter();
    const { showToast } = useToast();
    const { autenticado, loading, organizador } = useAuth();
    const [perfil, setPerfil] = useState<MeuPerfil | null>(null);
    const [perfilOrganizador, setPerfilOrganizador] = useState<PerfilOrganizador | null>(null);
    const [erroPerfilOrganizador, setErroPerfilOrganizador] = useState(false);
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

            if (organizador) {
                const responseOrganizador = await buscarMeuPerfilOrganizador();

                if (!responseOrganizador) {
                    setPerfilOrganizador(null);
                    setErroPerfilOrganizador((estadoAtual) => {
                        if (!estadoAtual) {
                            showToast("Nao foi possivel carregar os dados de organizador.", "error");
                        }

                        return true;
                    });
                } else {
                    setPerfilOrganizador(responseOrganizador);
                    setErroPerfilOrganizador(false);
                }
            } else {
                setPerfilOrganizador(null);
                setErroPerfilOrganizador(false);
            }

            setCarregandoPerfil(false);
        };

        if (!loading) {
            carregarPerfil();
        }
    }, [autenticado, loading, organizador, router, showToast]);

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
                pageTitle="Área do usuário"
                headerTitle={perfil.nome}
                details="Visualize os dados privados vinculados a sua conta autenticada."
            />

            <DetailsCard
                title="Dados da conta"
                description="Informações disponíveis apenas para você"
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

            {organizador && perfilOrganizador ? (
                <DetailsCard
                    title="Dados de organizador"
                    description="Suas outras informacoes"
                    items={[
                        {
                            label: "CNPJ",
                            value: perfilOrganizador.cnpj,
                        },
                        {
                            label: "Telefone",
                            value: perfilOrganizador.telefone,
                        },
                        {
                            label: "Biografia",
                            value: perfilOrganizador.biografia,
                            colSpan: 2,
                        },
                    ]}
                />
            ) : null}

            {organizador && erroPerfilOrganizador ? (
                <div className="rounded-[2rem] border border-amber-200 bg-amber-50 px-6 py-4 text-sm font-medium text-amber-800 shadow-sm">
                    Os dados complementares de organizador nao puderam ser exibidos neste momento.
                </div>
            ) : null}

            {!organizador ? (
                <ActionCard
                    href="/cadastro/organizador"
                    badge="Novo passo"
                    title="Torne-se um Organizador"
                    description="Hospede e gerencie eventos conosco."
                />
            ) : null}

        </div>
    );
}
