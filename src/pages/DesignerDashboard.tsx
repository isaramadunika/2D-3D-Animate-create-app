import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRightIcon,
  BoxIcon,
  CheckCircle2Icon,
  ClockIcon,
  DownloadIcon,
  LibraryBigIcon,
  PencilIcon,
  PlusIcon,
  SparklesIcon } from
'lucide-react';
import { PageHeader } from '../components/layout/PageHeader';
import { GlassCard } from '../components/ui/GlassCard';
import { StatCard } from '../components/ui/StatCard';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { CharacterThumb } from '../components/CharacterThumb';
import { ViewportCard } from '../components/three/ViewportCard';
import { useApp } from '../contexts/AppContext';
import { weeklyActivity } from '../data/admin';

export function DesignerDashboard() {
  const navigate = useNavigate();
  const { characters, userName, activeId } = useApp();
  const featured = characters.find((c) => c.id === activeId) ?? characters[0];
  const recent = characters.slice(0, 4);
  const maxCreated = Math.max(...weeklyActivity.map((d) => d.created));

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${userName.split(' ')[0]}`}
        subtitle="Here’s what’s happening in your character studio today."
        crumbs={[{ label: 'Workspace' }, { label: 'Dashboard' }]}
        actions={
        <>
            <Button variant="outline" icon={LibraryBigIcon} onClick={() => navigate('/app/library')}>
              Open library
            </Button>
            <Button icon={PlusIcon} onClick={() => navigate('/app/create')}>
              Create character
            </Button>
          </>
        } />
      

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard index={0} label="Characters owned" value={String(characters.length)} delta={12} icon={LibraryBigIcon} tone="primary" />
        <StatCard index={1} label="Published this month" value="6" delta={8} icon={CheckCircle2Icon} tone="success" />
        <StatCard index={2} label="Exports generated" value="148" delta={24} icon={DownloadIcon} tone="secondary" />
        <StatCard index={3} label="Avg. design time" value="12m" delta={-9} hint="Down from 14 minutes last week" icon={ClockIcon} tone="accent" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        {/* Continue working */}
        <GlassCard padded={false} className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/70 px-6 py-4">
            <div>
              <h2 className="font-display text-[15px] font-semibold text-slate-900">Continue where you left off</h2>
              <p className="text-[12px] text-slate-500">Your four most recently updated characters.</p>
            </div>
            <Button variant="ghost" size="sm" iconRight={ArrowRightIcon} onClick={() => navigate('/app/library')}>
              View all
            </Button>
          </div>
          <ul className="divide-y divide-slate-100">
            {recent.map((character, i) =>
            <motion.li
              key={character.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-white/60">
              
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-primary-50">
                  <CharacterThumb config={character.config} label={character.name} className="h-12 w-12" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-800">{character.name}</p>
                  <p className="truncate text-[12px] capitalize text-slate-500">
                    {character.type} · updated {character.updatedAt}
                  </p>
                </div>
                <Badge tone={character.status === 'published' ? 'success' : character.status === 'review' ? 'accent' : 'neutral'}>
                  {character.status}
                </Badge>
                <Button size="sm" variant="outline" icon={PencilIcon} onClick={() => navigate(`/app/editor/${character.id}`)}>
                  Edit
                </Button>
              </motion.li>
            )}
          </ul>

          {/* Weekly activity */}
          <div className="border-t border-white/70 px-6 py-5">
            <div className="flex items-center justify-between">
              <h3 className="text-[13px] font-semibold text-slate-800">Your week</h3>
              <span className="text-[11px] text-slate-400">Characters created per day</span>
            </div>
            <div className="mt-4 flex h-28 items-end gap-3">
              {weeklyActivity.map((day, i) =>
              <div key={day.day} className="flex flex-1 flex-col items-center gap-2">
                  <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${day.created / maxCreated * 100}%` }}
                  transition={{ delay: 0.1 + i * 0.05, type: 'spring', stiffness: 160, damping: 20 }}
                  className="w-full rounded-t-lg bg-primary/85"
                  title={`${day.created} characters`} />
                
                  <span className="text-[11px] text-slate-400">{day.day}</span>
                </div>
              )}
            </div>
          </div>
        </GlassCard>

        {/* Featured live preview */}
        <div className="space-y-6">
          <ViewportCard
            config={featured.config}
            mode="3d"
            title={`${featured.name} · live 3D`}
            environment="sky"
            className="h-[360px]" />
          
          <GlassCard>
            <h2 className="font-display text-[15px] font-semibold text-slate-900">Quick actions</h2>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {[
              { label: 'New character', icon: SparklesIcon, to: '/app/create' },
              { label: '3D viewer', icon: BoxIcon, to: '/app/viewer?view=3d' },
              { label: 'Export assets', icon: DownloadIcon, to: '/app/export' },
              { label: 'Browse library', icon: LibraryBigIcon, to: '/app/library' }].
              map((action) =>
              <button
                key={action.label}
                onClick={() => navigate(action.to)}
                className="flex flex-col items-start gap-2 rounded-2xl border border-slate-200 bg-white/70 p-4 text-left transition-all hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-soft">
                
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary-50 text-primary">
                    <action.icon className="h-4 w-4" />
                  </span>
                  <span className="text-[13px] font-medium text-slate-700">{action.label}</span>
                </button>
              )}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>);

}