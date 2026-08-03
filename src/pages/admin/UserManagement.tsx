import React, { useMemo, useState } from 'react';
import { MailIcon, MoreHorizontalIcon, ShieldAlertIcon, UserPlusIcon } from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { SearchInput } from '../../components/ui/SearchInput';
import { TextField } from '../../components/ui/TextField';
import { EmptyState } from '../../components/ui/EmptyState';
import { managedUsers, ManagedUser } from '../../data/admin';
import { useApp } from '../../contexts/AppContext';

const STATUS_TONE = {
  active: 'success',
  invited: 'secondary',
  suspended: 'danger'
} as const;

export function UserManagement() {
  const { pushToast } = useApp();
  const [users, setUsers] = useState<ManagedUser[]>(managedUsers);
  const [query, setQuery] = useState('');
  const [role, setRole] = useState<'all' | ManagedUser['role']>('all');
  const [invite, setInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [pendingSuspend, setPendingSuspend] = useState<ManagedUser | null>(null);

  const results = useMemo(
    () =>
    users.filter(
      (u) =>
      (role === 'all' || u.role === role) && (
      !query ||
      u.name.toLowerCase().includes(query.toLowerCase()) ||
      u.email.toLowerCase().includes(query.toLowerCase()))
    ),
    [users, query, role]
  );

  return (
    <div>
      <PageHeader
        title="User Management"
        subtitle={`${users.length} people have access to the character studio.`}
        crumbs={[{ label: 'Admin' }, { label: 'User Management' }]}
        actions={
        <Button icon={UserPlusIcon} onClick={() => setInvite(true)}>
            Invite user
          </Button>
        } />
      

      <GlassCard className="mb-6" padded={false}>
        <div className="flex flex-col gap-4 p-4 md:flex-row md:items-center">
          <SearchInput value={query} onChange={setQuery} placeholder="Search people…" ariaLabel="Search users" className="md:w-80" />
          <select
            aria-label="Filter by role"
            value={role}
            onChange={(e) => setRole(e.target.value as typeof role)}
            className="h-10 rounded-xl border border-slate-200 bg-white/80 px-3 text-[13px] text-slate-700 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100">
            
            <option value="all">All roles</option>
            <option value="Designer">Designer</option>
            <option value="Reviewer">Reviewer</option>
            <option value="Admin">Admin</option>
          </select>
          <span className="ml-auto text-[12px] text-slate-500">{results.length} shown</span>
        </div>
      </GlassCard>

      <GlassCard padded={false} className="overflow-hidden">
        {results.length === 0 ?
        <EmptyState title="No users found" description="Adjust your search or invite someone new to the workspace." /> :

        <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200/80 bg-white/50 text-[11px] uppercase tracking-wider text-slate-500">
              <tr>
                <th scope="col" className="px-6 py-3 font-semibold">Person</th>
                <th scope="col" className="px-6 py-3 font-semibold">Role</th>
                <th scope="col" className="px-6 py-3 font-semibold">Status</th>
                <th scope="col" className="px-6 py-3 font-semibold">Characters</th>
                <th scope="col" className="px-6 py-3 font-semibold">Last active</th>
                <th scope="col" className="px-6 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {results.map((user) =>
            <tr key={user.id} className="border-b border-slate-100 last:border-0 hover:bg-white/70">
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary-50 text-[12px] font-semibold text-primary">
                        {user.name.
                    split(' ').
                    map((p) => p[0]).
                    join('')}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-slate-800">{user.name}</p>
                        <p className="truncate text-[12px] text-slate-400">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3.5">
                    <select
                  aria-label={`Role for ${user.name}`}
                  value={user.role}
                  onChange={(e) => {
                    const next = e.target.value as ManagedUser['role'];
                    setUsers((prev) => prev.map((u) => u.id === user.id ? { ...u, role: next } : u));
                    pushToast({ tone: 'info', title: 'Role updated', description: `${user.name} is now ${next}.` });
                  }}
                  className="h-9 rounded-lg border border-slate-200 bg-white/80 px-2 text-[13px] text-slate-700 focus:border-primary-300 focus:outline-none">
                  
                      <option>Designer</option>
                      <option>Reviewer</option>
                      <option>Admin</option>
                    </select>
                  </td>
                  <td className="px-6 py-3.5">
                    <Badge tone={STATUS_TONE[user.status]}>{user.status}</Badge>
                  </td>
                  <td className="px-6 py-3.5 tabular-nums text-slate-600">{user.characters}</td>
                  <td className="px-6 py-3.5 text-slate-500">{user.lastActive}</td>
                  <td className="px-6 py-3.5">
                    <div className="flex items-center justify-end gap-2">
                      <Button size="sm" variant="outline" onClick={() => setPendingSuspend(user)}>
                        {user.status === 'suspended' ? 'Reinstate' : 'Suspend'}
                      </Button>
                      <button
                    aria-label={`More actions for ${user.name}`}
                    className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-white hover:text-slate-700">
                    
                        <MoreHorizontalIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
            )}
            </tbody>
          </table>
        }
      </GlassCard>

      <Modal
        open={invite}
        onClose={() => setInvite(false)}
        title="Invite a team member"
        description="They will receive an email with a single-use link valid for 7 days."
        icon={MailIcon}
        size="sm"
        footer={
        <>
            <Button variant="outline" onClick={() => setInvite(false)}>
              Cancel
            </Button>
            <Button
            icon={UserPlusIcon}
            onClick={() => {
              setInvite(false);
              pushToast({ tone: 'success', title: 'Invitation sent', description: inviteEmail || 'New teammate invited.' });
              setInviteEmail('');
            }}>
            
              Send invite
            </Button>
          </>
        }>
        
        <TextField
          label="Work email"
          type="email"
          icon={MailIcon}
          value={inviteEmail}
          onChange={(e) => setInviteEmail(e.target.value)}
          placeholder="name@brightplay.io"
          hint="Only company domains can be invited." />
        
      </Modal>

      <Modal
        open={!!pendingSuspend}
        onClose={() => setPendingSuspend(null)}
        title={pendingSuspend?.status === 'suspended' ? 'Reinstate access?' : 'Suspend access?'}
        description={
        pendingSuspend?.status === 'suspended' ?
        `${pendingSuspend?.name} will regain access immediately.` :
        `${pendingSuspend?.name} will be signed out and lose access until reinstated. Their characters stay in the library.`
        }
        icon={ShieldAlertIcon}
        tone={pendingSuspend?.status === 'suspended' ? 'primary' : 'danger'}
        size="sm"
        footer={
        <>
            <Button variant="outline" onClick={() => setPendingSuspend(null)}>
              Cancel
            </Button>
            <Button
            variant={pendingSuspend?.status === 'suspended' ? 'primary' : 'danger'}
            onClick={() => {
              if (pendingSuspend) {
                const next = pendingSuspend.status === 'suspended' ? 'active' : 'suspended';
                setUsers((prev) => prev.map((u) => u.id === pendingSuspend.id ? { ...u, status: next } : u));
                pushToast({
                  tone: next === 'suspended' ? 'error' : 'success',
                  title: next === 'suspended' ? 'Access suspended' : 'Access restored',
                  description: pendingSuspend.name
                });
              }
              setPendingSuspend(null);
            }}>
            
              Confirm
            </Button>
          </>
        } />
      
    </div>);

}