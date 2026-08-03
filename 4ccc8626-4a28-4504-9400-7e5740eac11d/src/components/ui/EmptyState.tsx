import React from 'react';
import { InboxIcon } from 'lucide-react';

interface Props {
  title: string;
  description: string;
  icon?: React.ComponentType<{className?: string;}>;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ title, description, icon: Icon = InboxIcon, action, className = '' }: Props) {
  return (
    <div className={`flex flex-col items-center justify-center px-8 py-16 text-center ${className}`}>
      <span className="grid h-16 w-16 place-items-center rounded-3xl bg-primary-50 text-primary">
        <Icon className="h-7 w-7" />
      </span>
      <h3 className="mt-4 font-display text-base font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-slate-500">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>);

}