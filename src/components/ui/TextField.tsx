import React, { useId, useState } from 'react';
import { AlertCircleIcon, EyeIcon, EyeOffIcon } from 'lucide-react';

interface Props extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'className'> {
  label: string;
  hint?: string;
  error?: string;
  icon?: React.ComponentType<{className?: string;}>;
  className?: string;
}

export function TextField({ label, hint, error, icon: Icon, className = '', type = 'text', ...rest }: Props) {
  const id = useId();
  const [reveal, setReveal] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword && reveal ? 'text' : type;

  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-[13px] font-medium text-slate-700">
        {label}
      </label>
      <div className="relative flex items-center">
        {Icon && <Icon className="pointer-events-none absolute left-3 h-4 w-4 text-slate-400" />}
        <input
          {...rest}
          id={id}
          type={inputType}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          className={[
          'h-11 w-full rounded-xl border bg-white/85 text-sm text-slate-800 placeholder:text-slate-400',
          'transition-colors focus:outline-none focus:ring-2',
          Icon ? 'pl-9' : 'pl-3.5',
          isPassword ? 'pr-10' : 'pr-3.5',
          error ?
          'border-danger-500 focus:border-danger-500 focus:ring-danger-100' :
          'border-slate-200 focus:border-primary-300 focus:ring-primary-100'].
          join(' ')} />
        
        {isPassword &&
        <button
          type="button"
          onClick={() => setReveal((r) => !r)}
          aria-label={reveal ? 'Hide password' : 'Show password'}
          className="absolute right-2 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600">
          
            {reveal ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
          </button>
        }
      </div>
      {error ?
      <p id={`${id}-error`} className="mt-1.5 flex items-center gap-1 text-[12px] font-medium text-danger">
          <AlertCircleIcon className="h-3.5 w-3.5" />
          {error}
        </p> :

      hint &&
      <p id={`${id}-hint`} className="mt-1.5 text-[12px] text-slate-400">
            {hint}
          </p>

      }
    </div>);

}