import React from 'react';
import { CheckIcon, PipetteIcon } from 'lucide-react';
import { PRESET_COLORS } from '../../types/character';

interface Props {
  label: string;
  value: string;
  onChange: (color: string) => void;
}

export function ColorPicker({ label, value, onChange }: Props) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-medium text-slate-600">{label}</span>
        <span className="font-mono text-[11px] uppercase text-slate-400">{value}</span>
      </div>
      <div className="mt-2 grid grid-cols-8 gap-1.5">
        {PRESET_COLORS.map((color) => {
          const active = color.toLowerCase() === value.toLowerCase();
          return (
            <button
              key={color}
              type="button"
              onClick={() => onChange(color)}
              aria-label={`${label}: ${color}`}
              aria-pressed={active}
              className={[
              'grid h-7 w-7 place-items-center rounded-lg border transition-all duration-150 hover:scale-110',
              active ? 'border-primary ring-2 ring-primary-200' : 'border-slate-200'].
              join(' ')}
              style={{ backgroundColor: color }}>
              
              {active &&
              <CheckIcon
                className="h-3.5 w-3.5"
                style={{ color: ['#FFFFFF', '#E2E8F0', '#FDE68A'].includes(color) ? '#0F172A' : '#FFFFFF' }} />

              }
            </button>);

        })}
      </div>
      <label className="mt-2 flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-slate-300 px-3 py-2 text-[12px] font-medium text-slate-500 transition-colors hover:border-primary-300 hover:text-primary">
        <PipetteIcon className="h-3.5 w-3.5" />
        Custom colour
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="ml-auto h-6 w-10 cursor-pointer rounded border-0 bg-transparent p-0" />
        
      </label>
    </div>);

}