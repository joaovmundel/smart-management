import { Injectable } from '@angular/core';
import { User } from '../models/user.model';

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

  updateCurrentUser(user: User): void {
    const updatedUser = this.getUserById(user.id!);
    if (updatedUser) {
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }
  }

  listUsers(): User[] {
    return this.accountsStorage;
  }

  getUserById(id: string): User | undefined {
    return this.accountsStorage.find((user) => user.id === id);
  }

  createUser(user: User): void {
    if (this.accountsStorage.some((u) => u.email === user.email)) {
      throw new Error('Esse email já está em uso.');
    } else {
      delete (user as any).company;
      user.id = crypto.randomUUID();
      const accountsStorage = this.accountsStorage;
      accountsStorage.push(user);
      localStorage.setItem('accounts', JSON.stringify(accountsStorage));
    }
  }

  updateUser(updatedUser: User): void {
    const index = this.accountsStorage.findIndex(
      (user) => user.id === updatedUser.id
    );
    if (index !== -1) {
      const accountsStorage = this.accountsStorage;
      accountsStorage[index] = updatedUser;
      localStorage.setItem('accounts', JSON.stringify(accountsStorage));
    }
  }
  deleteUser(id: string): void {
    const accountsStorage = this.accountsStorage.filter(
      (user) => user.id !== id
    );
    localStorage.setItem('accounts', JSON.stringify(accountsStorage));
  }
}
