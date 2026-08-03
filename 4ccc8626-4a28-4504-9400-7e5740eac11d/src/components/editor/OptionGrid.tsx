import React from 'react';
import { CheckIcon } from 'lucide-react';
import { Tooltip } from '../ui/Tooltip';

export interface Option<T extends string> {
  value: T;
  label: string;
  icon?: React.ComponentType<{className?: string;}>;
  hint?: string;
}

interface Props<T extends string> {
  label: string;
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  columns?: 2 | 3 | 4;
}

export function OptionGrid<T extends string>({ label, options, value, onChange, columns = 3 }: Props<T>) {
  const cols = columns === 2 ? 'grid-cols-2' : columns === 4 ? 'grid-cols-4' : 'grid-cols-3';
  return (
    <fieldset>
      <legend className="mb-2 text-[13px] font-medium text-slate-600">{label}</legend>
      <div className={`grid ${cols} gap-2`}>
        {options.map((option) => {
          const active = option.value === value;
          const content =
          <button
            type="button"
            onClick={() => onChange(option.value)}
            aria-pressed={active}
            className={[
            'relative flex w-full flex-col items-center gap-1.5 rounded-xl border px-2 py-2.5 text-[11px] font-medium transition-all duration-200',
            active ?
            'border-primary bg-primary-50 text-primary-700 shadow-soft' :
            'border-slate-200 bg-white/70 text-slate-500 hover:border-primary-200 hover:text-slate-800'].
            join(' ')}>
            
              {option.icon && <option.icon className={`h-4 w-4 ${active ? 'text-primary' : 'text-slate-400'}`} />}
              <span className="truncate">{option.label}</span>
              {active &&
            <span className="absolute right-1 top-1 grid h-3.5 w-3.5 place-items-center rounded-full bg-primary text-white">
                  <CheckIcon className="h-2.5 w-2.5" />
                </span>
            }
            </button>;

          return option.hint ?
          <Tooltip key={option.value} label={option.hint}>
              {content}
            </Tooltip> :

          <React.Fragment key={option.value}>{content}</React.Fragment>;

        })}
      </div>
    </fieldset>);

}