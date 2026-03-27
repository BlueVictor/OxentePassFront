'use client'
import "../globals.css";
import { Menu } from "../_components/Menu";

export default function MenuGeralOrganizador() {
  const menuItems = [
    { 
        titulo: "Dashboard", 
        descricao: "Acompanhamentos gerais", 
        link: "/organizador/dashboard", 
        icone: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /> 
    },
    { 
        titulo: "Eventos", 
        descricao: "Gerenciar shows e atrações", 
        link: "/organizador/evento", 
        icone: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /> 
    },
    { 
        titulo: "Cidades", 
        descricao: "Locais de atuação", 
        link: "/organizador/cidade", 
        icone: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /> 
    },
    { 
        titulo: "Categorias", 
        descricao: "Tipos de eventos", 
        link: "/organizador/categoria", 
        icone: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /> 
    },
    { 
        titulo: "Pontos de Venda", 
        descricao: "Comissionamento e PDVs", 
        link: "/organizador/ponto-venda", 
        icone: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /> 
    },
    { 
        titulo: "Vendas", 
        descricao: "Acompanhe o faturamento", 
        link: "/organizador/vendas", 
        icone: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /> 
    },
    { 
        titulo: "Ingressos", 
        descricao: "Lotes e precificação", 
        link: "/organizador/ingressos", 
        icone: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /> 
    }
  ];

  return (
    <Menu
      tituloModulo="Painel do Organizador"
      subtitulo="OXENTEPASS • GERENCIAMENTO GERAL"
      itens={menuItems}
      layout="lista"
    />
  );
}