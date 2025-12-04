import { Injectable } from '@angular/core';

export interface CreateCompanyRequest {
  id: string;
  name: string;
  email?: string;
  cnpj?: string;
  phone?: string;
  address?: string;
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
  private companyStorage: CreateCompanyRequest[] = JSON.parse(
    localStorage.getItem('companies') || '[]'
  );

  listCompanies(): CreateCompanyRequest[] {
    return this.companyStorage;
  }

  createCompany(company: CreateCompanyRequest): void {
    this.companyStorage.push(company);
    localStorage.setItem('companies', JSON.stringify(this.companyStorage));
  }

  updateCompany(index: number, updatedCompany: CreateCompanyRequest): void {
    if (this.companyStorage[index]) {
      this.companyStorage[index] = updatedCompany;
      localStorage.setItem('companies', JSON.stringify(this.companyStorage));
    }
  }

  deleteCompany(index: number): void {
    if (this.companyStorage[index]) {
      this.companyStorage.splice(index, 1);
      localStorage.setItem('companies', JSON.stringify(this.companyStorage));
    }
  }

  getCompanyById(id: string): CreateCompanyRequest | undefined {
    return this.companyStorage.find((company) => company.id === id);
  }

  existsById(id: string): boolean {
    return this.companyStorage.some((company) => company.id === id);
  }

  existsByCnpj(cnpj: string): boolean {
    return this.companyStorage.some((company) => company.cnpj === cnpj);
  }

  getCompanyByCnpj(cnpj: string): CreateCompanyRequest | undefined {
    return this.companyStorage.find((company) => company.cnpj === cnpj);
  }
}
