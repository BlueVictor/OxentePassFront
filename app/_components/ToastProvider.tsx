'use client'

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

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
        error: "border-red-200 bg-red-50 text-red-700",
        success: "border-emerald-200 bg-emerald-50 text-emerald-700",
        info: "border-sky-200 bg-sky-50 text-sky-700",
    };

    const animacao = entered && !closing
        ? "translate-y-0 opacity-100"
        : "translate-y-2 opacity-0";

    return (
        <div className={`pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border px-4 py-3 shadow-lg transition-all duration-200 ease-out ${estilos[type]} ${animacao}`}>
            <div className="flex-1 text-sm font-medium leading-6">
                {message}
            </div>

            <button
                type="button"
                onClick={onClose}
                aria-label="Fechar notificacao"
                className="cursor-pointer text-xs font-semibold uppercase tracking-wide opacity-70 transition hover:opacity-100"
            >
                <X size={16} />
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
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }

        if (closeTimeoutRef.current) {
            clearTimeout(closeTimeoutRef.current);
            closeTimeoutRef.current = null;
        }
    }, []);

    const hideToast = useCallback(() => {
        limparTimers();
        setClosing(true);

        closeTimeoutRef.current = setTimeout(() => {
            setToast(null);
            setClosing(false);
            closeTimeoutRef.current = null;
        }, 200);
    }, [limparTimers]);

    const showToast = useCallback((message: string, type: ToastType = "info") => {
        limparTimers();
        setClosing(false);

        setToast({
            id: Date.now(),
            message,
            type,
        });

        timeoutRef.current = setTimeout(() => {
            hideToast();
        }, 4000);
    }, [hideToast, limparTimers]);

    return (
        <ToastContext.Provider value={{ toast, showToast, hideToast }}>
            {children}

            <div className="pointer-events-none fixed right-4 top-20 z-50 w-full max-w-sm">
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

    if (!context) {
        throw new Error("useToast deve ser usado dentro de ToastProvider.");
    }

    return context;
}
