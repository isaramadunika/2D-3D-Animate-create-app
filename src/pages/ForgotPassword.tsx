import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, CheckCircle2Icon, MailIcon, SendIcon } from 'lucide-react';
import { AuthLayout } from '../components/layout/AuthLayout';
import { TextField } from '../components/ui/TextField';
import { Button } from '../components/ui/Button';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string>();
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('Enter the email address linked to your account.');
      return;
    }
    setError(undefined);
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 850);
  };

  return (
    <AuthLayout
      title={sent ? 'Check your inbox' : 'Reset your password'}
      subtitle={
      sent ?
      `We sent a secure reset link to ${email}. It expires in 30 minutes.` :
      'We’ll email you a single-use link to set a new password.'
      }
      footer={
      <Link to="/login" className="inline-flex items-center gap-1.5 font-semibold text-primary hover:underline">
          <ArrowLeftIcon className="h-3.5 w-3.5" />
          Back to sign in
        </Link>
      }>
      
      {sent ?
      <div className="space-y-6">
          <div className="flex items-start gap-3 rounded-2xl bg-success-50 p-4">
            <CheckCircle2Icon className="mt-0.5 h-5 w-5 shrink-0 text-success" />
            <p className="text-[13px] leading-relaxed text-success-600">
              Reset link sent. If it doesn’t arrive within 5 minutes, check your spam folder or contact your workspace
              administrator.
            </p>
          </div>
          <Button variant="outline" fullWidth onClick={() => setSent(false)}>
            Use a different email
          </Button>
        </div> :

      <form onSubmit={submit} noValidate className="space-y-5">
          <TextField
          label="Work email"
          type="email"
          icon={MailIcon}
          value={email}
          error={error}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com" />
        
          <Button type="submit" size="lg" fullWidth loading={loading} icon={SendIcon}>
            {loading ? 'Sending link…' : 'Send reset link'}
          </Button>
        </form>
      }
    </AuthLayout>);

}