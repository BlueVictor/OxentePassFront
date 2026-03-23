'use client';

import { useState } from 'react';

export default function CategoriaSelector({ tagsExistentes, selecionadas, setSelecionadas, novas, setNovas}: any) {
  const [input, setInput] = useState('');

  const selecionarTag = (tag: any) => {
    setSelecionadas((prev: any) => {
      if (prev.includes(tag.id)) {
        return prev.filter((id: any) => id !== tag.id);
      } 
      else {
        return [...prev, tag.id];
      }
    });
  }

  const adicionarNova = () => {
    const valor = input.trim();
    if (!valor) return;

    const jaExiste =
      tagsExistentes.some((tag: any) => tag.tag.toLowerCase() === valor.toLowerCase()) || // evita duplicação na lista que vem do banco
      novas.some((n: any) => n.toLowerCase() === valor.toLowerCase());                    // evita duplicação na lista de novas

    setNovas((prev: string[]) => {
      if (jaExiste) return prev;              
      return [...prev, valor];
    });

    setInput('');
  };

  const removerNova = (valor: string) => {
    setNovas((prev: any) => prev.filter((item: string) => item !== valor));
  };

  return (
    <div>
      <h1 className="mt-1 mb-1.5">Gerir Categorias</h1>
      <div className="space-y-3 border border-slate-200 rounded-xl p-3">
        {/* Subtitulos */}
        <div className='flex flex-row gap-5'>
          <h2 className='w-1/2'>Selecione categorias existentes</h2>
          <h2></h2>
          <h2 className='w-1/2'>Crie uma nova categoria</h2>
        </div>

        {/* Seleção de Categorias */}
        <div className='flex flex-row gap-5'>
          {/* TAGS EXISTENTES */}
          <div className="flex flex-wrap gap-3 w-1/2">
            {tagsExistentes.map((tag: any) => {
              const ativa = selecionadas.includes(tag.id);

              return (
                <button
                  type="button"
                  key={tag.id}
                  onClick={() => selecionarTag(tag)}
                  className={`px-3 py-1 rounded ${
                    ativa ? 'bg-blue-600 text-white' : 'bg-gray-200'
                  }`}
                >
                  {tag.tag}
                </button>
              );
            })}
          </div>
          
          <div className="border border-slate-200"></div>

          <div className="flex flex-col gap-3 w-1/2">
            {/* NOVAS TAGS */}
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Nova Categoria"
                className="border border-slate-200 rounded-xl p-2 w-full" 
              />

              <button 
                type="button" 
                onClick={adicionarNova}
                className="px-2 py-1.5 bg-blue-500 text-white rounded-lg cursor-pointer"
              >
                Adicionar
              </button>
            </div>
            {/* LISTA DE NOVAS */}
            <div className="flex gap-2 flex-wrap">
              {novas.map((tag: any, i: any) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => removerNova(tag)}
                  className="bg-green-200 px-2 py-1 rounded cursor-pointer"
                >
                  {tag} ✕
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}