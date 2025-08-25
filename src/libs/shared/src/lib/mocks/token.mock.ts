import { Token } from "../models/token.model";

export const mockedTokens: Token[] = [
  {
    token: 'ABC123',
    companyId: 'Empresa A',
    createdAt: new Date()
  },
  {
    token: 'XYZ789',
    companyId: 'Empresa B',
    createdAt: new Date(Date.now() - 86400000),
  },
];