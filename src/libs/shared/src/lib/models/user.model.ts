import { Company } from "./company.model";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: Company | null;
  password?: string;
  confirmPassword?: string;
  registerToken?: string;
  createdAt?: Date;
}
