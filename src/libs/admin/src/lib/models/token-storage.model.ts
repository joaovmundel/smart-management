export interface TokenStorage {
  token: string;
  createdAt: Date;
  companyId: string;
  companyName?: string;
}
