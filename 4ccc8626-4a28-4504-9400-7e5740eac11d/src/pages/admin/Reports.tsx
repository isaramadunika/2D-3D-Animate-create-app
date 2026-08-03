import React, { useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip as ReTooltip,
  XAxis,
  YAxis } from
'recharts';
import { CalendarIcon, DownloadIcon, FileTextIcon } from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { SegmentedTabs } from '../../components/ui/SegmentedTabs';
import { StatCard } from '../../components/ui/StatCard';
import { exportTrend, weeklyActivity } from '../../data/admin';
import { useApp } from '../../contexts/AppContext';

type Range = '7d' | '30d' | '6m';

const SAVED_REPORTS = [
{ name: 'Monthly production summary', owner: 'Marcus Lee', schedule: 'First Monday, 08:00', format: 'PDF' },
{ name: 'Template adoption', owner: 'Design Ops', schedule: 'Weekly, Friday', format: 'CSV' },
{ name: 'Accessibility audit', owner: 'Quality', schedule: 'Quarterly', format: 'PDF' }];


export function Reports() {
  const { pushToast } = useApp();
  const [range, setRange] = useState<Range>('30d');

  return (
    <div>
      <PageHeader
        title="Reports"
        subtitle="Production output, review throughput and export activity."
        crumbs={[{ label: 'Admin' }, { label: 'Reports' }]}
        actions={
        <>
            <SegmentedTabs<Range>
            ariaLabel="Date range"
            layoutId="report-range"
            size="sm"
            value={range}
            onChange={setRange}
            options={[
            { value: '7d', label: '7 days' },
            { value: '30d', label: '30 days' },
            { value: '6m', label: '6 months' }]
            } />
          
            <Button
            icon={DownloadIcon}
            onClick={() => pushToast({ tone: 'success', title: 'Report queued', description: 'You will get an email when it is ready.' })}>
            
              Generate report
            </Button>
          </>
        } />
      

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard index={0} label="Characters created" value="101" delta={16} icon={FileTextIcon} tone="primary" />
        <StatCard index={1} label="Review turnaround" value="1.4 days" delta={-12} icon={CalendarIcon} tone="secondary" />
        <StatCard index={2} label="Approval rate" value="92%" delta={4} icon={FileTextIcon} tone="success" />
        <StatCard index={3} label="Assets exported" value="1,284" delta={22} icon={DownloadIcon} tone="accent" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <GlassCard>
          <h2 className="font-display text-[15px] font-semibold text-slate-900">Weekly production</h2>
          <p className="text-[12px] text-slate-500">Created vs reviewed vs exported</p>
          <div className="mt-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyActivity} margin={{ left: -20, right: 8, top: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <ReTooltip contentStyle={{ borderRadius: 12, border: '1px solid #E2E8F0', fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="created" fill="#4F46E5" radius={[6, 6, 0, 0]} />
                <Bar dataKey="reviewed" fill="#06B6D4" radius={[6, 6, 0, 0]} />
                <Bar dataKey="exported" fill="#F59E0B" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard>
          <h2 className="font-display text-[15px] font-semibold text-slate-900">Export growth</h2>
          <p className="text-[12px] text-slate-500">PNG remains the dominant delivery format</p>
          <div className="mt-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={exportTrend} margin={{ left: -20, right: 8, top: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <ReTooltip contentStyle={{ borderRadius: 12, border: '1px solid #E2E8F0', fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="png" stroke="#4F46E5" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="svg" stroke="#06B6D4" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="jpg" stroke="#F59E0B" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      <GlassCard className="mt-6" padded={false}>
        <h2 className="border-b border-white/70 px-6 py-4 font-display text-[15px] font-semibold text-slate-900">
          Scheduled reports
        </h2>
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200/80 text-[11px] uppercase tracking-wider text-slate-500">
            <tr>
              <th scope="col" className="px-6 py-3 font-semibold">Report</th>
              <th scope="col" className="px-6 py-3 font-semibold">Owner</th>
              <th scope="col" className="px-6 py-3 font-semibold">Schedule</th>
              <th scope="col" className="px-6 py-3 font-semibold">Format</th>
              <th scope="col" className="px-6 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {SAVED_REPORTS.map((report) =>
            <tr key={report.name} className="border-b border-slate-100 last:border-0 hover:bg-white/70">
                <td className="px-6 py-3.5 font-medium text-slate-800">{report.name}</td>
                <td className="px-6 py-3.5 text-slate-600">{report.owner}</td>
                <td className="px-6 py-3.5 text-slate-500">{report.schedule}</td>
                <td className="px-6 py-3.5">
                  <Badge tone="primary">{report.format}</Badge>
                </td>
                <td className="px-6 py-3.5 text-right">
                  <Button size="sm" variant="outline" icon={DownloadIcon}>
                    Download
                  </Button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </GlassCard>
    </div>);

}