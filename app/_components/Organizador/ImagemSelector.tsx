'use client';

import { getS3URL } from '@/funcoes/helpers';
import { useState } from 'react';
import { UploadCloud, Image as ImageIcon, Trash2, Info } from 'lucide-react';

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

  const labelClass = "text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 block mb-2";

  return (
    <div className="flex flex-col lg:flex-row gap-8 w-full">
      
      {/* Área de Seleção e Envio */}
      <div className='flex flex-col gap-5 w-full lg:w-1/2 p-6 bg-slate-50/50 border border-slate-100 rounded-[2rem]'>
        
        {/* Dropzone/Seletor de Arquivo */}
        <div>
          <label className={labelClass}>Selecionar Imagem do PC</label>
          <label
            htmlFor="input-imagem"
            className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-[1.5rem] transition-all cursor-pointer group ${
              imagemAtual ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-300 bg-white hover:bg-slate-50 hover:border-slate-400'
            }`}
          >
            <div className={`w-10 h-10 rounded-full shadow-sm flex items-center justify-center mb-2 group-hover:scale-110 transition-transform ${imagemAtual ? 'bg-emerald-500 text-white' : 'bg-white text-slate-400'}`}>
              <UploadCloud size={20} className={imagemAtual ? "text-white" : "group-hover:text-emerald-500"} />
            </div>
            <span className={`text-sm font-bold ${imagemAtual ? 'text-emerald-700' : 'text-slate-600'}`}>
              {imagemAtual ? 'Arquivo Pronto!' : 'Clique para buscar arquivo'}
            </span>
            <span className={`text-[10px] mt-1 max-w-[80%] truncate ${imagemAtual ? 'text-emerald-600 font-semibold' : 'text-slate-400'}`}>
              {nomeArquivo}
            </span>
          </label>
          <input 
            name="input-imagem" 
            id="input-imagem" 
            type="file"
            onChange={handleImagemChange}
            className="hidden"
            accept="image/*"
          />
        </div>

        {/* Seleção do Tipo de Imagem */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <label className={labelClass + " !mb-0"}>Onde ela vai aparecer?</label>
            <div className="relative group cursor-pointer flex items-center">
              <Info size={14} className="text-slate-400 hover:text-blue-500 transition-colors" />
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 bg-slate-800 text-white text-[11px] font-medium rounded-xl p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-xl text-center leading-relaxed">
                A <strong>Capa Principal</strong> é a vitrine do evento. Só pode existir uma capa por vez.<br/><br/>As imagens <strong>Comuns</strong> vão para a galeria de fotos.
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3">
            <label className="flex-1 flex items-center justify-center gap-2 p-3 border-2 border-slate-100 rounded-xl cursor-pointer hover:bg-slate-50 transition-all has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50 has-[:checked]:text-blue-700 text-slate-500 font-bold text-[12px] bg-white shadow-sm">
              <input type="radio" name="capa" value="true" checked={capa === true} onChange={() => setCapa(true)} className="hidden" />
              Capa Principal
            </label>
            <label className="flex-1 flex items-center justify-center gap-2 p-3 border-2 border-slate-100 rounded-xl cursor-pointer hover:bg-slate-50 transition-all has-[:checked]:border-slate-500 has-[:checked]:bg-slate-100 has-[:checked]:text-slate-800 text-slate-500 font-bold text-[12px] bg-white shadow-sm">
              <input type="radio" name="capa" value="false" checked={capa === false} onChange={() => setCapa(false)} className="hidden" />
              Galeria (Comum)
            </label>
          </div>
        </div>

        {/* BOTÃO DE CONFIRMAR O ENVIO (O que estava sumido!) */}
        <button 
          type="button" 
          onClick={adicionar}
          disabled={!imagemAtual}
          className="mt-2 w-full flex items-center justify-center gap-2 px-4 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[11px] uppercase tracking-widest rounded-xl shadow-lg shadow-emerald-200 transition-all active:scale-[0.98] disabled:opacity-40 disabled:active:scale-100 disabled:shadow-none disabled:hover:bg-emerald-600 cursor-pointer disabled:cursor-not-allowed"
        >
          <ImageIcon size={18} />
          Salvar Imagem na Lista
        </button>
      </div>

      {/* Área de Preview / Lista */}
      <div className='w-full lg:w-1/2 flex flex-col gap-3'>
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-2">Lista de Imagens Salvas ({imagens.length})</h3>
        
        {imagens.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-300 border-2 border-dashed border-slate-200 rounded-[2rem] p-8 bg-slate-50/50">
            <ImageIcon size={40} className="mb-3 opacity-50 text-slate-400" />
            <p className="text-sm font-semibold text-center text-slate-500">A galeria está vazia.</p>
            <p className="text-[11px] font-medium text-center text-slate-400 mt-1 max-w-[200px]">Use o painel ao lado para enviar fotos do evento.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3 max-h-[420px] overflow-y-auto custom-scrollbar pr-2">
            {imagens.map((img: Imagem, index: number) => (
              <div key={index} className="flex items-center gap-4 bg-white border border-slate-200 p-3 rounded-[1.2rem] shadow-sm hover:border-slate-300 transition-all hover:shadow-md group">
                
                <div className="relative w-20 h-20 shrink-0 rounded-xl overflow-hidden border border-slate-100 bg-slate-100">
                  <img
                    src={img.S3 == null ? URL.createObjectURL(img.file) : getS3URL(img.S3)}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex flex-col flex-1 overflow-hidden justify-center">
                  <span className="font-bold text-sm text-slate-700 truncate block w-full">{img.nome}</span>
                  {img.capa ? (
                    <span className="inline-flex items-center gap-1 text-[9px] font-black text-blue-600 uppercase tracking-widest mt-1.5 bg-blue-50 w-max px-2 py-1 rounded-md">
                      <span>⭐</span> Capa do Evento
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1.5 bg-slate-100 w-max px-2 py-1 rounded-md">
                      Galeria
                    </span>
                  )}
                </div>

                <button 
                  type="button"
                  onClick={() => remover(index)}
                  title='Remover Imagem'
                  className='p-3 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors shrink-0 opacity-80 group-hover:opacity-100'
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}