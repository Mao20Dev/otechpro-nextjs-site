import { Icon } from '@iconify/react';

import { SideNavItem } from './types';

export const SIDENAV_ITEMS: SideNavItem[] = [
  {
    title: 'Principal',
    path: '/dashboard',
    icon: <Icon icon="lucide:home" width="22" height="22"  className="text-white"/>,
  },
  {
    title: 'Alarma',
    path: '/dashboard/alarm',
    icon: <Icon icon="lucide:bell" width="22" height="22" className="text-white" />,
  },
  {
    title: 'Administración',
    path: '/dashboard/management',
    icon: <Icon icon="lucide:shield" width="22" height="22" className="text-white"/>,
    submenu: true,
    subMenuItems: [
      { title: 'Empresas', path: '/dashboard/management' },
      { title: 'Usuarios', path: '/dashboard/management/users' },
      { title: 'Agregar equipo', path: '/dashboard/management/newDevice' },
    ],
  },
  
  // {
  //   title: 'Settings',
  //   path: '/dashboard/settings',
  //   icon: <Icon icon="lucide:settings" width="22" height="22" className="text-white"/>,
  //   submenu: true,
  //   subMenuItems: [
  //     { title: 'Account', path: '/dashboard/settings/account' },
  //     { title: 'Privacy', path: '/dashboard/settings/privacy' },
  //   ],
  // },
  // {
  //   title: 'Help',
  //   path: '/dashboard/help',
  //   icon: <Icon icon="lucide:help-circle" width="22" height="22" className="text-white" />,
  // },
];