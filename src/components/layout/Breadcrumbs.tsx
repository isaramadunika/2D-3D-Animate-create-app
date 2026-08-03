import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRightIcon, HomeIcon } from 'lucide-react';

export interface Crumb {
  label: string;
  to?: string;
}

export function Breadcrumbs({ items }: {items: Crumb[];}) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center gap-1.5 text-[12px] text-slate-500">
        <li>
          <Link
            to="/app/dashboard"
            className="inline-flex items-center gap-1 rounded-md px-1 py-0.5 transition-colors hover:text-primary">
            
            <HomeIcon className="h-3.5 w-3.5" />
            <span className="sr-only">Home</span>
          </Link>
        </li>
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={item.label} className="flex items-center gap-1.5">
              <ChevronRightIcon className="h-3.5 w-3.5 text-slate-300" />
              {item.to && !last ?
              <Link to={item.to} className="rounded-md px-1 py-0.5 transition-colors hover:text-primary">
                  {item.label}
                </Link> :

              <span aria-current={last ? 'page' : undefined} className="font-medium text-slate-700">
                  {item.label}
                </span>
              }
            </li>);

        })}
      </ol>
    </nav>);

}