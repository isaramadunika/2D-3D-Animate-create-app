import React from 'react';
import { motion } from 'framer-motion';
import { TrendingDownIcon, TrendingUpIcon } from 'lucide-react';

interface Props {
  label: string;
  value: string;
  delta?: number;
  hint?: string;
  icon: React.ComponentType<{className?: string;}>;
  tone?: 'primary' | 'secondary' | 'accent' | 'success';
  index?: number;
}

const TONES: Record<string, string> = {
  primary: 'bg-primary-50 text-primary',
  secondary: 'bg-secondary-50 text-secondary-600',
  accent: 'bg-accent-50 text-accent-600',
  success: 'bg-success-50 text-success-600'
};

export function StatCard({ label, value, delta, hint, icon: Icon, tone = 'primary', index = 0 }: Props) {
  const up = (delta ?? 0) >= 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.32 }}
      whileHover={{ y: -3 }}
      className="glass rounded-3xl p-5 shadow-glass">
      
      <div className="flex items-start justify-between">
        <span className={`grid h-11 w-11 place-items-center rounded-2xl ${TONES[tone]}`}>
          <Icon className="h-5 w-5" />
        </span>
        {delta !== undefined &&
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold ${
          up ? 'bg-success-50 text-success-600' : 'bg-danger-50 text-danger-600'}`
          }>
          
            {up ? <TrendingUpIcon className="h-3 w-3" /> : <TrendingDownIcon className="h-3 w-3" />}
            {up ? '+' : ''}
            {delta}%
          </span>
        }
      </div>
      <p className="mt-4 font-display text-2xl font-semibold tabular-nums text-slate-900">{value}</p>
      <p className="text-[13px] font-medium text-slate-500">{label}</p>
      {hint && <p className="mt-2 text-[11px] text-slate-400">{hint}</p>}
    </motion.div>);

}