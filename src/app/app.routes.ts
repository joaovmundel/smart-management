import { Route } from '@angular/router';

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
    path: '**',
    redirectTo: 'register',
    pathMatch: 'full',
  },
];
