import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    title: true,
    name: 'Menu'
  },
  {
    name: 'Home',
    url: '/home',
    icon: 'icon-home',
  },
  {
    name: 'Login',
    url: '/login',
    icon: 'icon-user'
  },
  {
    name : 'Register',
    url: '/',
    icon: 'icon-note',
    children: [
      {
        name: 'Student',
        url: '/register/student',
        icon: 'icon-graduation'
      },
      {
        name: 'Private Tutor',
        url: '/register/tutor',
        icon: 'icon-notebook'
      }
    ]
  },
  {
    name: 'FAQ',
    url: '/faq',
    icon: 'icon-info',
  },
];

export const navItemsStudent: INavData[] = [
  {
    title: true,
    name: 'Menu'
  },
  {
    name: 'Home',
    url: '/home',
    icon: 'icon-home',
  },
  {
    name: 'Search',
    url: '/search',
    icon: 'icon-magnifier',
  },
  {
    name: 'Meetings',
    url: '/meetings',
    icon: 'icon-people',
  },
  {
    name: 'FAQ',
    url: '/faq',
    icon: 'icon-info',
  },
];

export const navItemsTutor: INavData[] = [
  {
    title: true,
    name: 'Menu'
  },
  {
    name: 'Home',
    url: '/home',
    icon: 'icon-home',
  },
  {
    name: 'Meetings',
    url: '/meetings',
    icon: 'icon-people',
  },
  {
    name: 'FAQ',
    url: '/faq',
    icon: 'icon-info',
  },
];

export const navItemsAdmin: INavData[] = [
  {
    title: true,
    name: 'Admin',
  },
  {
    name: 'Home',
    url: '/home',
    icon: 'icon-home',
  },
  {
    name: 'Users',
    url: '/admin/users',
    icon: 'icon-people',
  },
  {
    name: 'Questionnaires',
    url: '/admin/questionnaires',
    icon: 'icon-note',
  },
  {
    name: 'Courses',
    url: '/admin/courses',
    icon: 'icon-book-open',
  },
  {
    name: 'Certificates',
    url: '/admin/certificates',
    icon: 'icon-badge',
  },
  {
    name: 'FAQ',
    url: '/admin/faqs',
    icon: 'icon-info',
  },
];