import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  BoxIcon,
  LayoutPanelLeftIcon,
  LightbulbIcon,
  PencilIcon,
  ShapesIcon,
  SunIcon } from
'lucide-react';
import { PageHeader } from '../components/layout/PageHeader';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { SegmentedTabs } from '../components/ui/SegmentedTabs';
import { LabeledSlider } from '../components/ui/LabeledSlider';
import { ViewportCard } from '../components/three/ViewportCard';
import { CharacterThumb } from '../components/CharacterThumb';
import { EnvironmentPreset } from '../components/three/CharacterCanvas';
import { useApp } from '../contexts/AppContext';

type ViewMode = 'split' | '2d' | '3d';

const ENVIRONMENTS: {value: EnvironmentPreset;label: string;}[] = [
{ value: 'studio', label: 'Studio' },
{ value: 'sky', label: 'Sky' },
{ value: 'sunset', label: 'Sunset' },
{ value: 'grid', label: 'Neutral' }];


export function Viewer() {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const { characters, activeId, setActiveId } = useApp();

  const idParam = params.get('id');
  const viewParam = params.get('view') as ViewMode ?? 'split';
  const [view, setView] = useState<ViewMode>(viewParam);
  const [environment, setEnvironment] = useState<EnvironmentPreset>('studio');
  const [lighting, setLighting] = useState(1);
  const [shadows, setShadows] = useState(true);

  useEffect(() => setView(viewParam), [viewParam]);
  useEffect(() => {
    if (idParam) setActiveId(idParam);
  }, [idParam, setActiveId]);

  const character = characters.find((c) => c.id === (idParam ?? activeId)) ?? characters[0];

  if (!character) {
    return (
      <GlassCard>
        <p className="text-sm text-slate-500">No characters available. Create one to use the viewer.</p>
      </GlassCard>);

  }

  const setViewMode = (mode: ViewMode) => {
    setView(mode);
    const next = new URLSearchParams(params);
    next.set('view', mode);
    setParams(next, { replace: true });
  };

  return (
    <div>
      <PageHeader
        title="Character Viewer"
        subtitle="Inspect the same character in flat 2D and interactive 3D, side by side."
        crumbs={[{ label: 'Preview' }, { label: character.name }]}
        actions={
        <>
            <SegmentedTabs<ViewMode>
            ariaLabel="Viewer layout"
            layoutId="viewer-mode"
            value={view}
            onChange={setViewMode}
            options={[
            { value: 'split', label: 'Split', icon: LayoutPanelLeftIcon },
            { value: '2d', label: '2D', icon: ShapesIcon },
            { value: '3d', label: '3D', icon: BoxIcon }]
            } />
          
            <Button icon={PencilIcon} onClick={() => navigate(`/app/editor/${character.id}`)}>
              Edit character
            </Button>
          </>
        } />
      

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div
          className={`grid min-h-[600px] gap-6 ${
          view === 'split' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`
          }>
          
          {(view === 'split' || view === '2d') &&
          <ViewportCard
            config={character.config}
            mode="2d"
            title={`${character.name} · 2D`}
            environment={environment === 'studio' ? 'grid' : environment}
            className="min-h-[560px]" />

          }
          {(view === 'split' || view === '3d') &&
          <ViewportCard
            config={character.config}
            mode="3d"
            title={`${character.name} · 3D`}
            environment={environment}
            lighting={lighting}
            showShadow={shadows}
            className="min-h-[560px]" />

          }
        </div>

        <div className="space-y-6">
          <GlassCard>
            <h2 className="font-display text-[15px] font-semibold text-slate-900">Scene</h2>
            <p className="mt-1 text-[12px] text-slate-500">Applies to the 3D viewport.</p>

            <div className="mt-4">
              <span className="mb-2 flex items-center gap-1.5 text-[13px] font-medium text-slate-600">
                <SunIcon className="h-3.5 w-3.5 text-slate-400" />
                Environment
              </span>
              <div className="grid grid-cols-2 gap-2">
                {ENVIRONMENTS.map((env) =>
                <button
                  key={env.value}
                  onClick={() => setEnvironment(env.value)}
                  aria-pressed={environment === env.value}
                  className={`rounded-xl border px-3 py-2 text-[12px] font-medium transition-all ${
                  environment === env.value ?
                  'border-primary bg-primary-50 text-primary-700' :
                  'border-slate-200 bg-white/70 text-slate-500 hover:border-primary-200'}`
                  }>
                  
                    {env.label}
                  </button>
                )}
              </div>
            </div>

            <div className="mt-5">
              <LabeledSlider
                label="Lighting"
                icon={LightbulbIcon}
                value={lighting}
                min={0.3}
                max={1.8}
                onChange={setLighting} />
              
            </div>

            <label className="mt-5 flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 bg-white/70 px-3 py-2.5">
              <span className="text-[13px] font-medium text-slate-700">Ground shadows</span>
              <input
                type="checkbox"
                checked={shadows}
                onChange={(e) => setShadows(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary-200" />
              
            </label>

            <div className="mt-5 rounded-xl bg-slate-50 p-3 text-[12px] leading-relaxed text-slate-500">
              <p className="font-medium text-slate-700">Controls</p>
              <p className="mt-1">Drag to orbit · Shift-drag or right-drag to pan · Scroll to zoom · Arrow keys work too.</p>
            </div>
          </GlassCard>

          <GlassCard padded={false}>
            <h2 className="border-b border-white/70 px-5 py-4 font-display text-[15px] font-semibold text-slate-900">
              Switch character
            </h2>
            <ul className="max-h-80 overflow-y-auto p-2">
              {characters.map((c) => {
                const active = c.id === character.id;
                return (
                  <li key={c.id}>
                    <button
                      onClick={() => {
                        const next = new URLSearchParams(params);
                        next.set('id', c.id);
                        setParams(next, { replace: true });
                      }}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors ${
                      active ? 'bg-primary-50' : 'hover:bg-white/80'}`
                      }>
                      
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-white">
                        <CharacterThumb config={c.config} label={c.name} className="h-9 w-9" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[13px] font-medium text-slate-800">{c.name}</span>
                        <span className="block truncate text-[11px] capitalize text-slate-400">{c.type}</span>
                      </span>
                      {active && <Badge tone="primary">Viewing</Badge>}
                    </button>
                  </li>);

              })}
            </ul>
          </GlassCard>
        </div>
      </div>
    </div>);

}