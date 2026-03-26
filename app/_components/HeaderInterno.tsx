'use client'

import { useLayoutEffect } from "react";

interface HeaderInternoProps {
  titulo: string;
  subtitulo: string;
  icone?: React.ReactNode; 
  iconeString?: string;
}

export function HeaderInterno({ titulo, subtitulo, icone, iconeString }: HeaderInternoProps) {
  
  useLayoutEffect(() => {
    const style = document.createElement("style");
    style.id = "fix-screen-scroll";
    style.innerHTML = `
      html, body, main {
        overflow: hidden !important;
        height: 100vh !important;
        max-height: 100vh !important;
        position: fixed;
        width: 100%;
      }
    `;
    document.head.appendChild(style);

    return () => {
      const element = document.getElementById("fix-screen-scroll");
      if (element) element.remove();
    };
  }, []);

  return (
    <div className="bg-gradient-to-r from-emerald-600 to-teal-500 px-10 py-10 text-white relative overflow-hidden shadow-sm shrink-0">
      <div className="flex items-center gap-4 relative z-10">
        <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex shrink-0 items-center justify-center font-black text-xl shadow-sm border border-white/10">
          {icone ? icone : iconeString}
        </div>
        <div className="flex flex-col justify-center">
          <h1 className="text-2xl font-black tracking-tight uppercase leading-none mb-2">
            {titulo}
          </h1>
          <p className="text-teal-50/90 text-sm font-medium leading-none">
            {subtitulo}
          </p>
        </div>
      </div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl translate-x-10 -translate-y-10 pointer-events-none"></div>
    </div>
  );
}