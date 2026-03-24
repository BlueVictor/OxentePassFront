'use client';

import { useState } from 'react';

const estadoInicialInput = {
  tipoIngresso: "",
  valorBase: "",
  quantidadeDisponivel: "",
  temMeiaEntrada: "true"
}

export default function IngressoSelector({ ingressos, setIngressos }: any) {
  const [input, setInput] = useState(estadoInicialInput);

  const adicionar = () => {
    if (input.tipoIngresso == "" || input.valorBase == "" || input.quantidadeDisponivel == "") return;

    const jaExiste =
      ingressos.some((n: any) => n.tipoIngresso.toLowerCase() === input.tipoIngresso.toLowerCase()); // evita duplicação na lista de novas

    setIngressos((prev: any[]) => {
      if (jaExiste) return prev;              
      return [...prev, {
        tipoIngresso: input.tipoIngresso,
        valorBase: Number(input.valorBase),
        quantidadeDisponivel: Number(input.quantidadeDisponivel),
        temMeiaEntrada: Boolean(input.temMeiaEntrada)
      }];
    });

    setInput(estadoInicialInput);
  };

  const remover = (valor: string) => {
    setIngressos((prev: any) => prev.filter((item: string) => item !== valor));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) => {
    const { name, value } = e.target;
    console.log(`input: ${input.tipoIngresso}, ${input.valorBase}, ${input.quantidadeDisponivel}, ${input.temMeiaEntrada}`)
    setInput((prev: any) => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div>
      <h1 className="mt-1 mb-1.5">Gerir Ingressos</h1>
      <div className="space-y-3 border border-slate-200 rounded-xl p-3">
        {/* Inserção de ingressos */}
        <div className='flex flex-row gap-5'>
          <div className="flex flex-col gap-3 w-1/2">
            <div>
              <label htmlFor="tipoIngresso">Nome do Ingresso</label>
              <input
                type='text'
                name='tipoIngresso'
                id='tipoIngresso'
                value={input.tipoIngresso}
                onChange={handleChange}
                placeholder="Nome do ingresso"
                className="border border-slate-200 rounded-xl p-2 w-full" 
              />
            </div>

            <div className='flex flew-row gap-3'>
              <div>
                <label htmlFor="valorBase">Valor Base</label>
                <input
                  type='number'
                  name='valorBase'
                  id='valorBase'
                  value={input.valorBase}
                  onChange={handleChange}
                  min={0}
                  placeholder="R$"
                  className="border border-slate-200 rounded-xl p-2 w-full" 
                />
              </div>

              <div>
                <label htmlFor="quantidadeDisponivel">Qtde disponível</label>
                <input
                  type='number'
                  name='quantidadeDisponivel'
                  id='quantidadeDisponivel'
                  value={input.quantidadeDisponivel}
                  onChange={handleChange}
                  min={1}
                  className="border border-slate-200 rounded-xl p-2 w-full" 
                />
              </div>
            </div>

            <div className="flex flex-row gap-3">
              <label>Meia entrada?</label>
              <div className='flex flex-row'>
                <input 
                  type="radio" 
                  name="temMeiaEntrada" 
                  id="Nao"
                  value={"false"}
                  checked={input.temMeiaEntrada === "false"}
                  onChange={handleChange}
                  className='mr-1'
                /> 
                <div>Não</div>
              </div>

              <div className='flex flex-row'>
                <input 
                  type="radio" 
                  name="temMeiaEntrada" 
                  id="Sim"
                  value={"true"}
                  checked={input.temMeiaEntrada === "true"}
                  onChange={handleChange}
                  className='mr-1'
                /> 
                <div>Sim</div>
              </div>
            </div>

            <button 
              type="button" 
              onClick={adicionar}
              className="px-2 py-1.5 bg-blue-500 text-white rounded-lg cursor-pointer"
            >
              Adicionar
            </button>
          </div>

          {/* Lista de Ingressos */}
          <div className="flex flew-col gap-2 w-1/2">
            {ingressos.map((ing: any, i: any) => (
              <button
                type="button"
                key={i}
                onClick={() => remover(ing)}
                className="bg-green-200 px-2 py-1 rounded cursor-pointer"
              >
                {ing.tipoIngresso} ✕
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}