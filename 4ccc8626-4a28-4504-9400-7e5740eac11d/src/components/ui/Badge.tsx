import React from 'react';

type Tone = 'primary' | 'secondary' | 'accent' | 'success' | 'danger' | 'neutral';

const TONES: Record<Tone, string> = {
  primary: 'bg-primary-50 text-primary-700 ring-primary-100',
  secondary: 'bg-secondary-50 text-secondary-700 ring-secondary-100',
  accent: 'bg-accent-50 text-accent-600 ring-accent-100',
  success: 'bg-success-50 text-success-600 ring-success-100',
  danger: 'bg-danger-50 text-danger-600 ring-danger-100',
  neutral: 'bg-slate-100 text-slate-600 ring-slate-200'
};

interface Props {
  children: React.ReactNode;
  tone?: Tone;
  icon?: React.ComponentType<{className?: string;}>;
  className?: string;
}

export function Badge({ children, tone = 'neutral', icon: Icon, className = '' }: Props) {
  return (
    <span
      className={[
      'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset',
      TONES[tone],
      className].
      join(' ')}>
      
      {Icon && <Icon className="h-3.5 w-3.5" />}
      {children}
    </span>);

}