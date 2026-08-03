import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDownIcon } from 'lucide-react';

interface Props {
  title: string;
  icon: React.ComponentType<{className?: string;}>;
  defaultOpen?: boolean;
  children: React.ReactNode;
  summary?: string;
}

/** Progressive disclosure: only one concern is expanded at a time. */
export function Accordion({ title, icon: Icon, defaultOpen = false, children, summary }: Props) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/60">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-white">
        
        <span
          className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl transition-colors ${
          open ? 'bg-primary-50 text-primary' : 'bg-slate-100 text-slate-500'}`
          }>
          
          <Icon className="h-4 w-4" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[13px] font-semibold text-slate-800">{title}</span>
          {summary && <span className="block truncate text-[11px] text-slate-400">{summary}</span>}
        </span>
        <ChevronDownIcon
          className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
        
      </button>
      <AnimatePresence initial={false}>
        {open &&
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.24, ease: 'easeInOut' }}>
          
            <div className="space-y-4 border-t border-slate-200/70 px-4 py-4">{children}</div>
          </motion.div>
        }
      </AnimatePresence>
    </div>);

}