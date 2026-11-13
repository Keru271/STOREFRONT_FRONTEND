export interface NavItem {
  title: string;
  href: string;
  icon?: string;
}

export const sidebarNavItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/'
  },
  {
    title: 'Customer',
    href: '/customers'
  },
  {
    title: 'Products',
    href: '/products'
  },
  {
    title: 'Orders',
    href: '/orders'
  },
  {
    title: 'Settings',
    href: '/settings'
  }
];
