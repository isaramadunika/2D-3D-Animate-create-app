import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BellIcon,
  CheckCheckIcon,
  HelpCircleIcon,
  LogOutIcon,
  SettingsIcon,
  UserIcon } from
'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { QuickNav } from './QuickNav';
import { adminQuickTabs, designerQuickTabs } from './navConfig';
import { SearchInput } from '../ui/SearchInput';
import { Tooltip } from '../ui/Tooltip';

export function Topbar() {
  const { role, userName, notifications, markAllRead } = useApp();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [openPanel, setOpenPanel] = useState<'none' | 'bell' | 'user'>('none');
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-30 flex h-18 items-center gap-4 border-b border-white/60 bg-white/70 px-6 backdrop-blur-xl">
      <QuickNav tabs={role === 'admin' ? adminQuickTabs : designerQuickTabs} />

      <div className="ml-auto flex items-center gap-3">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Search characters, templates…"
          ariaLabel="Global search"
          className="hidden w-72 md:flex"
          shortcutHint />
        

        <Tooltip label="Help centre" side="bottom">
          <Link
            to="/app/help"
            className="grid h-10 w-10 place-items-center rounded-xl text-slate-500 transition-colors hover:bg-white hover:text-primary"
            aria-label="Help centre">
            
            <HelpCircleIcon className="h-[18px] w-[18px]" />
          </Link>
        </Tooltip>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setOpenPanel((p) => p === 'bell' ? 'none' : 'bell')}
            aria-label={`Notifications, ${unread} unread`}
            aria-expanded={openPanel === 'bell'}
            className="relative grid h-10 w-10 place-items-center rounded-xl text-slate-500 transition-colors hover:bg-white hover:text-primary">
            
            <BellIcon className="h-[18px] w-[18px]" />
            {unread > 0 &&
            <span className="absolute right-2 top-2 grid h-4 w-4 place-items-center rounded-full bg-accent text-[9px] font-bold text-white">
                {unread}
              </span>
            }
          </button>
          <AnimatePresence>
            {openPanel === 'bell' &&
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              className="glass-strong absolute right-0 top-12 w-80 rounded-2xl p-2 shadow-glass">
              
                <div className="flex items-center justify-between px-3 py-2">
                  <p className="text-[13px] font-semibold text-slate-800">Notifications</p>
                  <button
                  onClick={markAllRead}
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-primary hover:underline">
                  
                    <CheckCheckIcon className="h-3.5 w-3.5" />
                    Mark all read
                  </button>
                </div>
                <ul className="max-h-72 overflow-y-auto">
                  {notifications.map((n) =>
                <li key={n.id}>
                      <div className="flex gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-white/80">
                        <span
                      className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                      n.read ? 'bg-slate-300' : 'bg-primary'}`
                      } />
                    
                        <div className="min-w-0">
                          <p className="text-[13px] font-medium text-slate-800">{n.title}</p>
                          <p className="mt-0.5 text-[12px] leading-snug text-slate-500">{n.body}</p>
                          <p className="mt-1 text-[11px] text-slate-400">{n.time}</p>
                        </div>
                      </div>
                    </li>
                )}
                </ul>
              </motion.div>
            }
          </AnimatePresence>
        </div>

        <div className="h-8 w-px bg-slate-200" />

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setOpenPanel((p) => p === 'user' ? 'none' : 'user')}
            aria-expanded={openPanel === 'user'}
            className="flex items-center gap-2.5 rounded-xl py-1.5 pl-1.5 pr-3 transition-colors hover:bg-white">
            
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-[13px] font-semibold text-white">
              {userName.
              split(' ').
              map((p) => p[0]).
              join('')}
            </span>
            <span className="hidden text-left lg:block">
              <span className="block text-[13px] font-semibold leading-tight text-slate-800">{userName}</span>
              <span className="block text-[11px] capitalize text-slate-500">{role}</span>
            </span>
          </button>
          <AnimatePresence>
            {openPanel === 'user' &&
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              className="glass-strong absolute right-0 top-14 w-56 rounded-2xl p-2 shadow-glass">
              
                {[
              { label: 'Profile', icon: UserIcon, to: '/app/profile' },
              { label: 'Settings', icon: SettingsIcon, to: role === 'admin' ? '/admin/settings' : '/app/settings' }].
              map((item) =>
              <button
                key={item.label}
                onClick={() => {
                  setOpenPanel('none');
                  navigate(item.to);
                }}
                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] font-medium text-slate-600 transition-colors hover:bg-white hover:text-slate-900">
                
                    <item.icon className="h-4 w-4 text-slate-400" />
                    {item.label}
                  </button>
              )}
                <div className="my-1 h-px bg-slate-200/70" />
                <button
                onClick={() => navigate('/login')}
                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] font-medium text-danger transition-colors hover:bg-danger-50">
                
                  <LogOutIcon className="h-4 w-4" />
                  Sign out
                </button>
              </motion.div>
            }
          </AnimatePresence>
        </div>
      </div>
    </header>);

}