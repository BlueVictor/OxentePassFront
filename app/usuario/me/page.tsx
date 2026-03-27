'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import HeaderCard from "../../_components/HeaderCard";
import ActionCard from "../../_components/ActionCard";
import { editarMeuPerfilOrganizador, buscarMeuPerfilOrganizador } from "../../../backend/chamadasOrganizador";
import { buscarMeuPerfil, editarUsuario } from "../../../backend/chamadasUsuario";
import { useAuth } from "../../_components/Auth/AuthProvider";
import { useToast } from "../../_components/ToastProvider";
import {Edit, User, X } from "lucide-react";

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
    const { autenticado, loading, organizador, usuario, atualizarUsuario } = useAuth();
    const [perfil, setPerfil] = useState<MeuPerfil | null>(null);
    const [perfilOrganizador, setPerfilOrganizador] = useState<PerfilOrganizador | null>(null);
    const [erroPerfilOrganizador, setErroPerfilOrganizador] = useState(false);
    const [carregandoPerfil, setCarregandoPerfil] = useState(true);
    const [editandoConta, setEditandoConta] = useState(false);
    const [editandoOrganizador, setEditandoOrganizador] = useState(false);
    const [salvandoConta, setSalvandoConta] = useState(false);
    const [salvandoOrganizador, setSalvandoOrganizador] = useState(false);
    const [formConta, setFormConta] = useState({
        nome: "",
        email: "",
    });
    const [formOrganizador, setFormOrganizador] = useState({
        telefone: "",
        biografia: "",
    });

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
        setFormConta({
            nome: response.nome,
            email: response.email,
        });

        if (organizador) {
            const responseOrganizador = await buscarMeuPerfilOrganizador();

            if (!responseOrganizador) {
                setPerfilOrganizador(null);
                setErroPerfilOrganizador((estadoAtual) => {
                    if (!estadoAtual) {
                        showToast("Não foi possível carregar os dados de organizador.", "error");
                    }

                    return true;
                });
            } else {
                setPerfilOrganizador(responseOrganizador);
                setFormOrganizador({
                    telefone: responseOrganizador.telefone ?? "",
                    biografia: responseOrganizador.biografia ?? "",
                });
                setErroPerfilOrganizador(false);
            }
        } else {
            setPerfilOrganizador(null);
            setErroPerfilOrganizador(false);
        }

        setCarregandoPerfil(false);
    };

    useEffect(() => {
        if (!loading && !autenticado) {
            router.push("/login");
        }
    }, [autenticado, loading, router]);

    useEffect(() => {
        if (!loading) {
            carregarPerfil();
        }
    }, [autenticado, loading, organizador, router, showToast]);

    const handleContaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;

        setFormConta((estadoAtual) => ({
            ...estadoAtual,
            [name]: value,
        }));
    };

    const handleOrganizadorChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = event.target;

        setFormOrganizador((estadoAtual) => ({
            ...estadoAtual,
            [name]: value,
        }));
    };

    const cancelarEdicaoConta = () => {
        if (!perfil) {
            return;
        }

        setFormConta({
            nome: perfil.nome,
            email: perfil.email,
        });
        setEditandoConta(false);
    };

    const cancelarEdicaoOrganizador = () => {
        if (!perfilOrganizador) {
            return;
        }

        setFormOrganizador({
            telefone: perfilOrganizador.telefone ?? "",
            biografia: perfilOrganizador.biografia ?? "",
        });
        setEditandoOrganizador(false);
    };

    const salvarConta = async () => {
        if (!usuario?.id) {
            showToast("Não foi possível identificar o usuário autenticado.", "error");
            return;
        }

        setSalvandoConta(true);

        const response = await editarUsuario(usuario.id, formConta);

        setSalvandoConta(false);

        if (!response) {
            showToast("Não foi possível atualizar seus dados agora.", "error");
            return;
        }

        await atualizarUsuario();
        await carregarPerfil();
        setEditandoConta(false);
        showToast("Dados da conta atualizados com sucesso.", "success");
    };

    const salvarOrganizador = async () => {
        setSalvandoOrganizador(true);

        const response = await editarMeuPerfilOrganizador(formOrganizador);

        setSalvandoOrganizador(false);

        if (!response) {
            showToast("Não foi possível atualizar os dados de organizador agora.", "error");
            return;
        }

        await carregarPerfil();
        setEditandoOrganizador(false);
        showToast("Dados de organizador atualizados com sucesso.", "success");
    };

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
                details="Visualize e edite os dados privados vinculados a sua conta autenticada."
            />

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
                    <div>
                        <h2 className="text-xl font-semibold text-slate-900 flex gap-2">
                            {<User size={30} />}
                            Dados da conta
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Informações disponíveis apenas para você
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => editandoConta ? cancelarEdicaoConta() : setEditandoConta(true)}
                        className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 flex gap-2 items-center"
                    >
                        {editandoConta ? <X size={12}/> : <Edit size={20} />}
                        {editandoConta ? "Cancelar" : "Editar"}
                    </button>
                </div>

                {editandoConta ? (
                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                        <div className="rounded-2xl bg-slate-50 p-4">
                            <label htmlFor="nome" className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Nome
                            </label>
                            <input
                                id="nome"
                                name="nome"
                                value={formConta.nome}
                                onChange={handleContaChange}
                                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-400"
                            />
                        </div>

                        <div className="rounded-2xl bg-slate-50 p-4">
                            <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={formConta.email}
                                onChange={handleContaChange}
                                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-400"
                            />
                        </div>

                        <div className="rounded-2xl bg-slate-50 p-4">
                            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                CPF
                            </span>
                            <p className="mt-2 text-base font-medium text-slate-900">
                                {perfil.cpf}
                            </p>
                        </div>

                        <div className="flex items-end justify-end sm:col-span-2">
                            <button
                                type="button"
                                onClick={salvarConta}
                                disabled={salvandoConta}
                                className="botao-primario disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                {salvandoConta ? "Salvando..." : "Salvar alterações"}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                        <div className="rounded-2xl bg-slate-50 p-4">
                            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Nome
                            </span>
                            <p className="mt-2 text-base font-medium text-slate-900">
                                {perfil.nome}
                            </p>
                        </div>

                        <div className="rounded-2xl bg-slate-50 p-4">
                            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                CPF
                            </span>
                            <p className="mt-2 text-base font-medium text-slate-900">
                                {perfil.cpf}
                            </p>
                        </div>

                        <div className="rounded-2xl bg-slate-50 p-4 sm:col-span-2">
                            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Email
                            </span>
                            <p className="mt-2 text-base font-medium text-slate-900">
                                {perfil.email}
                            </p>
                        </div>
                    </div>
                )}
            </section>

            {organizador && perfilOrganizador ? (
                <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                    <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
                        <div>
                            <h2 className="text-xl font-semibold text-slate-900 flex gap-2">
                                {<User size={30}/>}
                                Dados de organizador
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                Suas outras informações
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => editandoOrganizador ? cancelarEdicaoOrganizador() : setEditandoOrganizador(true)}
                            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 flex gap-2 items-center"
                        >
                            {editandoOrganizador ? <X size={12} /> : <Edit size={20} />}
                            {editandoOrganizador ? "Cancelar" : "Editar"}
                        </button>
                    </div>

                    {editandoOrganizador ? (
                        <div className="mt-6 grid gap-4 sm:grid-cols-2">
                            <div className="rounded-2xl bg-slate-50 p-4">
                                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    CNPJ
                                </span>
                                <p className="mt-2 text-base font-medium text-slate-900">
                                    {perfilOrganizador.cnpj}
                                </p>
                            </div>

                            <div className="rounded-2xl bg-slate-50 p-4">
                                <label htmlFor="telefone" className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Telefone
                                </label>
                                <input
                                    id="telefone"
                                    name="telefone"
                                    value={formOrganizador.telefone}
                                    onChange={handleOrganizadorChange}
                                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-400"
                                />
                            </div>

                            <div className="rounded-2xl bg-slate-50 p-4 sm:col-span-2">
                                <label htmlFor="biografia" className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Biografia
                                </label>
                                <textarea
                                    id="biografia"
                                    name="biografia"
                                    rows={5}
                                    value={formOrganizador.biografia}
                                    onChange={handleOrganizadorChange}
                                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-400"
                                />
                            </div>

                            <div className="flex items-end justify-end sm:col-span-2">
                                <button
                                    type="button"
                                    onClick={salvarOrganizador}
                                    disabled={salvandoOrganizador}
                                    className="botao-primario disabled:cursor-not-allowed disabled:opacity-70"
                                >
                                    {salvandoOrganizador ? "Salvando..." : "Salvar alteracçõs"}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="mt-6 grid gap-4 sm:grid-cols-2">
                            <div className="rounded-2xl bg-slate-50 p-4">
                                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    CNPJ
                                </span>
                                <p className="mt-2 text-base font-medium text-slate-900">
                                    {perfilOrganizador.cnpj}
                                </p>
                            </div>

                            <div className="rounded-2xl bg-slate-50 p-4">
                                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Telefone
                                </span>
                                <p className="mt-2 text-base font-medium text-slate-900">
                                    {perfilOrganizador.telefone}
                                </p>
                            </div>

                            <div className="rounded-2xl bg-slate-50 p-4 sm:col-span-2">
                                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Biografia
                                </span>
                                <p className="mt-2 text-base font-medium text-slate-900">
                                    {perfilOrganizador.biografia}
                                </p>
                            </div>
                        </div>
                    )}
                </section>
            ) : null}

            {organizador && erroPerfilOrganizador ? (
                <div className="rounded-[2rem] border border-amber-200 bg-amber-50 px-6 py-4 text-sm font-medium text-amber-800 shadow-sm">
                    Os dados complementares de organizador não puderam ser exibidos neste momento.
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
