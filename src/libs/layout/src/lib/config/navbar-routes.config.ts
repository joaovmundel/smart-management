import { DropdownItem, NavItem } from '../models/navigation.model';

export const navbarRoutes: (NavItem | DropdownItem)[] = [
  { isDropdown: false, label: 'Inicio', route: '/home' },
  {
    isDropdown: false,
    label: 'Produtos',
    route: '/products',
  },
  {
    isDropdown: true,
    label: 'Admin',
    routes: [
      { label: 'Tokens', route: '/admin/tokens' },
      { label: 'Usuários', route: '/admin/users' },
      { label: 'Empresas', route: '/admin/companies' },
    ],
  },
];
