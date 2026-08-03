export interface ManagedUser {
  id: string;
  name: string;
  email: string;
  role: 'Designer' | 'Reviewer' | 'Admin';
  status: 'active' | 'invited' | 'suspended';
  characters: number;
  lastActive: string;
}

export const managedUsers: ManagedUser[] = [
{
  id: 'usr-01',
  name: 'Aisha Rahman',
  email: 'aisha@brightplay.io',
  role: 'Designer',
  status: 'active',
  characters: 34,
  lastActive: '2 minutes ago'
},
{
  id: 'usr-02',
  name: 'Daniel Okafor',
  email: 'daniel@brightplay.io',
  role: 'Designer',
  status: 'active',
  characters: 21,
  lastActive: '1 hour ago'
},
{
  id: 'usr-03',
  name: 'Lena Fischer',
  email: 'lena@brightplay.io',
  role: 'Reviewer',
  status: 'active',
  characters: 12,
  lastActive: 'Yesterday'
},
{
  id: 'usr-04',
  name: 'Marcus Lee',
  email: 'marcus@brightplay.io',
  role: 'Admin',
  status: 'active',
  characters: 4,
  lastActive: '3 hours ago'
},
{
  id: 'usr-05',
  name: 'Priya Nair',
  email: 'priya@brightplay.io',
  role: 'Designer',
  status: 'invited',
  characters: 0,
  lastActive: 'Never'
},
{
  id: 'usr-06',
  name: 'Tom Bergström',
  email: 'tom@brightplay.io',
  role: 'Designer',
  status: 'suspended',
  characters: 9,
  lastActive: '3 weeks ago'
}];


export interface TemplateItem {
  id: string;
  name: string;
  category: 'Animal' | 'Plant' | 'Human';
  usage: number;
  owner: string;
  updated: string;
  status: 'live' | 'archived';
}

export const templates: TemplateItem[] = [
{ id: 'tpl-1', name: 'Friendly Forest Animal', category: 'Animal', usage: 128, owner: 'Design Ops', updated: '2026-07-22', status: 'live' },
{ id: 'tpl-2', name: 'Sprout Starter', category: 'Plant', usage: 76, owner: 'Design Ops', updated: '2026-07-14', status: 'live' },
{ id: 'tpl-3', name: 'Classroom Kid', category: 'Human', usage: 204, owner: 'Curriculum', updated: '2026-06-30', status: 'live' },
{ id: 'tpl-4', name: 'Ocean Buddy', category: 'Animal', usage: 51, owner: 'Design Ops', updated: '2026-06-11', status: 'live' },
{ id: 'tpl-5', name: 'Legacy Mascot v1', category: 'Human', usage: 3, owner: 'Archive', updated: '2025-11-02', status: 'archived' }];


export interface ActivityLog {
  id: string;
  actor: string;
  action: string;
  target: string;
  severity: 'info' | 'warning' | 'critical';
  time: string;
}

export const activityLogs: ActivityLog[] = [
{ id: 'log-1', actor: 'Aisha Rahman', action: 'Published character', target: 'Milo the Fox', severity: 'info', time: '2026-08-02 09:41' },
{ id: 'log-2', actor: 'System', action: 'Export job completed', target: 'milo-fox.png (2048px)', severity: 'info', time: '2026-08-02 09:38' },
{ id: 'log-3', actor: 'Tom Bergström', action: 'Failed sign-in attempt', target: '3 attempts', severity: 'warning', time: '2026-08-02 08:12' },
{ id: 'log-4', actor: 'Marcus Lee', action: 'Changed user role', target: 'Lena Fischer → Reviewer', severity: 'critical', time: '2026-08-01 17:20' },
{ id: 'log-5', actor: 'Daniel Okafor', action: 'Deleted draft', target: 'Untitled character', severity: 'warning', time: '2026-08-01 15:02' },
{ id: 'log-6', actor: 'Lena Fischer', action: 'Approved review', target: 'Pip the Bunny', severity: 'info', time: '2026-08-01 11:47' },
{ id: 'log-7', actor: 'System', action: 'Nightly backup', target: 'character-library', severity: 'info', time: '2026-08-01 02:00' }];


export const weeklyActivity = [
{ day: 'Mon', created: 12, exported: 8, reviewed: 5 },
{ day: 'Tue', created: 18, exported: 14, reviewed: 9 },
{ day: 'Wed', created: 9, exported: 11, reviewed: 7 },
{ day: 'Thu', created: 22, exported: 19, reviewed: 12 },
{ day: 'Fri', created: 27, exported: 24, reviewed: 15 },
{ day: 'Sat', created: 8, exported: 6, reviewed: 3 },
{ day: 'Sun', created: 5, exported: 4, reviewed: 2 }];


export const typeDistribution = [
{ name: 'Animal', value: 46, color: '#4F46E5' },
{ name: 'Human', value: 32, color: '#06B6D4' },
{ name: 'Plant', value: 22, color: '#F59E0B' }];


export const exportTrend = [
{ month: 'Feb', png: 120, svg: 45, jpg: 30 },
{ month: 'Mar', png: 168, svg: 62, jpg: 41 },
{ month: 'Apr', png: 190, svg: 78, jpg: 38 },
{ month: 'May', png: 240, svg: 96, jpg: 52 },
{ month: 'Jun', png: 288, svg: 118, jpg: 60 },
{ month: 'Jul', png: 342, svg: 141, jpg: 71 }];