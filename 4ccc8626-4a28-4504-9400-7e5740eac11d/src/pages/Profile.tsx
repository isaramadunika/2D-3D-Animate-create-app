import React, { useState } from 'react';
import { AwardIcon, BriefcaseIcon, MailIcon, MapPinIcon, PencilIcon, SaveIcon } from 'lucide-react';
import { PageHeader } from '../components/layout/PageHeader';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { TextField } from '../components/ui/TextField';
import { CharacterThumb } from '../components/CharacterThumb';
import { useApp } from '../contexts/AppContext';

export function Profile() {
  const { userName, characters, pushToast, role } = useApp();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: userName,
    email: 'aisha@brightplay.io',
    title: 'Senior Character Designer',
    location: 'Kuala Lumpur, MY',
    bio: 'I design friendly, inclusive characters for early-years literacy and numeracy games.'
  });

  const mine = characters.slice(0, 4);

  return (
    <div>
      <PageHeader
        title="Profile"
        subtitle="Your public studio profile and design activity."
        crumbs={[{ label: 'Account' }, { label: 'Profile' }]}
        actions={
        editing ?
        <>
              <Button variant="outline" onClick={() => setEditing(false)}>
                Cancel
              </Button>
              <Button
            icon={SaveIcon}
            onClick={() => {
              setEditing(false);
              pushToast({ tone: 'success', title: 'Profile updated' });
            }}>
            
                Save profile
              </Button>
            </> :

        <Button icon={PencilIcon} onClick={() => setEditing(true)}>
              Edit profile
            </Button>

        } />
      

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
        <GlassCard className="h-fit text-center">
          <span className="mx-auto grid h-24 w-24 place-items-center rounded-3xl bg-primary text-2xl font-semibold text-white shadow-lift">
            {form.name.
            split(' ').
            map((p) => p[0]).
            join('')}
          </span>
          <h2 className="mt-4 font-display text-lg font-semibold text-slate-900">{form.name}</h2>
          <p className="text-[13px] text-slate-500">{form.title}</p>
          <div className="mt-3 flex justify-center gap-2">
            <Badge tone="primary" className="capitalize">
              {role}
            </Badge>
            <Badge tone="success">Active</Badge>
          </div>
          <dl className="mt-6 space-y-3 text-left">
            {[
            { icon: MailIcon, value: form.email },
            { icon: BriefcaseIcon, value: 'BrightPlay Educational Games' },
            { icon: MapPinIcon, value: form.location }].
            map((row) =>
            <div key={row.value} className="flex items-center gap-2.5 text-[13px] text-slate-600">
                <row.icon className="h-4 w-4 shrink-0 text-slate-400" />
                <span className="truncate">{row.value}</span>
              </div>
            )}
          </dl>
          <div className="mt-6 grid grid-cols-3 gap-2 border-t border-slate-200/70 pt-5">
            {[
            { label: 'Characters', value: characters.length },
            { label: 'Published', value: 6 },
            { label: 'Exports', value: 148 }].
            map((stat) =>
            <div key={stat.label}>
                <p className="font-display text-lg font-semibold text-slate-900">{stat.value}</p>
                <p className="text-[11px] text-slate-500">{stat.label}</p>
              </div>
            )}
          </div>
        </GlassCard>

        <div className="space-y-6">
          <GlassCard>
            <h2 className="font-display text-[15px] font-semibold text-slate-900">Details</h2>
            <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
              <TextField
                label="Full name"
                value={form.name}
                disabled={!editing}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
              
              <TextField
                label="Email"
                type="email"
                value={form.email}
                disabled={!editing}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
              
              <TextField
                label="Job title"
                value={form.title}
                disabled={!editing}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
              
              <TextField
                label="Location"
                value={form.location}
                disabled={!editing}
                onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} />
              
            </div>
            <div className="mt-5">
              <label htmlFor="bio" className="mb-1.5 block text-[13px] font-medium text-slate-700">
                About
              </label>
              <textarea
                id="bio"
                rows={3}
                disabled={!editing}
                value={form.bio}
                onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 bg-white/85 p-3 text-sm text-slate-700 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100 disabled:opacity-70" />
              
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center gap-2">
              <AwardIcon className="h-4 w-4 text-accent" />
              <h2 className="font-display text-[15px] font-semibold text-slate-900">Recent characters</h2>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
              {mine.map((c) =>
              <div key={c.id} className="rounded-2xl border border-slate-200 bg-white/70 p-3 text-center">
                  <CharacterThumb config={c.config} label={c.name} className="mx-auto h-24 w-24" />
                  <p className="mt-2 truncate text-[12px] font-medium text-slate-700">{c.name}</p>
                </div>
              )}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>);

}