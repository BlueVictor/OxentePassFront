'use client'

import { createContext, useContext, useEffect, useState } from "react";
import { buscarUsuarioAutenticado, logoutUsuario } from "../../../backend/chamadasAuth";

type UsuarioAutenticado = {
    id: number;
    nome: string;
    email: string;
    tipoUsuario: string;
    autenticado: boolean;
};

type AuthContextType = {
    usuario: UsuarioAutenticado | null;
    loading: boolean;
    autenticado: boolean;
    organizador: boolean;
    atualizarUsuario: () => Promise<void>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [usuario, setUsuario] = useState<UsuarioAutenticado | null>(null);
    const [loading, setLoading] = useState(true);

    const atualizarUsuario = async () => {
        setLoading(true);

        try {
            const response = await buscarUsuarioAutenticado();
            setUsuario(response ?? null);
        }
        catch {
            setUsuario(null);
        }
        finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        await logoutUsuario();
        setUsuario(null);
    };

    useEffect(() => {
        atualizarUsuario();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                usuario,
                loading,
                autenticado: !!usuario?.autenticado,
                organizador: usuario?.tipoUsuario === "ORGANIZADOR",
                atualizarUsuario,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth deve ser usado dentro de AuthProvider.");
    }

    return context;
}
