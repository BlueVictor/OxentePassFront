import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "./_components/Auth/AuthProvider";
import { ToastProvider } from "./_components/ToastProvider";
import Navbar from "./_components/Navbar/Navbar";
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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Google+Sans+Flex:opsz,wght@6..144,1..1000&display=swap" rel="stylesheet" />
        <link rel="icon" href="/logo.svg" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50 h-screen overflow-hidden flex flex-col`}
      >
        <AuthProvider>
          <ToastProvider>
            <Navbar />
            
            <main className="flex-1 w-full overflow-y-auto relative bg-slate-50">
              <div className="p-8 w-full max-w-[2500px] mx-auto min-h-full">
                {children}
              </div>
            </main>
            
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}