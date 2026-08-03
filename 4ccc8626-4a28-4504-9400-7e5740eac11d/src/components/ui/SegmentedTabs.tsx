import React from 'react';
import { motion } from 'framer-motion';

export interface SegmentOption<T extends string> {
  value: T;
  label: string;
  icon?: React.ComponentType<{className?: string;}>;
}

interface Props<T extends string> {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel: string;
  size?: 'sm' | 'md';
  layoutId?: string;
}

export function SegmentedTabs<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
  size = 'md',
  layoutId = 'segment'
}: Props<T>) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className="inline-flex items-center gap-1 rounded-2xl bg-slate-100/80 p-1">
      
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(option.value)}
            className={[
            'relative inline-flex items-center gap-2 rounded-xl font-medium transition-colors duration-200',
            size === 'sm' ? 'h-8 px-3 text-[13px]' : 'h-10 px-4 text-sm',
            active ? 'text-primary-700' : 'text-slate-500 hover:text-slate-800'].
            join(' ')}>
            
            {active &&
            <motion.span
              layoutId={`${layoutId}-pill`}
              transition={{ type: 'spring', stiffness: 420, damping: 34 }}
              className="absolute inset-0 rounded-xl bg-white shadow-soft" />

            }
            <span className="relative z-10 inline-flex items-center gap-2">
              {option.icon && <option.icon className="h-4 w-4" />}
              {option.label}
            </span>
          </button>);

      })}
    </div>);

}