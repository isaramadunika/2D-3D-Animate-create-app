import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BuildingIcon, LockIcon, MailIcon, UserIcon, UserPlusIcon } from 'lucide-react';
import { AuthLayout } from '../components/layout/AuthLayout';
import { TextField } from '../components/ui/TextField';
import { Button } from '../components/ui/Button';
import { useApp } from '../contexts/AppContext';

function strengthOf(password: string) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
}

const LABELS = ['Too short', 'Weak', 'Fair', 'Strong', 'Excellent'];
const COLORS = ['bg-slate-200', 'bg-danger', 'bg-accent', 'bg-success', 'bg-success'];

export function Register() {
  const navigate = useNavigate();
  const { pushToast, setRole } = useApp();
  const [form, setForm] = useState({ name: '', email: '', org: 'BrightPlay Games', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const score = useMemo(() => strengthOf(form.password), [form.password]);

  const update = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
  setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (form.name.trim().length < 2) next.name = 'Please enter your full name.';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid work email address.';
    if (score < 2) next.password = 'Use at least 8 characters with a number.';
    if (!accepted) next.accepted = 'You must accept the terms to continue.';
    setErrors(next);
    if (Object.keys(next).length) return;
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      setRole('designer');
      pushToast({ tone: 'success', title: 'Account created', description: 'Your designer workspace is ready.' });
      navigate('/app/dashboard');
    }, 950);
  };

  return (
    <AuthLayout
      title="Create your designer account"
      subtitle="Join your team’s character studio in under a minute."
      footer={
      <>
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-primary hover:underline">
            Sign in
          </Link>
        </>
      }>
      
      <form onSubmit={submit} noValidate className="space-y-5">
        <TextField label="Full name" icon={UserIcon} value={form.name} error={errors.name} onChange={update('name')} placeholder="Jane Cooper" />
        <TextField
          label="Work email"
          type="email"
          icon={MailIcon}
          value={form.email}
          error={errors.email}
          onChange={update('email')}
          placeholder="you@company.com" />
        
        <TextField label="Organisation" icon={BuildingIcon} value={form.org} onChange={update('org')} />
        <div>
          <TextField
            label="Password"
            type="password"
            icon={LockIcon}
            value={form.password}
            error={errors.password}
            onChange={update('password')}
            hint="8+ characters, mix letters, numbers and symbols." />
          
          <div className="mt-2 flex items-center gap-2">
            <div className="flex h-1.5 flex-1 gap-1">
              {[0, 1, 2, 3].map((i) =>
              <span
                key={i}
                className={`h-full flex-1 rounded-full transition-colors ${
                i < score ? COLORS[score] : 'bg-slate-200'}`
                } />

              )}
            </div>
            <span className="w-20 text-right text-[11px] font-medium text-slate-500">{LABELS[score]}</span>
          </div>
        </div>

        <div>
          <label className="flex cursor-pointer items-start gap-2 text-[13px] text-slate-600">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary-200" />
            
            <span>
              I agree to the <span className="font-medium text-primary">Terms of Service</span> and the child-safety
              content policy.
            </span>
          </label>
          {errors.accepted && <p className="mt-1.5 text-[12px] font-medium text-danger">{errors.accepted}</p>}
        </div>

        <Button type="submit" size="lg" fullWidth loading={loading} icon={UserPlusIcon}>
          {loading ? 'Creating account…' : 'Create account'}
        </Button>
      </form>
    </AuthLayout>);

}