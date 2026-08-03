import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as ReTooltip,
  XAxis,
  YAxis } from
'recharts';
import { ActivityIcon, DownloadIcon, LayoutTemplateIcon, UsersIcon } from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { StatCard } from '../../components/ui/StatCard';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { activityLogs, exportTrend, typeDistribution } from '../../data/admin';

export function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div>
      <PageHeader
        title="Dashboard Analytics"
        subtitle="Studio-wide adoption, output and governance at a glance."
        crumbs={[{ label: 'Admin' }, { label: 'Dashboard Analytics' }]}
        actions={
        <>
            <Button variant="outline" icon={DownloadIcon}>
              Export report
            </Button>
            <Button icon={UsersIcon} onClick={() => navigate('/admin/users')}>
              Manage users
            </Button>
          </>
        } />
      

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard index={0} label="Active designers" value="24" delta={9} icon={UsersIcon} tone="primary" />
        <StatCard index={1} label="Characters in system" value="412" delta={14} icon={LayoutTemplateIcon} tone="secondary" />
        <StatCard index={2} label="Exports this month" value="1,284" delta={22} icon={DownloadIcon} tone="success" />
        <StatCard index={3} label="Pending reviews" value="7" delta={-18} hint="Target: under 10" icon={ActivityIcon} tone="accent" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <GlassCard>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-[15px] font-semibold text-slate-900">Export volume by format</h2>
              <p className="text-[12px] text-slate-500">Last six months</p>
            </div>
            <Badge tone="success">+22% MoM</Badge>
          </div>
          <div className="mt-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={exportTrend} margin={{ left: -20, right: 8, top: 8 }}>
                <defs>
                  {[
                  ['png', '#4F46E5'],
                  ['svg', '#06B6D4'],
                  ['jpg', '#F59E0B']].
                  map(([key, color]) =>
                  <linearGradient key={key} id={`g-${key}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={color} stopOpacity={0.35} />
                      <stop offset="100%" stopColor={color} stopOpacity={0.02} />
                    </linearGradient>
                  )}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <ReTooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: '1px solid #E2E8F0',
                    fontSize: 12,
                    boxShadow: '0 12px 32px -12px rgba(15,23,42,0.25)'
                  }} />
                
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Area type="monotone" dataKey="png" stroke="#4F46E5" fill="url(#g-png)" strokeWidth={2} />
                <Area type="monotone" dataKey="svg" stroke="#06B6D4" fill="url(#g-svg)" strokeWidth={2} />
                <Area type="monotone" dataKey="jpg" stroke="#F59E0B" fill="url(#g-jpg)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard>
          <h2 className="font-display text-[15px] font-semibold text-slate-900">Character mix</h2>
          <p className="text-[12px] text-slate-500">Share of the published library</p>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={typeDistribution} dataKey="value" nameKey="name" innerRadius={54} outerRadius={82} paddingAngle={3}>
                  {typeDistribution.map((entry) =>
                  <Cell key={entry.name} fill={entry.color} />
                  )}
                </Pie>
                <ReTooltip contentStyle={{ borderRadius: 12, border: '1px solid #E2E8F0', fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-2 space-y-2">
            {typeDistribution.map((entry) =>
            <li key={entry.name} className="flex items-center gap-2 text-[13px] text-slate-600">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                {entry.name}
                <span className="ml-auto font-semibold tabular-nums text-slate-800">{entry.value}%</span>
              </li>
            )}
          </ul>
        </GlassCard>
      </div>

      <GlassCard className="mt-6" padded={false}>
        <div className="flex items-center justify-between border-b border-white/70 px-6 py-4">
          <h2 className="font-display text-[15px] font-semibold text-slate-900">Latest activity</h2>
          <Button variant="ghost" size="sm" onClick={() => navigate('/admin/logs')}>
            View all logs
          </Button>
        </div>
        <ul className="divide-y divide-slate-100">
          {activityLogs.slice(0, 5).map((log) =>
          <li key={log.id} className="flex items-center gap-4 px-6 py-3.5">
              <span
              className={`h-2 w-2 shrink-0 rounded-full ${
              log.severity === 'critical' ? 'bg-danger' : log.severity === 'warning' ? 'bg-accent' : 'bg-success'}`
              } />
            
              <p className="min-w-0 flex-1 truncate text-[13px] text-slate-700">
                <span className="font-medium">{log.actor}</span> · {log.action} — <span className="text-slate-500">{log.target}</span>
              </p>
              <span className="shrink-0 text-[12px] text-slate-400">{log.time}</span>
            </li>
          )}
        </ul>
      </GlassCard>
    </div>);

}