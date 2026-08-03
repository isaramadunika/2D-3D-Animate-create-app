import React from 'react';
import { SearchIcon, XIcon } from 'lucide-react';

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  ariaLabel?: string;
  className?: string;
  shortcutHint?: boolean;
}

export function SearchInput({
  value,
  onChange,
  placeholder = 'Search…',
  ariaLabel = 'Search',
  className = '',
  shortcutHint = false
}: Props) {
  return (
    <div className={`relative flex items-center ${className}`}>
      <SearchIcon className="pointer-events-none absolute left-3 h-4 w-4 text-slate-400" />
      <input
        type="search"
        value={value}
        aria-label={ariaLabel}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-full rounded-xl border border-slate-200 bg-white/80 pl-9 pr-9 text-sm text-slate-700 placeholder:text-slate-400 transition-colors focus:border-primary-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-100" />
      
      {value ?
      <button
        onClick={() => onChange('')}
        aria-label="Clear search"
        className="absolute right-2 rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
        
          <XIcon className="h-3.5 w-3.5" />
        </button> :

      shortcutHint &&
      <kbd className="absolute right-2 hidden rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] font-medium text-slate-400 md:block">
            ⌘K
          </kbd>

      }
    </div>);

}