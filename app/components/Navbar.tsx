import Link from "next/link";

export default function Navbar() {
    return (
        <div id="navbar" className="flex flex-row p-4 gap-6">
            <Link href="/" className="text-xl mr-4 cursor-pointer">
                OxentePass
            </Link>

            <Link href="/login" className="text-lg cursor-pointer">
                Login
            </Link>
        </div>
    );
}
