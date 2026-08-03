import React from 'react';
import { motion } from 'framer-motion';

interface Props {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function ToggleRow({ label, description, checked, onChange }: Props) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-white/70 px-4 py-3">
      <div className="min-w-0">
        <p className="text-[13px] font-medium text-slate-800">{label}</p>
        {description && <p className="mt-0.5 text-[12px] leading-snug text-slate-500">{description}</p>}
      </div>
      <button
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ${
        checked ? 'bg-primary' : 'bg-slate-300'}`
        }>
        
        <motion.span
          layout
          transition={{ type: 'spring', stiffness: 500, damping: 32 }}
          className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm"
          style={{ left: checked ? 22 : 2 }} />
        
      </button>
    </div>);

}