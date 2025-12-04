import { Injectable } from '@angular/core';
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
  providedIn: 'root',
})
export class UserService {
  getCurrentUser(): User {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      return JSON.parse(userData) as User;
    }
    return {} as User;
  }
}
