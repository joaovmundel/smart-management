import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivateFn } from '@angular/router';

// Função para verificar role do usuário através do token JWT
// TODO: Implementar decodificação do JWT quando disponível
function getUserRoleFromToken(): string | null {
  const token = localStorage.getItem('authToken');
  if (!token) return null;
  
  try {
    // TODO: Decodificar JWT real
    // Por enquanto, simular baseado no token
    // Em produção, usar uma biblioteca como jwt-decode
    return 'ADMIN'; // Mock para desenvolvimento
  } catch {
    return null;
  }
}

export const adminGuard: CanActivateFn = () => {
  const router = inject(Router);

  // Verifica se o usuário está autenticado
  const token = localStorage.getItem('authToken');
  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  // Verifica se o usuário tem role ADMIN
  const userRole = getUserRoleFromToken();
  if (userRole === 'ADMIN') {
    return true;
  } else {
    // Usuário não é admin, redireciona para home
    router.navigate(['/']);
    return false;
  }
};