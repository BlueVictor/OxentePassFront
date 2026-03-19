'use client'

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "./Auth/AuthProvider";

export default function Navbar() {
    const router = useRouter();
    const { autenticado, loading, logout } = useAuth();

    const handleLogout = async () => {
        await logout();
        router.push("/login");
        router.refresh();
    };

    return (
        <nav className="navbar flex items-center justify-between">
            <ul className="flex items-center gap-6">
                <li>
                    <Link
                        href="/"
                        className="text-xl mr-4 cursor-pointer"
                    >
                        OxentePass
                    </Link>
                </li>

                <li>
                    <Link
                        href="/cidade"
                        className="text-lg cursor-pointer"
                    >
                        Cidades
                    </Link>
                </li>

                <li>
                    <Link
                        href="/categoria"
                        className="text-lg cursor-pointer"
                    >
                        Categorias
                    </Link>
                </li>

                <li>
                    <Link
                        href="/vendas"
                        className="text-lg cursor-pointer"
                    >
                        Vendas
                    </Link>
                </li>

                <li>
                    <Link
                        href="/ingressos"
                        className="text-lg cursor-pointer"
                    >
                        Ingressos
                    </Link>
                </li>
            </ul>

            <ul className="flex items-center gap-4">
                {loading ? (
                    <span className="text-sm text-white/80">
                        Carregando...
                    </span>
                ) : autenticado ? (
                    <>
                        <li className="flex items-center">
                            <Link href="/usuario/me" className="text-lg cursor-pointer">
                                Meu Perfil
                            </Link>
                        </li>

                        <li>
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="cursor-pointer rounded-md border border-white/20 px-3 py-1 text-sm font-medium text-white transition hover:bg-red-500"
                            >
                                Sair
                            </button>
                        </li>
                    </>
                ) : (
                    <Link
                        href="/login"
                        className="text-lg cursor-pointer"
                    >
                        Login
                    </Link>
                )}
            </ul>
        </nav>
    );
}
