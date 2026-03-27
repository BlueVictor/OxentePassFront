'use client'

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "../Auth/AuthProvider";
import { ProfileDropdownButton } from "./ProfileDropdownButton";
import { ShoppingCart } from "lucide-react";

type LinkProps = {
    id: number,
    title: string,
    href: string
}

export default function Navbar() {
    const router = useRouter();
    const { autenticado, loading, logout, usuario } = useAuth();
    
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        const updateCount = () => {
            const salvo = JSON.parse(localStorage.getItem('carrinho_oxente') || '[]');
            setCartCount(salvo.length);
        };

        updateCount();
        window.addEventListener('storage', updateCount);
        window.addEventListener('cart-updated', updateCount);

        return () => {
            window.removeEventListener('storage', updateCount);
            window.removeEventListener('cart-updated', updateCount);
        };
    }, []);

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
        <header className="w-full z-50 bg-[#0056b3] shadow-md h-16 flex items-center shrink-0">
            <nav className="w-full px-6 md:px-10 lg:px-12 flex items-center justify-between">
                
                {/* Lado Esquerdo: Logo e Links */}
                <ul className="flex items-center gap-6 md:gap-12">
                    <li>
                        <Link href="/" className="text-xl mr-4 cursor-pointer flex items-center gap-2">
                            <div>
                                <img src="/logo.svg" alt="logo" width={50} />
                            </div>
                            <div className="text-white">
                                <span className="font-bold text-yellow-300">Oxente</span>
                                <span className="font-semibold">Pass</span>
                            </div>
                        </Link>
                    </li>

                    {/* Mapeamento dos Links restaurado */}
                    {links.map((link: LinkProps) => (
                        <li key={link.id}>
                            <Link 
                                href={link.href}
                                className="text-[13px] font-bold text-white/80 hover:text-white transition-colors cursor-pointer tracking-wider uppercase" 
                            >
                                {link.title}
                            </Link>
                        </li>
                    ))}
                </ul>

                {/* Lado Direito: Carrinho e Perfil */}
                <div className="flex items-center gap-6">
                    
                    <Link href="/carrinho" className="relative p-2 text-white/80 hover:text-white transition-all group">
                        <ShoppingCart size={22} />
                        {cartCount > 0 && (
                            <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white shadow-sm animate-in fade-in zoom-in">
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    {/* Fechamento correto das tags restaurado */}
                    {loading ? (
                        <span className="text-sm text-white/80 font-medium animate-pulse">
                            Carregando...
                        </span>
                    ) : (
                        <ProfileDropdownButton
                            autenticado={autenticado}
                            nomeUsuario={usuario?.nome}
                            onSair={handleLogout}
                        />
                    )}
                </div>
            </nav>
        </header>
    );
}