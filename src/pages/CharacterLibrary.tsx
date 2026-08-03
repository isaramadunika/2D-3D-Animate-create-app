import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FilterIcon,
  LayoutGridIcon,
  ListIcon,
  PlusIcon,
  SearchXIcon,
  Trash2Icon } from
'lucide-react';
import { PageHeader } from '../components/layout/PageHeader';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { SearchInput } from '../components/ui/SearchInput';
import { SegmentedTabs } from '../components/ui/SegmentedTabs';
import { EmptyState } from '../components/ui/EmptyState';
import { CardSkeleton } from '../components/ui/Skeleton';
import { CharacterCard } from '../components/CharacterCard';
import { CharacterThumb } from '../components/CharacterThumb';
import { useApp } from '../contexts/AppContext';
import { Character, CharacterStatus, CharacterType } from '../types/character';

type SortKey = 'recent' | 'name' | 'usage';

export function CharacterLibrary() {
  const navigate = useNavigate();
  const { characters, duplicateCharacter, deleteCharacter, pushToast } = useApp();
  const [query, setQuery] = useState('');
  const [type, setType] = useState<'all' | CharacterType>('all');
  const [status, setStatus] = useState<'all' | CharacterStatus>('all');
  const [sort, setSort] = useState<SortKey>('recent');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [loading] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Character | null>(null);

  const results = useMemo(() => {
    const filtered = characters.filter((c) => {
      const matchesQuery =
      !query ||
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()));
      const matchesType = type === 'all' || c.type === type;
      const matchesStatus = status === 'all' || c.status === status;
      return matchesQuery && matchesType && matchesStatus;
    });
    return [...filtered].sort((a, b) => {
      if (sort === 'name') return a.name.localeCompare(b.name);
      if (sort === 'usage') return b.usedIn - a.usedIn;
      return b.updatedAt.localeCompare(a.updatedAt);
    });
  }, [characters, query, type, status, sort]);

  const handleDuplicate = (id: string) => {
    const copy = duplicateCharacter(id);
    if (copy) pushToast({ tone: 'success', title: 'Duplicated', description: `${copy.name} added as a draft.` });
  };

  return (
    <div>
      <PageHeader
        title="Character Library"
        subtitle={`${results.length} of ${characters.length} characters match your filters.`}
        crumbs={[{ label: 'Workspace', to: '/app/dashboard' }, { label: 'Character Library' }]}
        actions={
        <>
            <SegmentedTabs
            ariaLabel="Layout"
            size="sm"
            layoutId="library-view"
            value={view}
            onChange={setView}
            options={[
            { value: 'grid', label: 'Grid', icon: LayoutGridIcon },
            { value: 'list', label: 'List', icon: ListIcon }]
            } />
          
            <Button icon={PlusIcon} onClick={() => navigate('/app/create')}>
              New character
            </Button>
          </>
        } />
      

      {/* Filter toolbar */}
      <GlassCard className="mb-6" padded={false}>
        <div className="flex flex-col gap-4 p-4 lg:flex-row lg:items-center">
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder="Search by name or tag…"
            ariaLabel="Search characters"
            className="lg:w-80" />
          
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-slate-500">
              <FilterIcon className="h-3.5 w-3.5" />
              Filters
            </span>
            <select
              aria-label="Filter by type"
              value={type}
              onChange={(e) => setType(e.target.value as typeof type)}
              className="h-10 rounded-xl border border-slate-200 bg-white/80 px-3 text-[13px] text-slate-700 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100">
              
              <option value="all">All types</option>
              <option value="animal">Animal</option>
              <option value="plant">Plant</option>
              <option value="human">Human</option>
            </select>
            <select
              aria-label="Filter by status"
              value={status}
              onChange={(e) => setStatus(e.target.value as typeof status)}
              className="h-10 rounded-xl border border-slate-200 bg-white/80 px-3 text-[13px] text-slate-700 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100">
              
              <option value="all">Any status</option>
              <option value="published">Published</option>
              <option value="review">In review</option>
              <option value="draft">Draft</option>
            </select>
            <select
              aria-label="Sort characters"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="h-10 rounded-xl border border-slate-200 bg-white/80 px-3 text-[13px] text-slate-700 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100">
              
              <option value="recent">Sort: recently updated</option>
              <option value="name">Sort: name A–Z</option>
              <option value="usage">Sort: most used</option>
            </select>
            {(query || type !== 'all' || status !== 'all') &&
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setQuery('');
                setType('all');
                setStatus('all');
              }}>
              
                Clear all
              </Button>
            }
          </div>
        </div>
      </GlassCard>

      {loading ?
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {[0, 1, 2, 3].map((i) =>
        <CardSkeleton key={i} />
        )}
        </div> :
      results.length === 0 ?
      <GlassCard>
          <EmptyState
          icon={SearchXIcon}
          title="No characters found"
          description="Try a different search term, or clear the filters to see the whole library."
          action={
          <Button
            variant="outline"
            onClick={() => {
              setQuery('');
              setType('all');
              setStatus('all');
            }}>
            
                Clear filters
              </Button>
          } />
        
        </GlassCard> :
      view === 'grid' ?
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {results.map((character, i) =>
        <CharacterCard
          key={character.id}
          character={character}
          index={i}
          onDuplicate={handleDuplicate}
          onDelete={setPendingDelete} />

        )}
        </div> :

      <GlassCard padded={false} className="overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200/80 bg-white/50 text-[11px] uppercase tracking-wider text-slate-500">
              <tr>
                <th scope="col" className="px-5 py-3 font-semibold">Character</th>
                <th scope="col" className="px-5 py-3 font-semibold">Type</th>
                <th scope="col" className="px-5 py-3 font-semibold">Status</th>
                <th scope="col" className="px-5 py-3 font-semibold">Used in</th>
                <th scope="col" className="px-5 py-3 font-semibold">Updated</th>
                <th scope="col" className="px-5 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {results.map((character) =>
            <tr key={character.id} className="border-b border-slate-100 last:border-0 hover:bg-white/70">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary-50">
                        <CharacterThumb config={character.config} label={character.name} className="h-9 w-9" />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-slate-800">{character.name}</p>
                        <p className="truncate text-[12px] text-slate-400">{character.author}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 capitalize text-slate-600">{character.type}</td>
                  <td className="px-5 py-3">
                    <Badge tone={character.status === 'published' ? 'success' : character.status === 'review' ? 'accent' : 'neutral'}>
                      {character.status}
                    </Badge>
                  </td>
                  <td className="px-5 py-3 tabular-nums text-slate-600">{character.usedIn}</td>
                  <td className="px-5 py-3 text-slate-500">{character.updatedAt}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Button size="sm" variant="outline" onClick={() => navigate(`/app/editor/${character.id}`)}>
                        Edit
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setPendingDelete(character)}>
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
            )}
            </tbody>
          </table>
        </GlassCard>
      }

      <Modal
        open={!!pendingDelete}
        onClose={() => setPendingDelete(null)}
        title={`Delete “${pendingDelete?.name ?? ''}”?`}
        description="You can’t undo this. Consider archiving the character instead if it is used in a live game."
        icon={Trash2Icon}
        tone="danger"
        size="sm"
        footer={
        <>
            <Button variant="outline" onClick={() => setPendingDelete(null)}>
              Cancel
            </Button>
            <Button
            variant="danger"
            onClick={() => {
              if (pendingDelete) {
                deleteCharacter(pendingDelete.id);
                pushToast({ tone: 'error', title: 'Character deleted', description: `${pendingDelete.name} was removed.` });
              }
              setPendingDelete(null);
            }}>
            
              Delete
            </Button>
          </>
        } />
      
    </div>);

}