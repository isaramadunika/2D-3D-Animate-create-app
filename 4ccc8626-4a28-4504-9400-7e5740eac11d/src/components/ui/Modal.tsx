import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { XIcon } from 'lucide-react';
import { Button } from './Button';

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  icon?: React.ComponentType<{className?: string;}>;
  tone?: 'primary' | 'danger' | 'success';
  children?: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

const TONE_RING: Record<string, string> = {
  primary: 'bg-primary-50 text-primary',
  danger: 'bg-danger-50 text-danger',
  success: 'bg-success-50 text-success'
};

export function Modal({
  open,
  onClose,
  title,
  description,
  icon: Icon,
  tone = 'primary',
  children,
  footer,
  size = 'md'
}: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const width = size === 'sm' ? 'max-w-md' : size === 'lg' ? 'max-w-3xl' : 'max-w-xl';

  return (
    <AnimatePresence>
      {open &&
      <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-900/35 backdrop-blur-sm"
          onClick={onClose}
          aria-hidden />
        
          <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={title}
          initial={{ opacity: 0, y: 16, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          className={`relative z-10 w-full ${width} glass-strong rounded-3xl p-6 shadow-glass`}>
          
            <div className="flex items-start gap-4">
              {Icon &&
            <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${TONE_RING[tone]}`}>
                  <Icon className="h-5 w-5" />
                </span>
            }
              <div className="min-w-0 flex-1">
                <h2 className="font-display text-lg font-semibold text-slate-900">{title}</h2>
                {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close dialog">
                <XIcon className="h-5 w-5" />
              </Button>
            </div>
            {children && <div className="mt-6">{children}</div>}
            {footer && <div className="mt-8 flex items-center justify-end gap-3">{footer}</div>}
          </motion.div>
        </div>
      }
    </AnimatePresence>);

}