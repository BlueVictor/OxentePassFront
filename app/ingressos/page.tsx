'use client'
import "../globals.css";
import { Menu } from "../_components/Menu";

export default function MenuGeralIngressos() {
  const menuItems = [
    { titulo: "Listar Ingressos", descricao: "Ver todos os tipos e lotes cadastrados", link: "/ingressos/listar", icone: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /> },
    { titulo: "Filtrar por Preço", descricao: "Buscar por faixas de valores e categorias", link: "/ingressos/filtrar", icone: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /> },
    { titulo: "Buscar por ID", descricao: "Localizar um lote de ingresso específico", link: "/ingressos/buscar-id", icone: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 21h7a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v11m0 5l4.879-4.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242z" /> },
    { titulo: "Disponibilidade por Evento", descricao: "Checar estoque para um evento específico", link: "/ingressos/disponivel", icone: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /> }
  ];

  return (
    <Menu
      letraInicial="I"
      tituloModulo="Módulo de Ingressos"
      subtitulo="OXENTEPASS • CATALOGAÇÃO E ESTOQUE"
      itens={menuItems}
      layout="lista"
    />
  );
}