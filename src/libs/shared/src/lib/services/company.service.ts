import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Company } from '../models/company.model';

export interface CreateCompanyRequest {
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
  providedIn: 'root'
})
export class CompanyService {

  constructor(private apiService: ApiService) {}

  /**
   * Listar todas as empresas
   */
  getCompanies(): Observable<Company[]> {
    return this.apiService.get<Company[]>('/companies');
  }

  /**
   * Obter empresa por ID
   */
  getCompany(id: number): Observable<Company> {
    return this.apiService.get<Company>(`/companies/${id}`);
  }

  /**
   * Criar nova empresa
   */
  createCompany(companyData: CreateCompanyRequest): Observable<Company> {
    return this.apiService.post<Company>('/companies', companyData);
  }

  /**
   * Atualizar empresa
   */
  updateCompany(id: number, companyData: UpdateCompanyRequest): Observable<Company> {
    return this.apiService.put<Company>(`/companies/${id}`, companyData);
  }

  /**
   * Deletar empresa
   */
  deleteCompany(id: number): Observable<void> {
    return this.apiService.delete<void>(`/companies/${id}`);
  }
}