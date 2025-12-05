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
  private get accountsStorage(): User[] {
    return JSON.parse(localStorage.getItem('accounts') || '[]');
  }

  getCurrentUser(): User {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      return JSON.parse(userData) as User;
    }
    return {} as User;
  }

  listUsers(): User[] {
    return this.accountsStorage;
  }

  getUserById(id: string): User | undefined {
    return this.accountsStorage.find((user) => user.id === id);
  }

  createUser(user: User): void {
    this.accountsStorage.push(user);
    localStorage.setItem('accounts', JSON.stringify(this.accountsStorage));
  }

  updateUser(updatedUser: User): void {
    const index = this.accountsStorage.findIndex(
      (user) => user.id === updatedUser.id
    );
    if (index !== -1) {
      this.accountsStorage[index] = updatedUser;
      localStorage.setItem('accounts', JSON.stringify(this.accountsStorage));
    }
  }
  deleteUser(id: string): void {
    const accountsStorage = this.accountsStorage.filter(
      (user) => user.id !== id
    );
    localStorage.setItem('accounts', JSON.stringify(accountsStorage));
  }
}
