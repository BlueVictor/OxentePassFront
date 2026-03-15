
'use client'
import { redirect } from "next/navigation";
import { chamadaAPI } from "../../backend/chamadaPadrao";
import { useState } from 'react';
import Link from "next/link";

export default function login() {
  const [formData, setFormData] = useState({
    cpf: '',
    senha: ''
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
      "/usuario/login", 
      "POST", 
      formData
    )

    if (!response) {
      console.error("Falha no login")
      return
    }

    // Vale a pena fazer um "retorno dinamico" aqui
    // (redirecionar para a pagina que o usuario estava antes)
    redirect ("/") 
  }

  return (
    <div className="flex flex-row">
      <div className="w-1/3 flex-auto"></div>
      <div className="w-1/3 flex-auto">
        <div className="text-4xl mt-8 grow text-center">Login</div>
        <div id="form" className="p-8 mt-8 bg-gray-200 rounded-xl grow">
          <form action={formAction}>
            <div id="inputText" className="flex flex-col">
              <label htmlFor="cpf">CPF</label>
              <input 
                type="text" 
                name="cpf" 
                id="cpf" 
                value={formData.cpf} 
                onChange={handleChange}
                maxLength={11} // Mudar caso colocar mascara
                placeholder="111.111.111-11"
                className="border p-2 rounded-sm"
              />
            </div>

            <div id="inputText" className="flex flex-col mt-5">
              <label htmlFor="senha">Senha</label>
              <input 
                type="password" 
                name="senha" 
                id="senha" 
                value={formData.senha}
                onChange={handleChange}
                minLength={8}
                placeholder="123..."
                className="border p-2 rounded-sm"/>
            </div>

            <div className="mt-5 text-center">
              <button 
                type="submit"
                className="p-3 bg-blue-600 text-gray-100 font-semibold rounded-md cursor-pointer"
              >
                Realizar Login
              </button>
            </div>
          </form>

          <div className="mt-5 text-center">
            <Link 
              href="/cadastro"
              className="text-blue-500"
            >
              Não tem uma conta? Realize seu cadastro agora!
            </Link>
          </div>
        </div>
      </div>
      <div className="w-1/3 flex-auto"></div>
    </div>
  );
}
