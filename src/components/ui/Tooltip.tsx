import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface Props {
  label: string;
  shortcut?: string;
  side?: 'top' | 'bottom' | 'right';
  children: React.ReactNode;
}

export function Tooltip({ label, shortcut, side = 'top', children }: Props) {
  const [open, setOpen] = useState(false);

  const pos =
  side === 'top' ?
  'bottom-full left-1/2 -translate-x-1/2 mb-2' :
  side === 'bottom' ?
  'top-full left-1/2 -translate-x-1/2 mt-2' :
  'left-full top-1/2 -translate-y-1/2 ml-2';

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}>
      
      {children}
      <AnimatePresence>
        {open &&
        <motion.span
          role="tooltip"
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.14 }}
          className={`pointer-events-none absolute z-50 flex items-center gap-2 whitespace-nowrap rounded-lg bg-slate-900 px-2.5 py-1.5 text-xs font-medium text-white shadow-lg ${pos}`}>
          
            {label}
            {shortcut &&
          <kbd className="rounded border border-white/25 px-1 text-[10px] text-white/80">{shortcut}</kbd>
          }
          </motion.span>
        }
      </AnimatePresence>
    </span>);

}