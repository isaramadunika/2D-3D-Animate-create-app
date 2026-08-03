import React, { useState } from 'react';
import {
  BookOpenIcon,
  ChevronDownIcon,
  KeyboardIcon,
  LifeBuoyIcon,
  MessageCircleIcon,
  PlayCircleIcon } from
'lucide-react';
import { PageHeader } from '../components/layout/PageHeader';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { SearchInput } from '../components/ui/SearchInput';
import { EmptyState } from '../components/ui/EmptyState';

const FAQS = [
{
  q: 'How do I see the 2D and 3D views at the same time?',
  a: 'Open any character in the editor or the viewer and choose the “Split” layout. Both viewports render the same live character, so any change you make appears in both instantly.'
},
{
  q: 'How do I rotate, pan and zoom the 3D model?',
  a: 'Drag with the left mouse button to orbit, hold Shift (or drag with the right button) to pan, and scroll to zoom. Arrow keys and +/- work when the viewport has keyboard focus. Use “Reset view” to return to the fitted framing.'
},
{
  q: 'Can I export with a transparent background?',
  a: 'Yes. PNG and SVG support transparency — enable “Transparent background” in the Export screen. JPG always exports on a solid background.'
},
{
  q: 'How do undo and redo work?',
  a: 'Every property change is recorded. Press ⌘Z / Ctrl+Z to undo and ⇧⌘Z / Ctrl+Y to redo, or use the toolbar buttons in the editor header. The last 40 steps are kept.'
},
{
  q: 'What happens when I delete a character?',
  a: 'You will always see a confirmation dialog first, including how many games use the character. Deleting removes it from your library — ask an administrator to restore it from the nightly backup.'
}];


const SHORTCUTS = [
['⌘Z', 'Undo'],
['⇧⌘Z', 'Redo'],
['⌘K', 'Global search'],
['R', 'Reset viewport'],
['+ / -', 'Zoom in / out'],
['Esc', 'Close dialog']];


export function Help() {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState<number | null>(0);
  const results = FAQS.filter(
    (f) => !query || f.q.toLowerCase().includes(query.toLowerCase()) || f.a.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <PageHeader
        title="Help Centre"
        subtitle="Guides, keyboard shortcuts and support for the character studio."
        crumbs={[{ label: 'Account' }, { label: 'Help' }]}
        actions={
        <Button icon={MessageCircleIcon} variant="outline">
            Contact support
          </Button>
        } />
      

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <GlassCard>
            <SearchInput
              value={query}
              onChange={setQuery}
              placeholder="Search help articles…"
              ariaLabel="Search help" />
            
            <div className="mt-5 space-y-2">
              {results.length === 0 ?
              <EmptyState
                title="No articles matched"
                description="Try a shorter search term, or contact support and we’ll help directly." /> :


              results.map((faq, i) =>
              <div key={faq.q} className="overflow-hidden rounded-2xl border border-slate-200 bg-white/70">
                    <button
                  onClick={() => setOpen(open === i ? null : i)}
                  aria-expanded={open === i}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left">
                  
                      <span className="flex-1 text-[13px] font-semibold text-slate-800">{faq.q}</span>
                      <ChevronDownIcon
                    className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${open === i ? 'rotate-180' : ''}`} />
                  
                    </button>
                    {open === i &&
                <p className="border-t border-slate-200/70 px-4 py-3 text-[13px] leading-relaxed text-slate-600">
                        {faq.a}
                      </p>
                }
                  </div>
              )
              }
            </div>
          </GlassCard>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
            { icon: PlayCircleIcon, title: 'Getting started', text: '6 short videos covering the whole workflow.' },
            { icon: BookOpenIcon, title: 'Design guidelines', text: 'Brand, accessibility and child-safety rules.' },
            { icon: LifeBuoyIcon, title: 'Enterprise support', text: '24/5 response within 4 business hours.' }].
            map((card) =>
            <GlassCard key={card.title}>
                <span className="grid h-10 w-10 place-items-center rounded-2xl bg-primary-50 text-primary">
                  <card.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-3 font-display text-[14px] font-semibold text-slate-900">{card.title}</h3>
                <p className="mt-1 text-[12px] leading-relaxed text-slate-500">{card.text}</p>
              </GlassCard>
            )}
          </div>
        </div>

        <GlassCard className="h-fit">
          <div className="flex items-center gap-2">
            <KeyboardIcon className="h-4 w-4 text-slate-400" />
            <h2 className="font-display text-[15px] font-semibold text-slate-900">Keyboard shortcuts</h2>
          </div>
          <ul className="mt-4 space-y-2.5">
            {SHORTCUTS.map(([key, label]) =>
            <li key={key} className="flex items-center justify-between text-[13px] text-slate-600">
                <span>{label}</span>
                <kbd className="rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-semibold text-slate-500">
                  {key}
                </kbd>
              </li>
            )}
          </ul>
        </GlassCard>
      </div>
    </div>);

}