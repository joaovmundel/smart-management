import { Route } from '@angular/router';
import { LayoutComponent } from '@smart-management/layout';
import { adminGuard, authGuard } from '@smart-management/shared';

export const appRoutes: Route[] = [
  {
    path: 'register',
    loadComponent: () =>
      import('@smart-management/auth').then((m) => m.RegisterComponent),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('@smart-management/auth').then((m) => m.LoginComponent),
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('@smart-management/auth').then((m) => m.ForgotPasswordComponent),
  },
  {
    path: 'recover-password',
    loadComponent: () =>
      import('@smart-management/auth').then((m) => m.RecoverPasswordComponent),
  },
  {
    path: 'reset-password',
    loadComponent: () =>
      import('@smart-management/auth').then((m) => m.SetPasswordComponent),
  },
  {
    path: 'logout',
    loadComponent: () =>
      import('@smart-management/auth').then((m) => m.LogoutComponent),
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('@smart-management/stock').then((m) => m.SalesDashboardComponent),
      },
      {
        path: 'admin/tokens',
        canActivate: [adminGuard],
        loadComponent: () =>
          import('@smart-management/admin').then((m) => m.TokensComponent),
      },
      {
        path: 'admin/companies',
        canActivate: [adminGuard],
        loadComponent: () =>
          import('@smart-management/admin').then((m) => m.CompanyComponent),
      },
      {
        path: 'admin/companies/create',
        canActivate: [adminGuard],
        loadComponent: () =>
          import('@smart-management/admin').then((m) => m.CompanyFormComponent),
      },
      {
        path: 'admin/companies/edit/:id',
        canActivate: [adminGuard],
        loadComponent: () =>
          import('@smart-management/admin').then((m) => m.CompanyFormComponent),
      },
      {
        path: 'admin/companies/:id',
        canActivate: [adminGuard],
        loadComponent: () =>
          import('@smart-management/admin').then(
            (m) => m.CompanyDetailsComponent
          ),
      },
      {
        path: 'admin/users',
        canActivate: [adminGuard],
        loadComponent: () =>
          import('@smart-management/admin').then((m) => m.UsersComponent),
      },
      {
        path: 'admin/users/create',
        canActivate: [adminGuard],
        loadComponent: () =>
          import('@smart-management/admin').then((m) => m.UserFormComponent),
      },
      {
        path: 'admin/users/edit/:id',
        canActivate: [adminGuard],
        loadComponent: () =>
          import('@smart-management/admin').then((m) => m.UserFormComponent),
      },
      {
        path: 'products',
        loadComponent: () =>
          import('@smart-management/stock').then((m) => m.ProductListComponent),
      },
      {
        path: 'products/new',
        loadComponent: () =>
          import('@smart-management/stock').then((m) => m.ProductFormPageComponent),
      },
      {
        path: 'products/edit/:id',
        loadComponent: () =>
          import('@smart-management/stock').then((m) => m.ProductFormPageComponent),
      },
      {
        path: 'stock',
        loadComponent: () =>
          import('@smart-management/stock').then((m) => m.StockComponent),
      },
      {
        path: 'stock/products',
        loadComponent: () =>
          import('@smart-management/stock').then((m) => m.ProductListComponent),
      },
      {
        path: 'stock/products/new',
        loadComponent: () =>
          import('@smart-management/stock').then((m) => m.ProductFormPageComponent),
      },
      {
        path: 'stock/products/edit/:id',
        loadComponent: () =>
          import('@smart-management/stock').then((m) => m.ProductFormPageComponent),
      },
      {
        path: 'stock/create',
        loadComponent: () =>
          import('@smart-management/stock').then((m) => m.StockFormComponent),
      },
      {
        path: 'stock/edit/:id',
        loadComponent: () =>
          import('@smart-management/stock').then((m) => m.StockFormComponent),
      },
      {
        path: 'sales',
        loadComponent: () =>
          import('@smart-management/stock').then((m) => m.SalesListComponent),
      },
      {
        path: 'sales/new',
        loadComponent: () =>
          import('@smart-management/stock').then((m) => m.SalesFormComponent),
      },
      {
        path: 'sales/edit/:id',
        loadComponent: () =>
          import('@smart-management/stock').then((m) => m.SalesFormComponent),
      },
      {
        path: 'sales/dashboard',
        loadComponent: () =>
          import('@smart-management/stock').then((m) => m.SalesDashboardComponent),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('@smart-management/profile').then((m) => m.ProfilePageComponent),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '/home',
    pathMatch: 'full',
  },
];
