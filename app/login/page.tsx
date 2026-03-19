'use client'

import { useRouter } from "next/navigation";
import { chamadaAPI } from "../../backend/chamadaPadrao";
import { useState } from "react";
import Link from "next/link";
import "../globals.css";
import Form from "../_components/Form";
import { useAuth } from "../_components/AuthProvider";

export default function LoginPage() {
  const router = useRouter();
  const { atualizarUsuario } = useAuth();
  const [formData, setFormData] = useState({
    cpf: "",
    senha: ""
  });
  const [erroLogin, setErroLogin] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
        ...prev,
          [name]: value
    }));
  };

  const formAction = async () => {
    setErroLogin("");

    const response = await chamadaAPI(
      "/usuario/login", 
      "POST", 
      formData
    )

    if (!response) {
      setErroLogin("Não foi possível realizar o login com os dados informados.");
      return
    }

    // Vale a pena fazer um "retorno dinamico" aqui
    // (redirecionar para a pagina que o usuario estava antes)
    await atualizarUsuario();
    router.push("/");
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
            Não tem uma conta? Realize seu cadastro agora!
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
            placeholder="Digite aqui seu cpf (apenas dígitos)"
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

        {erroLogin ? (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {erroLogin}
          </p>
        ) : null}
      </Form>
    </div>
  );
}
