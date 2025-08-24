import { Empresa } from './empresa.model';

export interface User {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  empresa: Empresa | null;
  password?: string;
  confirmPassword?: string;
  tokenRegistro?: string;
  criadoEm?: Date;
}
