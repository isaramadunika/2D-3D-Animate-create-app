import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { ToastViewport } from '../ui/ToastViewport';

export function AppShell() {
  const [collapsed, setCollapsed] = useState(false);
  const { pathname, search } = useLocation();

  return (
    <div className="relative flex h-screen w-full overflow-hidden bg-canvas">
      <div className="aurora opacity-60" />
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      <div className="relative flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="flex-1 overflow-y-auto px-6 py-8 xl:px-10">
          <motion.div
            key={pathname + search}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="mx-auto w-full max-w-[1440px]">
            
            <Outlet />
          </motion.div>
        </main>
      </div>
      <ToastViewport />
    </div>);

}