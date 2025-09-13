import { DropdownItem, NavItem } from '../models/navigation.model';

export const navbarRoutes: (NavItem | DropdownItem)[] = [
  { isDropdown: false, label: 'Home', route: '/home' },
  { isDropdown: false, label: 'Sobre', route: '/about' },
  { isDropdown: false, label: 'Contato', route: '/contact' },
  {
    isDropdown: true,
    label: 'Produtos',
    routes: [
      { label: 'Criar', route: '/products/create' }, //TODO: Remove this route
      { label: 'Produtos existentes', route: '/products' },
      { label: 'Categorias', route: '/categories' },
      { label: 'Cores', route: '/colors' },
      { label: 'Tamanhos', route: '/sizes' },
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
