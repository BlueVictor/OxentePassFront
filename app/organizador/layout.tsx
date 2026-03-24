'use client'

import { useAuth } from "../_components/Auth/AuthProvider";
import { useEffect } from "react";
import { useToast } from "../_components/ToastProvider";
import { redirect } from "next/navigation";

export default function OrganizadorLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { showToast } = useToast();
  const { autenticado, organizador } = useAuth();

  useEffect(() => {
    if(!autenticado) {
      showToast("Você precisa estar logado como organizador para acessar essa página!", "info")
      redirect("/login")
    }
    else if(!organizador) {
      showToast("Você precisa ser um organizador para acessar essa página!", "info")
      redirect("/")
    }

  }, [showToast, autenticado, organizador])

  return (
    <>
      {children}
    </>
  );
}