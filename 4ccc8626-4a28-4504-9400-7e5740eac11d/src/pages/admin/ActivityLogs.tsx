import React, { useMemo, useState } from 'react';
import { AlertTriangleIcon, DownloadIcon, InfoIcon, ShieldAlertIcon } from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { SearchInput } from '../../components/ui/SearchInput';
import { SegmentedTabs } from '../../components/ui/SegmentedTabs';
import { EmptyState } from '../../components/ui/EmptyState';
import { activityLogs, ActivityLog } from '../../data/admin';
import { useApp } from '../../contexts/AppContext';

type Severity = 'all' | ActivityLog['severity'];

const SEVERITY = {
  info: { tone: 'primary', icon: InfoIcon },
  warning: { tone: 'accent', icon: AlertTriangleIcon },
  critical: { tone: 'danger', icon: ShieldAlertIcon }
} as const;

export function ActivityLogs() {
  const { pushToast } = useApp();
  const [query, setQuery] = useState('');
  const [severity, setSeverity] = useState<Severity>('all');

  const results = useMemo(
    () =>
    activityLogs.filter(
      (log) =>
      (severity === 'all' || log.severity === severity) && (
      !query ||
      log.actor.toLowerCase().includes(query.toLowerCase()) ||
      log.action.toLowerCase().includes(query.toLowerCase()) ||
      log.target.toLowerCase().includes(query.toLowerCase()))
    ),
    [query, severity]
  );

  return (
    <div>
      <PageHeader
        title="Activity Logs"
        subtitle="A complete, immutable audit trail of everything that happens in the studio."
        crumbs={[{ label: 'Admin' }, { label: 'Activity Logs' }]}
        actions={
        <Button
          variant="outline"
          icon={DownloadIcon}
          onClick={() => pushToast({ tone: 'success', title: 'Log export started', description: 'CSV will download shortly.' })}>
          
            Export CSV
          </Button>
        } />
      

      <GlassCard className="mb-6" padded={false}>
        <div className="flex flex-col gap-4 p-4 md:flex-row md:items-center">
          <SearchInput value={query} onChange={setQuery} placeholder="Search actor, action or target…" ariaLabel="Search logs" className="md:w-96" />
          <SegmentedTabs<Severity>
            ariaLabel="Severity filter"
            layoutId="log-severity"
            size="sm"
            value={severity}
            onChange={setSeverity}
            options={[
            { value: 'all', label: 'All' },
            { value: 'info', label: 'Info' },
            { value: 'warning', label: 'Warning' },
            { value: 'critical', label: 'Critical' }]
            } />
          
          <span className="ml-auto text-[12px] text-slate-500">{results.length} events</span>
        </div>
      </GlassCard>

      <GlassCard padded={false} className="overflow-hidden">
        {results.length === 0 ?
        <EmptyState title="No events match" description="Widen the severity filter or clear your search to see more events." /> :

        <ol className="divide-y divide-slate-100">
            {results.map((log) => {
            const meta = SEVERITY[log.severity];
            return (
              <li key={log.id} className="flex items-start gap-4 px-6 py-4 transition-colors hover:bg-white/70">
                  <span
                  className={`mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl ${
                  log.severity === 'critical' ?
                  'bg-danger-50 text-danger' :
                  log.severity === 'warning' ?
                  'bg-accent-50 text-accent-600' :
                  'bg-primary-50 text-primary'}`
                  }>
                  
                    <meta.icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] text-slate-800">
                      <span className="font-semibold">{log.actor}</span> {log.action.toLowerCase()}
                    </p>
                    <p className="mt-0.5 truncate text-[12px] text-slate-500">{log.target}</p>
                  </div>
                  <Badge tone={meta.tone}>{log.severity}</Badge>
                  <span className="w-36 shrink-0 text-right text-[12px] tabular-nums text-slate-400">{log.time}</span>
                </li>);

          })}
          </ol>
        }
      </GlassCard>
    </div>);

}