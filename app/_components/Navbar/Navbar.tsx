'use client'

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../Auth/AuthProvider";
import { ProfileDropdownButton } from "./ProfileDropdownButton";

type LinkProps = {
    id: number,
    title: string,
    href: string
}

export default function Navbar() {
    const router = useRouter();
    const { autenticado, loading, logout, usuario } = useAuth();

    // Links da Navbar (o OxentePass é estático)
    const links = [
        { id: 1, title: "Cidades", href: "/cidade" },
        { id: 2, title: "Categorias", href: "/categoria" },
        { id: 3, title: "Organização", href: "/organizador" },
    ]

    const handleLogout = async () => {
        await logout();
        router.push("/");
        router.refresh();
    };

    return (
        <nav className="navbar flex items-center justify-between">

            {/* Links Navbar */}
            <ul className="flex items-center gap-6">
                <Link
                    href="/"
                    className="text-xl mr-4 cursor-pointer"
                >
                    OxentePass
                </Link>

                {
                    links.map(
                        (link: LinkProps) => (
                            <li key={link.id}>
                                <Link className="text-lg cursor-pointer" href={link.href} >
                                    {link.title}
                                </Link>
                            </li>
                        )
                    )
                }
            </ul>

            {/* Menu Perfil */}
            {
                loading ?
                    (
                        <span className="text-sm text-white/80">
                            Carregando...
                        </span>
                    ) :
                    <ProfileDropdownButton
                        autenticado={autenticado}
                        nomeUsuario={usuario?.nome}
                        onSair={handleLogout}
                    />
            }

        </nav>
    );
}
