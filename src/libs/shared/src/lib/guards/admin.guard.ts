import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivateFn } from '@angular/router';
import { UserService } from '../services/user.service';

export const adminGuard: CanActivateFn = () => {
  const router = inject(Router);
  const userService = inject(UserService);

  const currentUser = userService.getCurrentUser();

  // Verifica se o usuário está autenticado
  if (!currentUser || !currentUser.id) {
    router.navigate(['/login']);
    return false;
  }

  // Verifica se o usuário tem role ADMIN
  if (currentUser.role === 'ADMIN') {
    return true;
  }

  // Usuário não é admin, redireciona para home
  router.navigate(['/home']);
  return false;
};