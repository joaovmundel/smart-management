import { Injectable } from '@angular/core';
import { Company } from '../models/company.model';

export interface CreateCompanyRequest extends Company {
  id: string;
  name: string;
  cnpj: string;
  email: string;
  phone: string;
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

export interface UpdateCompanyRequest {
  name?: string;
  email?: string;
  cnpj?: string;
  phone?: string;
  address?: string;
}

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  get companyStorage(): CreateCompanyRequest[] {
    return JSON.parse(localStorage.getItem('companies') || '[]');
  }

  createCompany(company: CreateCompanyRequest): void {
    const companies = this.companyStorage;
    if (this.existsByCnpj(company.cnpj)) {
      throw new Error('CNPJ já cadastrado.');
    } else {
      company.id = crypto.randomUUID();
      companies.push(company);
      localStorage.setItem('companies', JSON.stringify(companies));
    }
  }

  updateCompany(index: number, updatedCompany: CreateCompanyRequest): void {
    if (this.existsByCnpjExcludingId(updatedCompany.cnpj, updatedCompany.id)) {
      throw new Error('CNPJ já cadastrado.');
    } else {
      if (this.companyStorage[index]) {
        const companies = this.companyStorage;
        companies[index] = updatedCompany;
        localStorage.setItem('companies', JSON.stringify(companies));
      }
    }
  }

  deleteCompany(index: number): void {
    if (this.companyStorage[index]) {
      this.companyStorage.splice(index, 1);
      localStorage.setItem('companies', JSON.stringify(this.companyStorage));
    }
  }

  getCompanyById(id: string): Company | undefined {
    return this.companyStorage.find((company) => company.id === id);
  }

  existsById(id: string): boolean {
    return this.companyStorage.some((company) => company.id === id);
  }

  existsByCnpj(cnpj: string): boolean {
    return this.companyStorage.some((company) => company.cnpj === cnpj);
  }

  existsByCnpjExcludingId(cnpj: string, excludeId: string): boolean {
    return this.companyStorage.some(
      (company) => company.cnpj === cnpj && company.id !== excludeId
    );
  }

  getCompanyByCnpj(cnpj: string): CreateCompanyRequest | undefined {
    return this.companyStorage.find((company) => company.cnpj === cnpj);
  }
}
