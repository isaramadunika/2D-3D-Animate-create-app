import React from 'react';
import { Breadcrumbs, Crumb } from './Breadcrumbs';

interface Props {
  title: string;
  subtitle?: string;
  crumbs: Crumb[];
  actions?: React.ReactNode;
}

export function PageHeader({ title, subtitle, crumbs, actions }: Props) {
  return (
    <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <Breadcrumbs items={crumbs} />
        <h1 className="mt-2 font-display text-[26px] font-semibold leading-tight text-slate-900">{title}</h1>
        {subtitle && <p className="mt-1 max-w-2xl text-sm text-slate-500">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>);

}