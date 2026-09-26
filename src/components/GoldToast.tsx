import React, { useEffect } from 'react';
import { Sparkles, CheckCircle2, X, Ticket, Crown } from 'lucide-react';

export interface ToastData {
  id: string;
  type: 'success' | 'booking' | 'registration';
  title: string;
  message: string;
  ticketNumber?: string;
}

interface GoldToastProps {
  toast: ToastData | null;
  onClose: () => void;
}

export const GoldToast: React.FC<GoldToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 6000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  return (
    <div className="fixed top-5 right-4 left-4 sm:left-auto sm:w-96 z-50 animate-bounce-in">
      <div className="relative overflow-hidden rounded-2xl bg-[#0d0d16]/95 border-2 border-amber-400/80 p-4 shadow-[0_10px_35px_rgba(212,175,55,0.45)] backdrop-blur-xl">
        {/* Golden ambient gradient */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500 animate-pulse" />
        <div className="absolute -top-12 -right-12 w-28 h-28 bg-amber-500/15 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-start gap-3.5">
          {/* Icon */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center text-black font-black flex-shrink-0 shadow-[0_0_15px_rgba(251,191,36,0.6)]">
            {toast.type === 'booking' ? (
              <Ticket className="w-5 h-5 text-black" />
            ) : toast.type === 'registration' ? (
              <Sparkles className="w-5 h-5 text-black" />
            ) : (
              <Crown className="w-5 h-5 text-black fill-black" />
            )}
          </div>

          {/* Text Content */}
          <div className="flex-1 min-w-0 pr-2">
            <div className="flex items-center gap-1.5 text-xs font-black text-gold-gradient uppercase tracking-wider">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 inline" />
              <span>{toast.title}</span>
            </div>
            
            <p className="text-xs text-amber-100 font-medium mt-1 leading-snug">
              {toast.message}
            </p>

            {toast.ticketNumber && (
              <div className="mt-2.5 inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-black/80 border border-amber-400/50 shadow-inner">
                <Ticket className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[11px] text-amber-200/80">টিকেট আইডি:</span>
                <span className="text-sm font-black font-mono text-amber-300 tracking-wider">
                  #{toast.ticketNumber}
                </span>
              </div>
            )}
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="text-amber-400/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
