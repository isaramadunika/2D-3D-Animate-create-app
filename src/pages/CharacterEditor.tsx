import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  CopyIcon,
  DownloadIcon,
  Redo2Icon,
  SaveIcon,
  Trash2Icon,
  Undo2Icon,
  WandSparklesIcon } from
'lucide-react';
import { PageHeader } from '../components/layout/PageHeader';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Tooltip } from '../components/ui/Tooltip';
import { TextField } from '../components/ui/TextField';
import { ViewportCard } from '../components/three/ViewportCard';
import { CharacterControls } from '../components/editor/CharacterControls';
import { useCharacterHistory } from '../hooks/useCharacterHistory';
import { useApp } from '../contexts/AppContext';
import { CHARACTER_TYPE_LABEL, DEFAULT_CONFIG } from '../types/character';

export function CharacterEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { characters, activeId, setActiveId, updateCharacter, createCharacter, deleteCharacter, duplicateCharacter, pushToast } =
  useApp();

  const targetId = id ?? activeId ?? characters[0]?.id;
  const character = characters.find((c) => c.id === targetId);

  const { config, set, replace, undo, redo, canUndo, canRedo, steps } = useCharacterHistory(
    character?.config ?? DEFAULT_CONFIG
  );
  const [name, setName] = useState(character?.name ?? 'Untitled character');
  const [dirty, setDirty] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (character) {
      replace(character.config);
      setName(character.name);
      setActiveId(character.id);
      setDirty(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [character?.id]);

  useEffect(() => {
    if (!character) return;
    setDirty(JSON.stringify(config) !== JSON.stringify(character.config) || name !== character.name);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config, name]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey)) return;
      if (e.key.toLowerCase() === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if (e.key.toLowerCase() === 'z' && e.shiftKey || e.key.toLowerCase() === 'y') {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [undo, redo]);

  const summary = useMemo(
    () => [
    { label: 'Type', value: CHARACTER_TYPE_LABEL[config.type] },
    { label: 'Body', value: config.bodyShape },
    { label: 'Outfit', value: config.clothesStyle },
    { label: 'Accessory', value: config.accessory },
    { label: 'Edits', value: `${steps}` }],

    [config, steps]
  );

  const save = () => {
    setSaving(true);
    window.setTimeout(() => {
      setSaving(false);
      if (character) {
        updateCharacter(character.id, { name, config, type: config.type });
        pushToast({ tone: 'success', title: 'Changes saved', description: `${name} is up to date.` });
      } else {
        const created = createCharacter(name, config);
        pushToast({ tone: 'success', title: 'Character created', description: `${created.name} saved as a draft.` });
        navigate(`/app/editor/${created.id}`);
      }
      setDirty(false);
    }, 650);
  };

  return (
    <div>
      <PageHeader
        title="Character Editor"
        subtitle="Edit every feature with live 2D and 3D preview. All changes are reversible."
        crumbs={[{ label: 'Workspace', to: '/app/dashboard' }, { label: 'Library', to: '/app/library' }, { label: name }]}
        actions={
        <>
            <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white/70 p-1">
              <Tooltip label="Undo" shortcut="⌘Z">
                <button
                onClick={undo}
                disabled={!canUndo}
                aria-label="Undo"
                className="grid h-8 w-8 place-items-center rounded-lg text-slate-500 transition-colors hover:bg-primary-50 hover:text-primary disabled:opacity-40">
                
                  <Undo2Icon className="h-4 w-4" />
                </button>
              </Tooltip>
              <Tooltip label="Redo" shortcut="⇧⌘Z">
                <button
                onClick={redo}
                disabled={!canRedo}
                aria-label="Redo"
                className="grid h-8 w-8 place-items-center rounded-lg text-slate-500 transition-colors hover:bg-primary-50 hover:text-primary disabled:opacity-40">
                
                  <Redo2Icon className="h-4 w-4" />
                </button>
              </Tooltip>
            </div>
            <Button variant="outline" icon={CopyIcon} onClick={() => {
            if (!character) return;
            const copy = duplicateCharacter(character.id);
            if (copy) {
              pushToast({ tone: 'info', title: 'Duplicated', description: `${copy.name} added to your library.` });
              navigate(`/app/editor/${copy.id}`);
            }
          }}>
              Duplicate
            </Button>
            <Button variant="outline" icon={DownloadIcon} onClick={() => navigate('/app/export')}>
              Export
            </Button>
            <Button icon={SaveIcon} loading={saving} onClick={save} disabled={!dirty && !!character}>
              {dirty ? 'Save changes' : 'Saved'}
            </Button>
          </>
        } />
      

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[320px_minmax(0,1fr)_280px]">
        {/* Controls */}
        <GlassCard className="h-fit" padded={false}>
          <div className="flex items-center justify-between border-b border-white/70 px-5 py-4">
            <h2 className="font-display text-[15px] font-semibold text-slate-900">Properties</h2>
            <Badge tone={dirty ? 'accent' : 'success'}>{dirty ? 'Unsaved' : 'In sync'}</Badge>
          </div>
          <div className="max-h-[calc(100vh-320px)] overflow-y-auto p-4">
            <CharacterControls config={config} set={set} />
          </div>
        </GlassCard>

        {/* Dual viewport — 2D and 3D on one screen */}
        <div className="grid min-h-[560px] grid-cols-1 gap-6 lg:grid-cols-2">
          <ViewportCard config={config} mode="2d" title="2D Live Preview" environment="grid" className="min-h-[380px]" />
          <ViewportCard config={config} mode="3d" title="3D Live Preview" environment="studio" className="min-h-[380px]" />
        </div>

        {/* Meta / actions */}
        <div className="space-y-6">
          <GlassCard>
            <h2 className="font-display text-[15px] font-semibold text-slate-900">Details</h2>
            <TextField
              label="Character name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-4"
              hint="Shown to children inside the game." />
            
            <dl className="mt-5 space-y-2.5">
              {summary.map((row) =>
              <div key={row.label} className="flex items-center justify-between text-[13px]">
                  <dt className="text-slate-500">{row.label}</dt>
                  <dd className="font-medium capitalize text-slate-800">{row.value}</dd>
                </div>
              )}
            </dl>
          </GlassCard>

          <GlassCard>
            <h2 className="font-display text-[15px] font-semibold text-slate-900">Quick styles</h2>
            <p className="mt-1 text-[12px] text-slate-500">One-click palettes that stay on brand.</p>
            <div className="mt-4 space-y-2">
              {[
              { label: 'Indigo classroom', body: '#4F46E5', head: '#6366F1', outfit: '#06B6D4' },
              { label: 'Sunny meadow', body: '#F59E0B', head: '#FBBF24', outfit: '#22C55E' },
              { label: 'Ocean explorer', body: '#06B6D4', head: '#22D3EE', outfit: '#4F46E5' }].
              map((preset) =>
              <button
                key={preset.label}
                onClick={() =>
                set({ bodyColor: preset.body, headColor: preset.head, clothesColor: preset.outfit })
                }
                className="flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white/70 px-3 py-2.5 text-left text-[13px] font-medium text-slate-700 transition-all hover:border-primary-200 hover:shadow-soft">
                
                  <span className="flex gap-1">
                    {[preset.body, preset.head, preset.outfit].map((c) =>
                  <span key={c} className="h-4 w-4 rounded-full ring-1 ring-white" style={{ backgroundColor: c }} />
                  )}
                  </span>
                  {preset.label}
                </button>
              )}
            </div>
            <Button
              variant="outline"
              fullWidth
              className="mt-4"
              icon={WandSparklesIcon}
              onClick={() => {
                replace({ ...DEFAULT_CONFIG, type: config.type });
                pushToast({ tone: 'info', title: 'Reset to base', description: 'Character returned to the default template.' });
              }}>
              
              Reset to base
            </Button>
          </GlassCard>

          {character &&
          <GlassCard>
              <h2 className="font-display text-[15px] font-semibold text-slate-900">Danger zone</h2>
              <p className="mt-1 text-[12px] text-slate-500">
                Deleting removes the character from {character.usedIn} game{character.usedIn === 1 ? '' : 's'}.
              </p>
              <Button variant="danger" fullWidth className="mt-4" icon={Trash2Icon} onClick={() => setConfirmDelete(true)}>
                Delete character
              </Button>
            </GlassCard>
          }
        </div>
      </div>

      <Modal
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        title={`Delete “${name}”?`}
        description="This action cannot be undone. The character will be removed from your library and any linked games."
        icon={Trash2Icon}
        tone="danger"
        size="sm"
        footer={
        <>
            <Button variant="outline" onClick={() => setConfirmDelete(false)}>
              Keep character
            </Button>
            <Button
            variant="danger"
            icon={Trash2Icon}
            onClick={() => {
              if (character) deleteCharacter(character.id);
              setConfirmDelete(false);
              pushToast({ tone: 'error', title: 'Character deleted', description: `${name} was removed.` });
              navigate('/app/library');
            }}>
            
              Delete permanently
            </Button>
          </>
        } />
      
    </div>);

}