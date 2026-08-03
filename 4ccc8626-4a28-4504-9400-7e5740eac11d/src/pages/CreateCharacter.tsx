import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CatIcon,
  CheckIcon,
  CircleIcon,
  LeafIcon,
  SparklesIcon,
  SquareIcon,
  TriangleIcon,
  UserIcon } from
'lucide-react';
import { PageHeader } from '../components/layout/PageHeader';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { TextField } from '../components/ui/TextField';
import { OptionGrid } from '../components/editor/OptionGrid';
import { ColorPicker } from '../components/ui/ColorPicker';
import { ViewportCard } from '../components/three/ViewportCard';
import { useApp } from '../contexts/AppContext';
import { BodyShape, CharacterType, DEFAULT_CONFIG } from '../types/character';
import { useScreenInit } from '../useScreenInit.js';

const STEPS = [
{ title: 'Choose a type', hint: 'Animal, plant or human base' },
{ title: 'Pick a body', hint: 'Shape and colours' },
{ title: 'Name & create', hint: 'Save to your library' }];


export function CreateCharacter() {
  const navigate = useNavigate();
  const { createCharacter, pushToast } = useApp();
  const screenInit = useScreenInit();
  const [step, setStep] = useState<number>(screenInit.step ?? 0);
  const [config, setConfig] = useState({ ...DEFAULT_CONFIG });
  const [name, setName] = useState('');
  const [error, setError] = useState<string>();

  const set = (patch: Partial<typeof config>) => setConfig((c) => ({ ...c, ...patch }));

  const next = () => {
    if (step === 2) {
      if (name.trim().length < 3) {
        setError('Give your character a name of at least 3 characters.');
        return;
      }
      const created = createCharacter(name.trim(), config);
      pushToast({ tone: 'success', title: 'Character created', description: `${created.name} is ready to customise.` });
      navigate(`/app/editor/${created.id}`);
      return;
    }
    setStep((s) => Math.min(2, s + 1));
  };

  return (
    <div>
      <PageHeader
        title="Create Character"
        subtitle="A guided three-step start. You can change everything later in the editor."
        crumbs={[{ label: 'Workspace', to: '/app/dashboard' }, { label: 'Create Character' }]} />
      

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_440px]">
        <GlassCard padded={false}>
          {/* Stepper */}
          <ol className="flex items-center gap-2 border-b border-white/70 px-6 py-5">
            {STEPS.map((s, i) => {
              const done = i < step;
              const active = i === step;
              return (
                <li key={s.title} className="flex flex-1 items-center gap-3">
                  <span
                    className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-[12px] font-semibold transition-colors ${
                    done ?
                    'bg-success text-white' :
                    active ?
                    'bg-primary text-white' :
                    'bg-slate-100 text-slate-400'}`
                    }>
                    
                    {done ? <CheckIcon className="h-4 w-4" /> : i + 1}
                  </span>
                  <span className="hidden min-w-0 md:block">
                    <span className={`block truncate text-[13px] font-semibold ${active ? 'text-slate-900' : 'text-slate-500'}`}>
                      {s.title}
                    </span>
                    <span className="block truncate text-[11px] text-slate-400">{s.hint}</span>
                  </span>
                  {i < STEPS.length - 1 && <span className="ml-auto hidden h-px flex-1 bg-slate-200 lg:block" />}
                </li>);

            })}
          </ol>

          <motion.div key={step} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="space-y-6 p-6">
            {step === 0 &&
            <>
                <OptionGrid<CharacterType>
                label="What are you designing?"
                value={config.type}
                onChange={(type) => set({ type })}
                options={[
                { value: 'animal', label: 'Animal', icon: CatIcon, hint: 'Ears, muzzle and tail-ready base' },
                { value: 'plant', label: 'Plant', icon: LeafIcon, hint: 'Leaves and stem, great for science games' },
                { value: 'human', label: 'Human', icon: UserIcon, hint: 'Hairstyles and outfits' }]
                } />
              
                <div className="rounded-2xl bg-primary-50/70 p-4 text-[13px] leading-relaxed text-primary-800">
                  Tip: character type only sets the starting features. You can mix and match anything in the editor.
                </div>
              </>
            }

            {step === 1 &&
            <>
                <OptionGrid<BodyShape>
                label="Body shape"
                value={config.bodyShape}
                onChange={(bodyShape) => set({ bodyShape })}
                columns={4}
                options={[
                { value: 'round', label: 'Round', icon: CircleIcon },
                { value: 'tall', label: 'Tall', icon: TriangleIcon },
                { value: 'square', label: 'Square', icon: SquareIcon },
                { value: 'pear', label: 'Pear', icon: CircleIcon }]
                } />
              
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <ColorPicker label="Body colour" value={config.bodyColor} onChange={(bodyColor) => set({ bodyColor })} />
                  <ColorPicker label="Head colour" value={config.headColor} onChange={(headColor) => set({ headColor })} />
                </div>
              </>
            }

            {step === 2 &&
            <>
                <TextField
                label="Character name"
                value={name}
                error={error}
                onChange={(e) => {
                  setName(e.target.value);
                  setError(undefined);
                }}
                placeholder="e.g. Milo the Fox"
                hint="Use a friendly, age-appropriate name children can pronounce." />
              
                <div className="rounded-2xl border border-slate-200 bg-white/70 p-4">
                  <p className="text-[13px] font-semibold text-slate-800">Summary</p>
                  <dl className="mt-3 grid grid-cols-2 gap-y-2 text-[13px]">
                    {[
                  ['Type', config.type],
                  ['Body shape', config.bodyShape],
                  ['Body colour', config.bodyColor],
                  ['Head colour', config.headColor]].
                  map(([label, value]) =>
                  <React.Fragment key={label}>
                        <dt className="text-slate-500">{label}</dt>
                        <dd className="font-medium capitalize text-slate-800">{value}</dd>
                      </React.Fragment>
                  )}
                  </dl>
                </div>
              </>
            }
          </motion.div>

          <div className="flex items-center justify-between border-t border-white/70 px-6 py-4">
            <Button variant="ghost" icon={ArrowLeftIcon} disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
              Back
            </Button>
            <span className="text-[12px] text-slate-400">Step {step + 1} of 3</span>
            <Button icon={step === 2 ? SparklesIcon : undefined} iconRight={step === 2 ? undefined : ArrowRightIcon} onClick={next}>
              {step === 2 ? 'Create character' : 'Continue'}
            </Button>
          </div>
        </GlassCard>

        <div className="grid grid-cols-1 gap-6">
          <ViewportCard config={config} mode="2d" title="2D preview" environment="grid" className="h-[280px]" />
          <ViewportCard config={config} mode="3d" title="3D preview" environment="studio" className="h-[320px]" />
        </div>
      </div>
    </div>);

}