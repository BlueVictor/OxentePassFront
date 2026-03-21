'use client'

import { useRouter } from "next/navigation";
import { chamadaAPI } from "../../backend/chamadaPadrao";
import { useState } from "react";
import Link from "next/link";
import "../globals.css";
import Form from "../_components/Form";
import { useAuth } from "../_components/Auth/AuthProvider";
import { useToast } from "../_components/ToastProvider";

export default function LoginPage() {
  const router = useRouter();
  const { atualizarUsuario } = useAuth();
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    cpf: "",
    senha: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const deveRedirecionarParaHome = () => {
    const referrer = document.referrer;

    if (!referrer) {
      return false;
    }

    try {
      const referrerURL = new URL(referrer);
      const mesmaOrigem = referrerURL.origin === window.location.origin;

      return mesmaOrigem && referrerURL.pathname.startsWith("/cadastro");
    }
    catch {
      return false;
    }
  };

  const formAction = async () => {
    const response = await chamadaAPI(
      "/usuario/login",
      "POST",
      formData
    )

    if (!response) {
      showToast("Não foi possível realizar o login com os dados informados.", "error");
      return
    }

    await atualizarUsuario();

    if (deveRedirecionarParaHome()) {
      router.push("/");
      router.refresh();
      return;
    }

    router.back();
    router.refresh();
  }

  return (
    <div className="mx-auto mt-8 w-full max-w-2xl px-4 sm:px-6 lg:px-8">
      <Form
        title="Login"
        action={formAction}
        method="POST"
        buttons={
          <button
            type="submit"
            className="botao-primario"
          >
            Realizar Login
          </button>
        }
        footer={
          <Link
            href="/cadastro"
            className="text-blue-600 transition hover:text-blue-800"
          >
            Nao tem uma conta? Realize seu cadastro agora!
          </Link>
        }
      >
        <div id="inputText" className="flex flex-col">
          <label htmlFor="cpf">CPF</label>
          <input
            type="text"
            name="cpf"
            id="cpf"
            value={formData.cpf}
            onChange={handleChange}
            maxLength={11}
            placeholder="Digite aqui seu cpf (apenas digitos)"
            className="campoTexto"
          />
        </div>

        <div id="inputText" className="flex flex-col">
          <label htmlFor="senha">Senha</label>
          <input
            type="password"
            name="senha"
            id="senha"
            value={formData.senha}
            onChange={handleChange}
            minLength={8}
            placeholder="Digite aqui sua senha"
            className="campoTexto"
          />
        </div>
      </Form>
    </div>
  );
}
