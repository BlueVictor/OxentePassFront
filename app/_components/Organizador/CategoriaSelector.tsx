'use client';

import { useState } from 'react';

export default function CategoriaSelector({ tagsExistentes, tagsSelecionadasInit = []}: any) {
  const [selecionadas, setSelecionadas] = useState<any[]>(tagsSelecionadasInit);
  const [novas, setNovas] = useState<string[]>([]);
  const [input, setInput] = useState('');

  const toggleTag = (tag: any) => {
    setSelecionadas((prev) =>
      prev.find((t) => t.id === tag.id)
        ? prev.filter((t) => t.id !== tag.id)
        : [...prev, tag]
    );
    console.log("selecionadas: " + selecionadas)
  };

  const adicionarNova = () => {
    if (!input.trim()) return;

    setNovas((prev) => [...prev, input]);
    setInput('');
  };

  return (
    <div>
      <h1 className="my-1">Gerir Categorias</h1>
      <div className="space-y-3 border border-slate-200 rounded-xl p-3">
        {/* Subtitulos */}
        <div className='flex flex-row gap-4'>
          <h2 className='w-1/2'>Selecione categorias existentes</h2>
          <h2 className='w-1/2'>Crie uma nova categoria</h2>
        </div>

        {/* Seleção de Categorias */}
        <div className='flex flex-row gap-4'>
          {/* TAGS EXISTENTES */}
          <div className="flex flex-wrap gap-3 w-1/2">
            {tagsExistentes.map((tag: any) => {
              const ativa = selecionadas.some((t) => t.id === tag.id);

              return (
                <button
                  type="button"
                  key={tag.id}
                  onClick={() => toggleTag(tag)}
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
                className="border border-slate-200 rounded-xl p-2" 
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
              {novas.map((tag, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => setNovas(prev => prev.filter((_, idx) => idx !== i))}
                  className="bg-green-200 px-2 py-1 rounded"
                >
                  {tag} ✕
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* IDs das existentes */}
        {selecionadas.map((tag) => (
          <input
            key={"h"+tag.id}
            type="hidden"
            name="tagsExistentes"
            value={tag.id}
          />
        ))}

        {/* Novas tags */}
        {novas.map((tag, i) => (
          <input
            key={"h"+i}
            type="hidden"
            name="tagsNovas"
            value={tag}
          />
        ))}
      </div>
    </div>
  );
}