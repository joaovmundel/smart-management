import { Route } from '@angular/router';
import { LayoutComponent } from '@smart-management/layout';

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
    path: 'set-password',
    loadComponent: () =>
      import('@smart-management/auth').then((m) => m.SetPasswordComponent),
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('@smart-management/home').then((m) => m.HomeComponent),
      },
      {
        path: 'admin/tokens',
        loadComponent: () =>
          import('@smart-management/admin').then((m) => m.TokensComponent),
      },
      {
        path: 'admin/users',
        loadComponent: () =>
          import('@smart-management/admin').then((m) => m.UsersComponent),
      },
      {
        path: 'admin/users/create',
        loadComponent: () =>
          import('@smart-management/admin').then((m) => m.UserFormComponent),
      },
      {
        path: 'admin/users/edit/:id',
        loadComponent: () =>
          import('@smart-management/admin').then((m) => m.UserFormComponent),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];
