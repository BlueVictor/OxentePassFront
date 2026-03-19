'use client'

import { useRouter } from "next/navigation";
import { chamadaAPI } from "../../backend/chamadaPadrao";
import { useState } from "react";
import Link from "next/link";
import "../globals.css";
import Form from "../_components/Form";
import { useToast } from "../_components/ToastProvider";

export default function CadastroPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    email: "",
    senha: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
        ...prev,
          [name]: value
    }));
  };

  const formAction = async () => {
    const response = await chamadaAPI(
      "/usuario", 
      "POST", 
      formData
    )

    if (!response) {
      showToast("Nao foi possivel realizar o cadastro com os dados informados.", "error");
      return
    }

    // Vale a pena fazer um "retorno dinamico" aqui
    // (redirecionar para a pagina que o usuario estava antes)
    showToast("Cadastro realizado com sucesso.", "success");
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="mx-auto mt-8 w-full max-w-2xl px-4 sm:px-6 lg:px-8">
      <Form
        title="Cadastro"
        action={formAction}
        method="POST"
        buttons={
          <button
            type="submit"
            className="botao-primario"
          >
            Cadastrar-se
          </button>
        }
        footer={
          <Link
            href="/login"
            className="text-blue-600 transition hover:text-blue-800"
          >
            Ja tem uma conta? Realize seu login
          </Link>
        }
      >
        <div id="inputText" className="flex flex-col">
          <label htmlFor="nome">Nome</label>
          <input
            type="text"
            name="nome"
            id="nome"
            value={formData.nome}
            onChange={handleChange}
            placeholder="Fulano de tal"
            className="campoTexto"
            required
          />
        </div>

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
            required
          />
        </div>

        <div id="inputText" className="flex flex-col">
          <label htmlFor="email">E-mail</label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="fulano@gmail.com"
            className="campoTexto"
            required
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
            required
          />
        </div>
      </Form>
    </div>
  );
}
