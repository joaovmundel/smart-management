import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { User } from '../models/user.model';

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: 'USER' | 'ADMIN';
  companyId?: number;
}

export interface UpdateUserRequest {
  name?: string;
  phone?: string;
  role?: 'USER' | 'ADMIN';
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private apiService: ApiService) {}

  /**
   * Listar todos os usuários
   */
  getUsers(): Observable<User[]> {
    return this.apiService.get<User[]>('/users');
  }

  /**
   * Obter usuário por ID
   */
  getUser(id: number): Observable<User> {
    return this.apiService.get<User>(`/users/${id}`);
  }

  /**
   * Criar novo usuário
   */
  createUser(userData: CreateUserRequest, companyId?: number): Observable<User> {
    const url = companyId ? `/users?companyId=${companyId}` : '/users';
    return this.apiService.post<User>(url, userData);
  }

  /**
   * Atualizar usuário
   */
  updateUser(id: number, userData: UpdateUserRequest): Observable<User> {
    return this.apiService.put<User>(`/users/${id}`, userData);
  }

  /**
   * Deletar usuário
   */
  deleteUser(id: number): Observable<void> {
    return this.apiService.delete<void>(`/users/${id}`);
  }
}