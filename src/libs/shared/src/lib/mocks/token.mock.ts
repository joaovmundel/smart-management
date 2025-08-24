import { Token } from "../models/token.model";

export const mockedTokens: Token[] = [
  { token: 'ABC123', empresa: 'Empresa A', createdAt: new Date() },
  {
    token: 'XYZ789',
    empresa: 'Empresa B',
    createdAt: new Date(Date.now() - 86400000),
  },
];