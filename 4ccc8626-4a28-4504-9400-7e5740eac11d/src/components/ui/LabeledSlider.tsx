import React from 'react';

interface Props {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
  format?: (value: number) => string;
  icon?: React.ComponentType<{className?: string;}>;
}

export function LabeledSlider({
  label,
  value,
  onChange,
  min = 0.5,
  max = 1.6,
  step = 0.01,
  suffix = '',
  format,
  icon: Icon
}: Props) {
  const id = `slider-${label.replace(/\s+/g, '-').toLowerCase()}`;
  const pct = (value - min) / (max - min) * 100;
  return (
    <div>
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="flex items-center gap-1.5 text-[13px] font-medium text-slate-600">
          {Icon && <Icon className="h-3.5 w-3.5 text-slate-400" />}
          {label}
        </label>
        <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[11px] font-semibold tabular-nums text-slate-600">
          {format ? format(value) : `${Math.round(value * 100)}${suffix || '%'}`}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="mt-2 h-1.5 w-full cursor-pointer appearance-none rounded-full outline-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-soft [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110"
        style={{
          background: `linear-gradient(to right, #4F46E5 ${pct}%, #E2E8F0 ${pct}%)`
        }} />
      
    </div>);

}