import React, { useState } from 'react';
import { BuildingIcon, KeyRoundIcon, SaveIcon, ShieldIcon } from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { TextField } from '../../components/ui/TextField';
import { ToggleRow } from '../../components/ui/ToggleRow';
import { SegmentedTabs } from '../../components/ui/SegmentedTabs';
import { useApp } from '../../contexts/AppContext';

type Tab = 'organisation' | 'governance' | 'integrations';

export function AdminSettings() {
  const { pushToast } = useApp();
  const [tab, setTab] = useState<Tab>('organisation');
  const [org, setOrg] = useState({ name: 'BrightPlay Educational Games', domain: 'brightplay.io', seats: '40' });
  const [flags, setFlags] = useState({
    requireReview: true,
    lockTemplates: false,
    ssoOnly: true,
    retention: true
  });

  return (
    <div>
      <PageHeader
        title="Settings"
        subtitle="Organisation-wide configuration for the character studio."
        crumbs={[{ label: 'Admin' }, { label: 'Settings' }]}
        actions={
        <Button icon={SaveIcon} onClick={() => pushToast({ tone: 'success', title: 'Settings saved' })}>
            Save changes
          </Button>
        } />
      

      <div className="mb-6">
        <SegmentedTabs<Tab>
          ariaLabel="Admin settings sections"
          layoutId="admin-settings-tabs"
          value={tab}
          onChange={setTab}
          options={[
          { value: 'organisation', label: 'Organisation', icon: BuildingIcon },
          { value: 'governance', label: 'Governance', icon: ShieldIcon },
          { value: 'integrations', label: 'Integrations', icon: KeyRoundIcon }]
          } />
        
      </div>

      <div className="grid max-w-3xl gap-4">
        {tab === 'organisation' &&
        <GlassCard>
            <h2 className="font-display text-[15px] font-semibold text-slate-900">Organisation profile</h2>
            <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
              <TextField label="Organisation name" value={org.name} onChange={(e) => setOrg({ ...org, name: e.target.value })} />
              <TextField label="Primary domain" value={org.domain} onChange={(e) => setOrg({ ...org, domain: e.target.value })} />
              <TextField label="Licensed seats" value={org.seats} onChange={(e) => setOrg({ ...org, seats: e.target.value })} hint="24 of 40 seats in use." />
            </div>
          </GlassCard>
        }

        {tab === 'governance' &&
        <GlassCard>
            <h2 className="font-display text-[15px] font-semibold text-slate-900">Content governance</h2>
            <div className="mt-4 space-y-3">
              <ToggleRow
              label="Require review before publishing"
              description="Characters must be approved by a Reviewer or Admin."
              checked={flags.requireReview}
              onChange={(v) => setFlags({ ...flags, requireReview: v })} />
            
              <ToggleRow
              label="Lock template editing to admins"
              checked={flags.lockTemplates}
              onChange={(v) => setFlags({ ...flags, lockTemplates: v })} />
            
              <ToggleRow
              label="Retain deleted characters for 30 days"
              description="Deleted work stays recoverable from backups."
              checked={flags.retention}
              onChange={(v) => setFlags({ ...flags, retention: v })} />
            
            </div>
          </GlassCard>
        }

        {tab === 'integrations' &&
        <GlassCard>
            <h2 className="font-display text-[15px] font-semibold text-slate-900">Access & integrations</h2>
            <div className="mt-4 space-y-3">
              <ToggleRow
              label="Single sign-on only"
              description="Disable password sign-in for all members."
              checked={flags.ssoOnly}
              onChange={(v) => setFlags({ ...flags, ssoOnly: v })} />
            
              {[
            { name: 'Unity asset pipeline', status: 'Connected' },
            { name: 'Figma design library', status: 'Connected' },
            { name: 'Slack notifications', status: 'Not connected' }].
            map((integration) =>
            <div
              key={integration.name}
              className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white/70 px-4 py-3">
              
                  <span className="text-[13px] font-medium text-slate-800">{integration.name}</span>
                  <div className="flex items-center gap-3">
                    <Badge tone={integration.status === 'Connected' ? 'success' : 'neutral'}>{integration.status}</Badge>
                    <Button size="sm" variant="outline">
                      {integration.status === 'Connected' ? 'Manage' : 'Connect'}
                    </Button>
                  </div>
                </div>
            )}
            </div>
          </GlassCard>
        }
      </div>
    </div>);

}