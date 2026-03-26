'use client'
import { X, AlertTriangle } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  isLoading = false
}: ConfirmationModalProps) {
  
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-slate-900/60 z-[100] flex items-center justify-center p-4 md:p-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[2rem] shadow-2xl shadow-black/20 w-full max-w-md mx-auto overflow-hidden relative flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-all text-white z-10"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="bg-gradient-to-r from-emerald-600 to-teal-500 px-6 py-8 text-center text-white relative shrink-0">
          <div className="flex justify-center mb-4">
            <div className="bg-white/20 p-3 rounded-2xl">
              <AlertTriangle className="w-8 h-8 text-emerald-100" />
            </div>
          </div>
          <h1 className="text-2xl font-black tracking-tight uppercase">{title}</h1>
          <p className="text-white/80 font-bold mt-1 tracking-widest uppercase text-[10px]">
            Atenção: Ação Irreversível
          </p>
        </div>

        <div className="p-6 sm:p-8 space-y-6 text-center">
          <p className="text-sm sm:text-base leading-relaxed text-slate-600 font-medium whitespace-pre-wrap">
            {message}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={onClose}
              className="w-full py-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-black uppercase tracking-[0.2em] text-[11px] transition-all active:scale-[0.98]"
            >
              {cancelLabel}
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-[0.2em] text-[11px] shadow-lg transition-all active:scale-[0.98] disabled:bg-slate-300 disabled:shadow-none"
            >
              {isLoading ? "Processando..." : confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}