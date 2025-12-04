/* eslint-disable @nx/enforce-module-boundaries */

export type UserRole = 'USER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  createdAt: string;
  companyId?: string;
  companyName?: string;
  photo?: string;
  // Campos apenas para frontend (formulários)
  password?: string;
  confirmPassword?: string;
  registerToken?: string;
}
