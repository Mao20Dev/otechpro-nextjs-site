import { Icon } from '@iconify/react';

import { SideNavItem } from './types';

export const SIDENAV_ITEMS: SideNavItem[] = [
  {
    title: 'Home',
    path: '/dashboard',
    icon: <Icon icon="lucide:home" width="22" height="22"  className="text-white"/>,
  },
  {
    title: 'Projects',
    path: '/dashboard/projects',
    icon: <Icon icon="lucide:folder" width="22" height="22" className="text-white"/>,
    submenu: true,
    subMenuItems: [
      { title: 'All', path: '/dashboard/projects' },
      { title: 'Web Design', path: '/dashboard/projects/web-design' },
      { title: 'Graphic Design', path: '/dashboard/projects/graphic-design' },
    ],
  },
  {
    title: 'Messages',
    path: '/dashboard/messages',
    icon: <Icon icon="lucide:mail" width="22" height="22" className="text-white" />,
  },
  {
    title: 'Settings',
    path: '/dashboard/settings',
    icon: <Icon icon="lucide:settings" width="22" height="22" className="text-white"/>,
    submenu: true,
    subMenuItems: [
      { title: 'Account', path: '/dashboard/settings/account' },
      { title: 'Privacy', path: '/dashboard/settings/privacy' },
    ],
  },
  {
    title: 'Help',
    path: '/dashboard/help',
    icon: <Icon icon="lucide:help-circle" width="22" height="22" className="text-white" />,
  },
];