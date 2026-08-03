import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangleIcon, CheckCircle2Icon, InfoIcon, XIcon } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

const ICONS = {
  success: CheckCircle2Icon,
  error: AlertTriangleIcon,
  info: InfoIcon
};

const TONES = {
  success: 'text-success bg-success-50',
  error: 'text-danger bg-danger-50',
  info: 'text-primary bg-primary-50'
};

export function ToastViewport() {
  const { toasts, dismissToast } = useApp();
  return (
    <div
      className="pointer-events-none fixed bottom-6 right-6 z-[60] flex w-full max-w-sm flex-col gap-3"
      role="status"
      aria-live="polite">
      
      <AnimatePresence>
        {toasts.map((toast) => {
          const Icon = ICONS[toast.tone];
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 40, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 400, damping: 32 }}
              className="glass-strong pointer-events-auto flex items-start gap-3 rounded-2xl p-4 shadow-glass">
              
              <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${TONES[toast.tone]}`}>
                <Icon className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-900">{toast.title}</p>
                {toast.description &&
                <p className="mt-0.5 text-[13px] leading-snug text-slate-500">{toast.description}</p>
                }
              </div>
              <button
                onClick={() => dismissToast(toast.id)}
                aria-label="Dismiss notification"
                className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700">
                
                <XIcon className="h-4 w-4" />
              </button>
            </motion.div>);

        })}
      </AnimatePresence>
    </div>);

}