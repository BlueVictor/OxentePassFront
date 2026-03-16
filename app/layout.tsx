import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from 'next/link';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OxentePass",
  description: "Homepage",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header>
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
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
