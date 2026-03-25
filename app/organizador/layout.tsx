'use client'

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../_components/Auth/AuthProvider";
import { useToast } from "../_components/ToastProvider";

export default function OrganizadorLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter();
  const { showToast } = useToast();
  const { autenticado, organizador, loading } = useAuth();

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!autenticado) {
      showToast("Você precisa estar logado como organizador para acessar essa página!", "info");
      router.replace("/login");
      return;
    }

    if (!organizador) {
      showToast("Você precisa ser um organizador para acessar essa página!", "info");
      router.replace("/");
    }
  }, [showToast, autenticado, organizador, loading, router]);

  if (loading || !autenticado || !organizador) {
    return null;
  }

  return (
    <>
      {children}
    </>
  );
}