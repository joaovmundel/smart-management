export type UserRole = 'USER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  createdAt: string;
  company?: {
    id: number;
    name: string;
  } | null;
  photo?: string;
  // Campos apenas para frontend (formulários)
  password?: string;
  confirmPassword?: string;
  registerToken?: string;
}
