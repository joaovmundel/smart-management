import { DropdownItem, NavItem } from '../models/navigation.model';

export const navbarRoutes: (NavItem | DropdownItem)[] = [
  { label: 'Inicio', route: '/home' },
  { label: 'Produtos', route: '/products' },
  {
    isDropdown: true,
    label: 'Estoque',
    routes: [
      { label: 'Ver Estoque', route: '/stock' },
      { label: 'Adicionar ao Estoque', route: '/stock/create' },
    ],
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
