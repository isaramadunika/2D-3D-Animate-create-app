import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeftIcon, PaletteIcon, ShieldCheckIcon, UserCogIcon } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { navForRole } from './navConfig';

interface Props {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: Props) {
  const { role, setRole } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const groups = navForRole(role);
  const currentKey = `${location.pathname}${location.search}`;

  return (
    <aside
      aria-label="Primary navigation"
      className={`relative z-20 flex h-full shrink-0 flex-col border-r border-white/60 bg-white/70 backdrop-blur-xl transition-[width] duration-300 ${
      collapsed ? 'w-[84px]' : 'w-[264px]'}`
      }>
      
      {/* Brand */}
      <div className="flex h-18 items-center gap-3 px-5">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-primary text-white shadow-lift">
          <PaletteIcon className="h-5 w-5" />
        </span>
        {!collapsed &&
        <div className="min-w-0">
            <p className="truncate font-display text-[15px] font-semibold leading-tight text-slate-900">
              Cartoon Studio
            </p>
            <p className="truncate text-[11px] text-slate-500">Character Designer</p>
          </div>
        }
      </div>

      {/* Role switch */}
      <div className={`px-4 pb-4 ${collapsed ? 'px-3' : ''}`}>
        <div className="flex items-center gap-1 rounded-2xl bg-slate-100/80 p-1">
          {(['designer', 'admin'] as const).map((r) => {
            const Icon = r === 'designer' ? UserCogIcon : ShieldCheckIcon;
            const active = role === r;
            return (
              <button
                key={r}
                title={r === 'designer' ? 'Designer workspace' : 'Admin console'}
                onClick={() => {
                  setRole(r);
                  navigate(r === 'admin' ? '/admin/dashboard' : '/app/dashboard');
                }}
                aria-pressed={active}
                className={`relative flex flex-1 items-center justify-center gap-2 rounded-xl px-2 py-2 text-[12px] font-semibold capitalize transition-colors ${
                active ? 'text-primary-700' : 'text-slate-500 hover:text-slate-700'}`
                }>
                
                {active &&
                <motion.span
                  layoutId="role-pill"
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  className="absolute inset-0 rounded-xl bg-white shadow-soft" />

                }
                <span className="relative z-10 inline-flex items-center gap-1.5">
                  <Icon className="h-3.5 w-3.5" />
                  {!collapsed && r}
                </span>
              </button>);

          })}
        </div>
      </div>

      {/* Nav groups */}
      <nav className="flex-1 overflow-y-auto px-3 pb-4">
        {groups.map((group) =>
        <div key={group.title} className="mb-5">
            {!collapsed &&
          <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                {group.title}
              </p>
          }
            <ul className="space-y-1">
              {group.items.map((item) => {
              const active = currentKey === item.to || !item.to.includes('?') && location.pathname === item.to;
              return (
                <li key={item.label}>
                    <NavLink
                    to={item.to}
                    className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-200 ${
                    active ?
                    'bg-primary-50 text-primary-700' :
                    'text-slate-600 hover:bg-white hover:text-slate-900'} ${
                    collapsed ? 'justify-center' : ''}`}
                    title={collapsed ? item.label : undefined}>
                    
                      {active &&
                    <motion.span
                      layoutId="sidebar-marker"
                      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                      className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full bg-primary" />

                    }
                      <item.icon
                      className={`h-[18px] w-[18px] shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                      active ? 'text-primary' : 'text-slate-400'}`
                      } />
                    
                      {!collapsed && <span className="truncate">{item.label}</span>}
                      {!collapsed && item.badge &&
                    <span className="ml-auto rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
                          {item.badge}
                        </span>
                    }
                    </NavLink>
                  </li>);

            })}
            </ul>
          </div>
        )}
      </nav>

      <button
        onClick={onToggle}
        aria-label={collapsed ? 'Expand navigation' : 'Collapse navigation'}
        className="mx-3 mb-4 flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white/70 py-2 text-[12px] font-medium text-slate-500 transition-colors hover:border-primary-200 hover:text-primary">
        
        <ChevronLeftIcon
          className={`h-4 w-4 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} />
        
        {!collapsed && 'Collapse'}
      </button>
    </aside>);

}