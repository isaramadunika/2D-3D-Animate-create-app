import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { QuickTab } from './navConfig';

interface Props {
  tabs: QuickTab[];
}

/**
 * Top navigation bar.
 * The active tab is marked with a small indicator bar that animates smoothly
 * ABOVE the button and matches the active button's background tint.
 */
export function QuickNav({ tabs }: Props) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const activeIndex = tabs.reduce((best, tab, i) => {
    return pathname.startsWith(tab.to) ? i : best;
  }, -1);

  return (
    <nav aria-label="Section navigation" className="flex items-center gap-1">
      {tabs.map((tab, i) => {
        const active = i === activeIndex;
        return (
          <button
            key={tab.to}
            onClick={() => navigate(tab.to)}
            aria-current={active ? 'page' : undefined}
            className={[
            'relative flex items-center gap-2 rounded-xl px-3 py-2 text-[13px] font-medium transition-colors duration-200',
            active ? 'bg-primary-50 text-primary-700' : 'text-slate-500 hover:bg-white/70 hover:text-slate-800'].
            join(' ')}>
            
            {active &&
            <motion.span
              layoutId="quicknav-indicator"
              transition={{ type: 'spring', stiffness: 480, damping: 34, mass: 0.7 }}
              className="absolute -top-[9px] left-1/2 h-[3px] w-7 -translate-x-1/2 rounded-full bg-primary" />

            }
            <tab.icon className={`h-4 w-4 ${active ? 'text-primary' : 'text-slate-400'}`} />
            <span className="hidden lg:inline">{tab.label}</span>
          </button>);

      })}
    </nav>);

}