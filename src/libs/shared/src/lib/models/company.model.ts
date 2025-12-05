export interface Company {
  id: string;
  name: string;
  email?: string;
  cnpj?: string;
  phone?: string;
  address?: string;
  // Campos opcionais para expansão futura
  description?: string;
  logoUrl?: string;
  websiteUrl?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}