import { DropdownItem, NavItem } from '../models/navigation.model';

export const navbarRoutes: (NavItem | DropdownItem)[] = [
  { label: 'Inicio', route: '/home' },
  { label: 'Produtos', route: '/products' },
  {
    label: 'Estoque',
    route: '/stock',
  },
  {
    isDropdown: true,
    label: 'Vendas',
    routes: [
      { label: 'Dashboard', route: '/sales/dashboard' },
      { label: 'Listagem', route: '/sales' },
      { label: 'Nova venda', route: '/sales/new' },
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
