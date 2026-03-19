'use client'
import "../globals.css";
import { Menu } from "../_components/Menu";

export default function MenuGeralVendas() {
  const itensVendas = [
    {
      titulo: "Listar Vendas",
      descricao: "Visualizar todo o histórico de transações",
      link: "/vendas/listar",
      icone: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
    },
    {
      titulo: "Filtrar por Status",
      descricao: "Buscar ativas, finalizadas ou canceladas",
      link: "/vendas/filtrar",
      icone: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
    },
    {
      titulo: "Buscar por ID",
      descricao: "Localizar uma transação específica via código",
      link: "/vendas/buscar-id",
      icone: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 21h7a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v11m0 5l4.879-4.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242z" />
    },
    {
      titulo: "Vendas por Usuário",
      descricao: "Histórico completo de compras de um cliente",
      link: "/vendas/buscar-usuario",
      icone: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    }
  ];

  return (
    <Menu 
      letraInicial="V"
      tituloModulo="Módulo de Vendas"
      subtitulo="OXENTEPASS • PAINEL GERENCIAL"
      itens={itensVendas}
      layout="lista"
    />
  );
}