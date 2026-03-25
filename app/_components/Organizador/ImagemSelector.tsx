'use client';

import { getS3URL } from '@/funcoes/helpers';
import { useState } from 'react';

type Imagem = {
  id: number,
  S3: string,
  file: File,
  nome: string,
  capa: boolean
}

export default function ImagemSelector({ imagens, setImagens }: any) {
  const [imagemAtual, setImagemAtual] = useState<File|null>(null);
  const [capa, setCapa] = useState<Boolean>(false);
  const [nomeArquivo, setNomeArquivo] = useState("Nenhum arquivo selecionado")

  const adicionar = () => {
    if (!imagemAtual) return

    setImagens((prev: any) => {
      let novas = [...prev]

      if (capa) {
        novas = novas.map(img => ({...img, capa: false}))
      }

      return [...novas, { id: null, S3: null, file: imagemAtual, nome: imagemAtual.name, capa: capa }]
    })

    setImagemAtual(null)
    setNomeArquivo("Nenhum arquivo selecionado")
    setCapa(false)
  }

  const remover = (index: number) => {
    setImagens((prev: any) => {
      const novas = prev.filter((_: any, i: number) => i !== index)

      // se removeu a capa, define outra automaticamente
      if (novas.length > 0 && !novas.some((img: { capa: any }) => img.capa)) {
        novas[0].capa = true
      }

      return novas
    })
  };

  const handleImagemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return
    setImagemAtual(e.target.files[0])
    setNomeArquivo(e.target.files[0].name)
  }

  return (
    <div>
      <h1 className="mt-1 mb-1.5">Gerir Imagens</h1>
      <div className="flex flex-row gap-6 space-y-3 border border-slate-200 rounded-xl p-3">
        {/* Inserção de imagens */}
        <div className='flex flex-col gap-3 w-1/2'>
          {/* Botão customizado */}
          <label
            htmlFor="imagens"
            className="border border-slate-200 rounded-xl p-2 w-full cursor-pointer text-center bg-gray-50 hover:bg-gray-100"
          >
            Escolher arquivo
          </label>

          {/* Input escondido */}
          <input 
            name="imagens" 
            id="imagens" 
            type="file"
            onChange={(e) => {handleImagemChange(e)}}
            className="hidden"
          />

          {/* Texto controlado */}
          <span className="text-sm text-gray-600 mt-1 block">
            {nomeArquivo}
          </span>
          <div className="flex flex-row gap-3">
            <div className='flex flex-row'>
              <label>Tipo de imagem:</label>
              {/* Ícone */}
              <div className="relative group cursor-pointer">
                <span className="text-gray-500">ⓘ</span>

                {/* Tooltip */}
                <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-64 
                                bg-black text-white text-xs rounded p-2
                                opacity-0 group-hover:opacity-100
                                transition-opacity pointer-events-none z-10">
                  A imagem de capa é a principal do evento, usada como destaque em seu card.
                  Cada evento pode ter somente UMA imagem de capa.
                </div>
              </div>
            </div>
            <div className='flex flex-row'>
              <input 
                type="radio" 
                name="capa" 
                id="Nao"
                value={"true"}
                checked={capa === true}
                onChange={() => setCapa(true)}
                className='mr-1'
              /> 
              <div>Capa</div>
            </div>

            <div className='flex flex-row'>
              <input 
                type="radio" 
                name="capa" 
                id="capa"
                value={"false"}
                checked={capa === false}
                onChange={() => setCapa(false)}
                className='mr-1'
              /> 
              <div>Comum</div>
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

        {/* Listagem de imagems */}
        <div className='max-h-40 overflow-y-auto w-1/2'>
          {imagens.map((img: Imagem, index: number) => (
            <div 
              key={index} 
              className="flex items-center gap-4 mb-2"
            >
              {/* Preview */}
              <img
                src={img.S3 == null ? URL.createObjectURL(img.file) : getS3URL(img.S3)}
                alt="preview"
                className="w-15 h-15 object-cover rounded"
              />

              {/* Info */}
              <div className="flex flex-col">
                <span>{img.nome}</span>

                {img.capa && (
                  <span className="text-green-600 text-sm">
                    Capa
                  </span>
                )}
              </div>

              {/* Ações */}
              <button 
                onClick={() => remover(index)}
                title='Remover Imagem'
                className='w-6 h-6 bg-red-500 text-white rounded-full cursor-pointer'
              >
                ✕
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}