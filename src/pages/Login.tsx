import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LockIcon, LogInIcon, MailIcon, ShieldCheckIcon, UserCogIcon } from 'lucide-react';
import { AuthLayout } from '../components/layout/AuthLayout';
import { TextField } from '../components/ui/TextField';
import { Button } from '../components/ui/Button';
import { useApp } from '../contexts/AppContext';

export function Login() {
  const navigate = useNavigate();
  const { setRole, pushToast } = useApp();
  const [email, setEmail] = useState('aisha@brightplay.io');
  const [password, setPassword] = useState('designstudio');
  const [asAdmin, setAsAdmin] = useState(false);
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState<{email?: string;password?: string;}>({});
  const [loading, setLoading] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (!/^\S+@\S+\.\S+$/.test(email)) next.email = 'Enter a valid work email address.';
    if (password.length < 8) next.password = 'Password must be at least 8 characters.';
    setErrors(next);
    if (Object.keys(next).length) return;
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      setRole(asAdmin ? 'admin' : 'designer');
      pushToast({
        tone: 'success',
        title: 'Signed in',
        description: asAdmin ? 'Welcome back, Marcus.' : 'Welcome back, Aisha.'
      });
      navigate(asAdmin ? '/admin/dashboard' : '/app/dashboard');
    }, 900);
  };

  return (
    <AuthLayout
      title="Sign in to your workspace"
      subtitle="Use your BrightPlay account to continue designing characters."
      footer={
      <>
          New to the studio?{' '}
          <Link to="/register" className="font-semibold text-primary hover:underline">
            Create an account
          </Link>
        </>
      }>
      
      <form onSubmit={submit} noValidate className="space-y-5">
        <div className="grid grid-cols-2 gap-2 rounded-2xl bg-slate-100/80 p-1">
          {[
          { label: 'Designer', icon: UserCogIcon, admin: false },
          { label: 'Administrator', icon: ShieldCheckIcon, admin: true }].
          map((option) => {
            const active = option.admin === asAdmin;
            return (
              <button
                key={option.label}
                type="button"
                onClick={() => {
                  setAsAdmin(option.admin);
                  setEmail(option.admin ? 'marcus@brightplay.io' : 'aisha@brightplay.io');
                }}
                aria-pressed={active}
                className={`flex items-center justify-center gap-2 rounded-xl py-2 text-[13px] font-semibold transition-all ${
                active ? 'bg-white text-primary-700 shadow-soft' : 'text-slate-500 hover:text-slate-700'}`
                }>
                
                <option.icon className="h-4 w-4" />
                {option.label}
              </button>);

          })}
        </div>

        <TextField
          label="Work email"
          type="email"
          icon={MailIcon}
          value={email}
          error={errors.email}
          autoComplete="email"
          onChange={(e) => setEmail(e.target.value)} />
        
        <TextField
          label="Password"
          type="password"
          icon={LockIcon}
          value={password}
          error={errors.password}
          autoComplete="current-password"
          onChange={(e) => setPassword(e.target.value)} />
        

        <div className="flex items-center justify-between">
          <label className="flex cursor-pointer items-center gap-2 text-[13px] text-slate-600">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary-200" />
            
            Keep me signed in
          </label>
          <Link to="/forgot-password" className="text-[13px] font-medium text-primary hover:underline">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" size="lg" fullWidth loading={loading} icon={LogInIcon}>
          {loading ? 'Signing in…' : 'Sign in'}
        </Button>

        <p className="text-center text-[11px] text-slate-400">
          Protected by single sign-on. Demo credentials are pre-filled.
        </p>
      </form>
    </AuthLayout>);

}