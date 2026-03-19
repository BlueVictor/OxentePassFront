import Link from "next/link";

export default function Navbar() {
    return (
          <div className="navbar">
            <Link 
              href="/"
              className="text-xl mr-4 cursor-pointer"
            >
              OxentePass
            </Link>

            <Link 
              href="/login"
              className="text-lg cursor-pointer"
            >
              Login
            </Link>

            <Link 
              href="/cidade"
              className="text-lg cursor-pointer"
            >
              Cidades
            </Link>

            <Link 
              href="/categoria"
              className="text-lg cursor-pointer"
            >
              Categorias
            </Link>
            
            <Link 
              href="/ponto-venda"
              className="text-lg cursor-pointer"
            >
              Pontos de Venda
            </Link>

            <Link
              href="/vendas"
              className="text-lg cursor-pointer"
            >
              Vendas
            </Link>

            <Link
              href="/ingressos"
              className="text-lg cursor-pointer"
            >
              Ingressos
            </Link>
          </div>
    );
}
