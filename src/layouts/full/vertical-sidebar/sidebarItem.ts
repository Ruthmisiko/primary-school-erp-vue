import {
  CircleIcon,
  DashboardIcon
} from 'vue-tabler-icons';

import {
  DashboardOutlined,
  FontSizeOutlined,
  SettingOutlined,
  UsergroupAddOutlined,
  LineChartOutlined,
  RadiusBottomleftOutlined,
  ControlOutlined,
  BgColorsOutlined,
  ShoppingOutlined,
  AppstoreAddOutlined,
  UnorderedListOutlined,
  UserSwitchOutlined,
  BarsOutlined, MailOutlined, SolutionOutlined
} from '@ant-design/icons-vue';

export interface menu {
  header?: string;
  title?: string;
  icon?: object;
  to?: string;
  divider?: boolean; 
  chip?: string;
  chipColor?: string;
  chipVariant?: string;
  chipIcon?: string;
  children?: menu[];
  disabled?: boolean;
  type?: string;
  subCaption?: string;
}

const sidebarItem: menu[] = [
  { header: 'Dashboard' },
  {
    title: 'Default',
    icon: DashboardIcon,
    to: '/dashboard'
  },

  { header: 'Students Management' },
  {
    title: 'Students',
    icon: UsergroupAddOutlined,
    to: '/students'
  },
  { divider: true },
  { header: 'Teachers Management' },
  {
    title: 'Teachers',
    icon:   UserSwitchOutlined,
    to: '/teachers'
  },
  { divider: true },
  { header: 'Class Management' },
  {
    title: 'Classes',
    icon: CircleIcon,
    to: '/classes'
  },
  {
    title: 'Subjects',
    icon: LineChartOutlined,
    to: '/subjects'
  },
  { divider: true },
  { header: 'Exams Management' },
  {
    title: 'Exams',
    icon: BarsOutlined,
    to: '/exams'
  },
  // {
  //   title: 'Reports',
  //   icon: BarsOutlined,
  //   to: '/reports'
  // },
  {
    title: 'Results',
    icon: SolutionOutlined,
    to: '/results'
  },
  
  { divider: true },
  { header: 'User Management' },
  {
    title: 'user',
    icon:   UserSwitchOutlined,
    to: '/users'
  },
  // {
  //   title: 'Roles',
  //   icon:   UserSwitchOutlined,
  //   to: '/roles'
  // },
  { divider: true },
  { header: 'User Profile' },
  {
    title: 'Profile',
    icon:   UserSwitchOutlined,
    to: '/profile'
  },
  // { header: 'Pages' },
  // {
  //   title: 'Authentication',
  //   icon: KeyIcon,
  //   to: '/auth',
  //   children: [
  //     {
  //       title: 'Login',
  //       icon: CircleIcon,
  //       to: '/login1'
  //     },
  //     {
  //       title: 'Register',
  //       icon: CircleIcon,
  //       to: '/register'
  //     }
  //   ]
  // },
  // {
  //   title: 'Error 404',
  //   icon: BugIcon,
  //   to: '/error'
  // },
  // { divider: true },
  // { header: 'Utilities' },
  // {
  //   title: 'Typography',
  //   icon: TypographyIcon,
  //   to: '/utils/typography'
  // },
  // {
  //   title: 'Shadows',
  //   icon: ShadowIcon,
  //   to: '/utils/shadows'
  // },
  // {
  //   title: 'Colors',
  //   icon: PaletteIcon,
  //   to: '/utils/colors'
  // },

  // {
  //   title: 'Icons',
  //   icon: WindmillIcon,
  //   to: '/forms/radio',
  //   children: [
  //     {
  //       title: 'Tabler Icons',
  //       icon: CircleIcon,
  //       to: '/icons/tabler'
  //     },
  //     {
  //       title: 'Material Icons',
  //       icon: CircleIcon,
  //       to: '/icons/material'
  //     }
  //   ]
  // },
  
 
];

export default sidebarItem;
