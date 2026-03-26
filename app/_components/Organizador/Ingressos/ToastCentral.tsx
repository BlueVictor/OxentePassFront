'use client'
import { useEffect } from 'react';
import { X, CheckCircle, AlertTriangle } from 'lucide-react';

interface ToastCentralProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: 'success' | 'error';
  duration?: number;
}

export function ToastCentral({
  isOpen,
  onClose,
  title,
  message,
  type = 'success',
  duration = 4000
}: ToastCentralProps) {
  
  useEffect(() => {
    if (isOpen && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer); 
    }
  }, [isOpen, duration, onClose]);

  if (!isOpen) return null;

  const isSuccess = type === 'success';

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none backdrop-blur-[2px]">
      <div className={`w-full max-w-md ${isSuccess ? 'bg-emerald-600' : 'bg-red-600'} rounded-[2rem] shadow-[0_30px_60px_rgba(0,0,0,0.2)] overflow-hidden text-white pointer-events-auto relative flex flex-col`}>
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all text-white/90 hover:text-white z-10"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-8 flex flex-col items-center text-center gap-5">
          
          <div className="bg-white/20 backdrop-blur-md p-4 rounded-full shrink-0 shadow-inner">
            {isSuccess ? (
              <CheckCircle className="w-10 h-10 text-emerald-100" />
            ) : (
              <AlertTriangle className="w-10 h-10 text-red-100" />
            )}
          </div>

          <div className="space-y-2">
            <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${isSuccess ? 'text-emerald-100/70' : 'text-red-100/70'}`}>
              Notificação do Sistema
            </span>
            <h3 className="text-2xl font-black text-white leading-tight tracking-tight">
              {title}
            </h3>
            <p className="text-sm leading-relaxed text-white/90 font-medium whitespace-pre-wrap px-2">
              {message}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}