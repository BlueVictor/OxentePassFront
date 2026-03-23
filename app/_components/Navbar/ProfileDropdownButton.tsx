"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronDown, User, LogIn, UserPlus, UserCircle, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

interface ProfileDropdownItem {
  title: string;
  icon?: ReactNode;
  onClick?: () => void;
  separate?: boolean;
  danger?: boolean;
}

interface ProfileDropdownButtonProps {
  autenticado: boolean;
  nomeUsuario?: string | null;
  onLogin?: () => void;
  onCadastro?: () => void;
  onMeuPerfil?: () => void;
  onSair?: () => void;
  className?: string;
  buttonClassName?: string;
  menuClassName?: string;
}

export function ProfileDropdownButton({
  autenticado,
  nomeUsuario,
  onSair,
}: ProfileDropdownButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  const label = autenticado && nomeUsuario?.trim() ? nomeUsuario : "Perfil";

  // Parte modificável aqui
  const items: ProfileDropdownItem[] =
    autenticado ? [
      { title: "Meu perfil", icon: <UserCircle />, onClick: () => router.push("/usuario/me") },
      { title: "Sair", icon: <LogOut />, onClick: onSair, separate: true, danger: true },
    ]
      : [
        { title: "Login", icon: <LogIn />, onClick: () => router.push("/login") },
        { title: "Cadastro", icon: <UserPlus />, onClick: () => router.push("/cadastro") },
      ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  function handleSelect(item: ProfileDropdownItem) {
    item.onClick?.();
    setIsOpen(false);
  }

  return (
    <div ref={containerRef} className={`relative inline-block`.trim()}>
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        className={"inline-flex min-w-[180px] items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-bold text-slate-700 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50"}
      >
        <span className="flex min-w-0 items-center gap-3">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center text-slate-400">
            <User className="h-5 w-5" />
          </span>
          <span className="truncate max-w-30">{label}</span>
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {
        isOpen && (
          <div
            role="menu"
            className={"absolute right-0 z-50 mt-3 min-w-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-xl"}
          >
            {
              items.map((item, index) => (
                <div
                  key={`${item.title}-${index}`}
                  className={item.separate ? "mt-2 border-t border-slate-200 pt-2" : ""}
                >
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => handleSelect(item)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all hover:bg-slate-50 ${item.danger ? "text-red-600 hover:text-red-700" : "text-slate-600 hover:text-slate-900"}`}
                  >
                    {item.icon && (
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center text-current [&_svg]:h-5 [&_svg]:w-5">
                        {item.icon}
                      </span>
                    )}
                    <span className="truncate">{item.title}</span>
                  </button>
                </div>
              ))
            }
          </div>
        )
      }
    </div>
  );
}
