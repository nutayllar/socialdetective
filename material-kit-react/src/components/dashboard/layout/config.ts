import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
  { key: 'overview', title: 'Overview', href: paths.dashboard.overview, icon: 'chart-pie' },
  { key: 'Cases', title: 'Cases', href: paths.dashboard.customers, icon: 'users' },
  { key: 'Social Search', title: 'Social Search', href: paths.dashboard.integrations, icon: 'plugs-connected' },
  { key: 'settings', title: 'Settings', href: paths.dashboard.settings, icon: 'gear-six' },
  { key: 'Analytics', title: 'Analytics', href: paths.dashboard.account, icon: 'user' },
] satisfies NavItemConfig[];
