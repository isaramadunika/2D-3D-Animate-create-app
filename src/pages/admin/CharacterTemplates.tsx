import React, { useState } from 'react';
import { ArchiveIcon, LayoutTemplateIcon, PlusIcon, StarIcon } from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { SegmentedTabs } from '../../components/ui/SegmentedTabs';
import { CharacterThumb } from '../../components/CharacterThumb';
import { templates, TemplateItem } from '../../data/admin';
import { characters } from '../../data/characters';
import { useApp } from '../../contexts/AppContext';

type Filter = 'live' | 'archived' | 'all';

export function CharacterTemplates() {
  const { pushToast } = useApp();
  const [items, setItems] = useState<TemplateItem[]>(templates);
  const [filter, setFilter] = useState<Filter>('live');
  const [pending, setPending] = useState<TemplateItem | null>(null);

  const results = items.filter((t) => filter === 'all' || t.status === filter);

  return (
    <div>
      <PageHeader
        title="Character Templates"
        subtitle="Approved starting points every designer can build from."
        crumbs={[{ label: 'Admin' }, { label: 'Character Templates' }]}
        actions={
        <>
            <SegmentedTabs<Filter>
            ariaLabel="Template status"
            layoutId="template-filter"
            size="sm"
            value={filter}
            onChange={setFilter}
            options={[
            { value: 'live', label: 'Live' },
            { value: 'archived', label: 'Archived' },
            { value: 'all', label: 'All' }]
            } />
          
            <Button icon={PlusIcon} onClick={() => pushToast({ tone: 'info', title: 'Template builder opening…' })}>
              New template
            </Button>
          </>
        } />
      

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {results.map((template, i) =>
        <GlassCard key={template.id} padded={false} className="overflow-hidden">
            <div className="flex h-40 items-center justify-center bg-gradient-to-b from-secondary-50/70 to-white">
              <CharacterThumb
              config={characters[i % characters.length].config}
              label={template.name}
              className="h-36 w-36" />
            
            </div>
            <div className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="truncate font-display text-[15px] font-semibold text-slate-900">{template.name}</h2>
                  <p className="text-[12px] text-slate-500">
                    {template.category} · owned by {template.owner}
                  </p>
                </div>
                <Badge tone={template.status === 'live' ? 'success' : 'neutral'}>{template.status}</Badge>
              </div>
              <div className="mt-4 flex items-center justify-between text-[12px] text-slate-500">
                <span className="inline-flex items-center gap-1.5">
                  <StarIcon className="h-3.5 w-3.5 text-accent" />
                  {template.usage} uses
                </span>
                <span>Updated {template.updated}</span>
              </div>
              <div className="mt-4 flex gap-2">
                <Button size="sm" variant="outline" fullWidth>
                  Edit
                </Button>
                <Button size="sm" variant="ghost" icon={ArchiveIcon} onClick={() => setPending(template)}>
                  {template.status === 'archived' ? 'Restore' : 'Archive'}
                </Button>
              </div>
            </div>
          </GlassCard>
        )}
      </div>

      <Modal
        open={!!pending}
        onClose={() => setPending(null)}
        title={pending?.status === 'archived' ? 'Restore template?' : 'Archive template?'}
        description={
        pending?.status === 'archived' ?
        'Designers will be able to start new characters from this template again.' :
        `${pending?.usage ?? 0} characters already use this template. Archiving hides it from new work but does not affect existing characters.`
        }
        icon={LayoutTemplateIcon}
        tone={pending?.status === 'archived' ? 'primary' : 'danger'}
        size="sm"
        footer={
        <>
            <Button variant="outline" onClick={() => setPending(null)}>
              Cancel
            </Button>
            <Button
            onClick={() => {
              if (pending) {
                const next = pending.status === 'archived' ? 'live' : 'archived';
                setItems((prev) => prev.map((t) => t.id === pending.id ? { ...t, status: next } : t));
                pushToast({ tone: 'success', title: `Template ${next === 'live' ? 'restored' : 'archived'}`, description: pending.name });
              }
              setPending(null);
            }}>
            
              Confirm
            </Button>
          </>
        } />
      
    </div>);

}