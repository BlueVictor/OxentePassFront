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
          </div>
    );
}
