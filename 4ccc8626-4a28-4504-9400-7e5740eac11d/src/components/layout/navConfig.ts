import type { ComponentType } from 'react';
import {
  ActivityIcon,
  BoxIcon,
  CircleUserRoundIcon,
  DownloadIcon,
  FileTextIcon,
  HelpCircleIcon,
  LayoutDashboardIcon,
  LayoutTemplateIcon,
  LibraryBigIcon,
  SettingsIcon,
  ShapesIcon,
  SparklesIcon,
  UsersIcon } from
'lucide-react';
import { Role } from '../../contexts/AppContext';

export interface NavItemDef {
  label: string;
  to: string;
  icon: ComponentType<{className?: string;}>;
  badge?: string;
  end?: boolean;
}

export interface NavGroupDef {
  title: string;
  items: NavItemDef[];
}

export const designerNav: NavGroupDef[] = [
{
  title: 'Workspace',
  items: [
  { label: 'Dashboard', to: '/app/dashboard', icon: LayoutDashboardIcon },
  { label: 'Create Character', to: '/app/create', icon: SparklesIcon },
  { label: 'Character Library', to: '/app/library', icon: LibraryBigIcon, badge: '8' }]

},
{
  title: 'Preview',
  items: [
  { label: '2D Viewer', to: '/app/viewer?view=2d', icon: ShapesIcon },
  { label: '3D Viewer', to: '/app/viewer?view=3d', icon: BoxIcon },
  { label: 'Export', to: '/app/export', icon: DownloadIcon }]

},
{
  title: 'Account',
  items: [
  { label: 'Profile', to: '/app/profile', icon: CircleUserRoundIcon },
  { label: 'Settings', to: '/app/settings', icon: SettingsIcon },
  { label: 'Help', to: '/app/help', icon: HelpCircleIcon }]

}];


export const adminNav: NavGroupDef[] = [
{
  title: 'Overview',
  items: [
  { label: 'Dashboard Analytics', to: '/admin/dashboard', icon: LayoutDashboardIcon },
  { label: 'Reports', to: '/admin/reports', icon: FileTextIcon }]

},
{
  title: 'Governance',
  items: [
  { label: 'User Management', to: '/admin/users', icon: UsersIcon, badge: '6' },
  { label: 'Character Templates', to: '/admin/templates', icon: LayoutTemplateIcon },
  { label: 'Activity Logs', to: '/admin/logs', icon: ActivityIcon }]

},
{
  title: 'Account',
  items: [
  { label: 'Settings', to: '/admin/settings', icon: SettingsIcon },
  { label: 'Help', to: '/app/help', icon: HelpCircleIcon }]

}];


export function navForRole(role: Role): NavGroupDef[] {
  return role === 'admin' ? adminNav : designerNav;
}

export interface QuickTab {
  label: string;
  to: string;
  icon: ComponentType<{className?: string;}>;
}

export const designerQuickTabs: QuickTab[] = [
{ label: 'Dashboard', to: '/app/dashboard', icon: LayoutDashboardIcon },
{ label: 'Create', to: '/app/create', icon: SparklesIcon },
{ label: 'Library', to: '/app/library', icon: LibraryBigIcon },
{ label: 'Viewer', to: '/app/viewer', icon: BoxIcon },
{ label: 'Export', to: '/app/export', icon: DownloadIcon }];


export const adminQuickTabs: QuickTab[] = [
{ label: 'Analytics', to: '/admin/dashboard', icon: LayoutDashboardIcon },
{ label: 'Users', to: '/admin/users', icon: UsersIcon },
{ label: 'Templates', to: '/admin/templates', icon: LayoutTemplateIcon },
{ label: 'Reports', to: '/admin/reports', icon: FileTextIcon },
{ label: 'Logs', to: '/admin/logs', icon: ActivityIcon }];