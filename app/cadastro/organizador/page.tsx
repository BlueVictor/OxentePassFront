'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { chamadaAPI } from "../../../backend/chamadaPadrao";
import { useToast } from "../../_components/ToastProvider";
import { useAuth } from "../../_components/Auth/AuthProvider";
import Form from "../../_components/Form";

export default function CadastroOrganizadorPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const { usuario, autenticado, loading, atualizarUsuario } = useAuth();
  const [formData, setFormData] = useState({
    cnpj: "",
    telefone: "",
    biografia: ""
  });

  useEffect(() => {
    if (!loading && !autenticado) {
      router.push("/login");
    }
  }, [autenticado, loading, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const formAction = async () => {
    if (!usuario?.id) {
      showToast("Não foi possível identificar o usuario autenticado.", "error");
      return
    }

    const response = await chamadaAPI(
      "/organizador/promover",
      "POST",
      {
        usuarioId: usuario.id,
        cnpj: formData.cnpj,
        telefone: formData.telefone,
        biografia: formData.biografia,
      }
    )

    if (!response) {
      showToast("Não foi possível realizar o cadastro com os dados informados.", "error");
      return
    }

    await atualizarUsuario();
    showToast("Promocao a organizador realizada.", "success");
    router.push("/usuario/me");
    router.refresh();
  }

  if (loading) {
    return (
      <div className="mx-auto flex w-full max-w-2xl justify-center py-12">
        <span className="text-sm text-slate-500">Carregando...</span>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-8 w-full max-w-2xl px-4 sm:px-6 lg:px-8">
      <Form
        title="Cadastro de Organizador"
        action={formAction}
        method="POST"
        buttons={
          <button
            type="submit"
            className="botao-primario"
          >
            Registrar-se
          </button>
        }
      >

        <div id="inputText" className="flex flex-col">
          <label htmlFor="cnpj">CNPJ</label>
          <input
            type="text"
            name="cnpj"
            id="cnpj"
            value={formData.cnpj}
            onChange={handleChange}
            maxLength={14}
            placeholder="Digite aqui seu CNPJ (apenas digitos)"
            className="campoTexto"
            required
          />
        </div>

        <div id="inputText" className="flex flex-col">
          <label htmlFor="telefone">Telefone</label>
          <input
            type="tel"
            name="telefone"
            id="telefone"
            value={formData.telefone}
            onChange={handleChange}
            minLength={10}
            maxLength={10}
            placeholder="Digite aqui o número de telefone"
            className="campoTexto"
            required
          />
        </div>

        <div id="inputText" className="flex flex-col">
          <label htmlFor="biografia">Biografia</label>
          <input
            type="text"
            name="biografia"
            id="biografia"
            value={formData.biografia}
            onChange={handleChange}
            placeholder="Informe aqui sua biografia"
            className="campoTexto"
            required
          />
        </div>
      </Form>
    </div>
  );
}
