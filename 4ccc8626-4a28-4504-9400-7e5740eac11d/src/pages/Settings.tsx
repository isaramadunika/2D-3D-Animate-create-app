import React, { useState } from 'react';
import { AccessibilityIcon, BellIcon, PaletteIcon, SaveIcon, ShieldIcon } from 'lucide-react';
import { PageHeader } from '../components/layout/PageHeader';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { SegmentedTabs } from '../components/ui/SegmentedTabs';
import { ToggleRow } from '../components/ui/ToggleRow';
import { LabeledSlider } from '../components/ui/LabeledSlider';
import { useApp } from '../contexts/AppContext';

type Tab = 'workspace' | 'notifications' | 'accessibility' | 'security';

export function Settings() {
  const { pushToast } = useApp();
  const [tab, setTab] = useState<Tab>('workspace');
  const [prefs, setPrefs] = useState({
    autosave: true,
    grid: true,
    idle: true,
    emailDigest: true,
    reviewAlerts: true,
    exportAlerts: false,
    reduceMotion: false,
    highContrast: false,
    largeText: false,
    twoFactor: true,
    sessionTimeout: true,
    uiScale: 1
  });

  const update = (key: keyof typeof prefs, value: boolean | number) =>
  setPrefs((p) => ({ ...p, [key]: value }));

  return (
    <div>
      <PageHeader
        title="Settings"
        subtitle="Control how the studio behaves for you. Changes apply immediately."
        crumbs={[{ label: 'Account' }, { label: 'Settings' }]}
        actions={
        <Button icon={SaveIcon} onClick={() => pushToast({ tone: 'success', title: 'Preferences saved' })}>
            Save preferences
          </Button>
        } />
      

      <div className="mb-6">
        <SegmentedTabs<Tab>
          ariaLabel="Settings sections"
          layoutId="settings-tabs"
          value={tab}
          onChange={setTab}
          options={[
          { value: 'workspace', label: 'Workspace', icon: PaletteIcon },
          { value: 'notifications', label: 'Notifications', icon: BellIcon },
          { value: 'accessibility', label: 'Accessibility', icon: AccessibilityIcon },
          { value: 'security', label: 'Security', icon: ShieldIcon }]
          } />
        
      </div>

      <div className="grid max-w-3xl gap-4">
        {tab === 'workspace' &&
        <GlassCard>
            <h2 className="font-display text-[15px] font-semibold text-slate-900">Editor defaults</h2>
            <div className="mt-4 space-y-3">
              <ToggleRow
              label="Autosave drafts"
              description="Save changes every 30 seconds while you work."
              checked={prefs.autosave}
              onChange={(v) => update('autosave', v)} />
            
              <ToggleRow
              label="Show alignment grid in 2D view"
              checked={prefs.grid}
              onChange={(v) => update('grid', v)} />
            
              <ToggleRow
              label="Play idle animation by default"
              description="Characters gently breathe in the 3D viewport."
              checked={prefs.idle}
              onChange={(v) => update('idle', v)} />
            
            </div>
          </GlassCard>
        }

        {tab === 'notifications' &&
        <GlassCard>
            <h2 className="font-display text-[15px] font-semibold text-slate-900">Email & in-app alerts</h2>
            <div className="mt-4 space-y-3">
              <ToggleRow
              label="Weekly design digest"
              description="A Monday summary of team activity."
              checked={prefs.emailDigest}
              onChange={(v) => update('emailDigest', v)} />
            
              <ToggleRow
              label="Review requests"
              description="Notify me when a character needs my approval."
              checked={prefs.reviewAlerts}
              onChange={(v) => update('reviewAlerts', v)} />
            
              <ToggleRow
              label="Export completion"
              checked={prefs.exportAlerts}
              onChange={(v) => update('exportAlerts', v)} />
            
            </div>
          </GlassCard>
        }

        {tab === 'accessibility' &&
        <GlassCard>
            <h2 className="font-display text-[15px] font-semibold text-slate-900">Accessibility</h2>
            <p className="mt-1 text-[12px] text-slate-500">The studio targets WCAG 2.1 AA across every screen.</p>
            <div className="mt-4 space-y-3">
              <ToggleRow
              label="Reduce motion"
              description="Disable non-essential animation and parallax."
              checked={prefs.reduceMotion}
              onChange={(v) => update('reduceMotion', v)} />
            
              <ToggleRow
              label="High contrast interface"
              checked={prefs.highContrast}
              onChange={(v) => update('highContrast', v)} />
            
              <ToggleRow label="Larger text" checked={prefs.largeText} onChange={(v) => update('largeText', v)} />
              <div className="rounded-2xl border border-slate-200 bg-white/70 px-4 py-4">
                <LabeledSlider
                label="Interface scale"
                value={prefs.uiScale}
                min={0.9}
                max={1.3}
                onChange={(v) => update('uiScale', v)} />
              
              </div>
            </div>
          </GlassCard>
        }

        {tab === 'security' &&
        <GlassCard>
            <h2 className="font-display text-[15px] font-semibold text-slate-900">Account security</h2>
            <div className="mt-4 space-y-3">
              <ToggleRow
              label="Two-factor authentication"
              description="Required by your organisation."
              checked={prefs.twoFactor}
              onChange={(v) => update('twoFactor', v)} />
            
              <ToggleRow
              label="Auto sign-out after 30 minutes idle"
              checked={prefs.sessionTimeout}
              onChange={(v) => update('sessionTimeout', v)} />
            
            </div>
            <Button variant="outline" className="mt-5">
              Change password
            </Button>
          </GlassCard>
        }
      </div>
    </div>);

}