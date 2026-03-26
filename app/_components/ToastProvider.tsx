'use client'

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { X, CheckCircle2, AlertCircle, Info } from "lucide-react";

type ToastType = "error" | "success" | "info";

type ToastState = {
    id: number;
    message: string;
    type: ToastType;
} | null;

type ToastContextType = {
    toast: ToastState;
    showToast: (message: string, type?: ToastType) => void;
    hideToast: () => void;
};

function Toast({
    message,
    type,
    closing,
    onClose
}: {
    message: string;
    type: ToastType;
    closing: boolean;
    onClose: () => void;
}) {
    const [entered, setEntered] = useState(false);

    useEffect(() => {
        const frame = requestAnimationFrame(() => {
            setEntered(true);
        });
        return () => cancelAnimationFrame(frame);
    }, []);

    const estilos = {
        error: "border-red-500/20 bg-red-500/90 text-white shadow-red-200/50",
        success: "border-emerald-500/20 bg-emerald-600/90 text-white shadow-emerald-200/50",
        info: "border-sky-500/20 bg-sky-600/90 text-white shadow-sky-200/50",
    };

    const icones = {
        error: <AlertCircle size={18} />,
        success: <CheckCircle2 size={18} />,
        info: <Info size={18} />,
    };

    const animacao = entered && !closing
        ? "translate-y-0 opacity-100 scale-100"
        : "-translate-y-4 opacity-0 scale-95";

    return (
        <div className={`
            pointer-events-auto flex items-center gap-4 rounded-[1.5rem] border px-6 py-4 
            shadow-2xl backdrop-blur-md transition-all duration-300 ease-out
            ${estilos[type]} ${animacao}
        `}>
            <div className="shrink-0">
                {icones[type]}
            </div>

            <div className="flex-1 text-[11px] font-black uppercase tracking-[0.1em] leading-tight">
                {message}
            </div>

            <button
                type="button"
                onClick={onClose}
                aria-label="Fechar notificacao"
                className="cursor-pointer p-1 rounded-full hover:bg-white/20 transition-colors"
            >
                <X size={16} strokeWidth={3} />
            </button>
        </div>
    );
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toast, setToast] = useState<ToastState>(null);
    const [closing, setClosing] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const limparTimers = useCallback(() => {
        if (timeoutRef.current) { clearTimeout(timeoutRef.current); timeoutRef.current = null; }
        if (closeTimeoutRef.current) { clearTimeout(closeTimeoutRef.current); closeTimeoutRef.current = null; }
    }, []);

    const hideToast = useCallback(() => {
        limparTimers();
        setClosing(true);
        closeTimeoutRef.current = setTimeout(() => {
            setToast(null);
            setClosing(false);
            closeTimeoutRef.current = null;
        }, 300);
    }, [limparTimers]);

    const showToast = useCallback((message: string, type: ToastType = "info") => {
        limparTimers();
        setClosing(false);
        setToast({ id: Date.now(), message, type });
        timeoutRef.current = setTimeout(() => {
            hideToast();
        }, 4000);
    }, [hideToast, limparTimers]);

    return (
        <ToastContext.Provider value={{ toast, showToast, hideToast }}>
            {children}

            <div className="pointer-events-none fixed left-0 right-0 top-10 z-[9999] flex justify-center px-4">
                {toast ? (
                    <Toast
                        key={toast.id}
                        message={toast.message}
                        type={toast.type}
                        closing={closing}
                        onClose={hideToast}
                    />
                ) : null}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) throw new Error("useToast deve ser usado dentro de ToastProvider.");
    return context;
}