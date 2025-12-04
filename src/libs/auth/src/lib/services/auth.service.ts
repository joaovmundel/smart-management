import { inject, Injectable } from '@angular/core';
import { RegisterData } from '../models/auth.model';
import { User } from '@smart-management/shared';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly _router = inject(Router);
  DEFAULT_TOKEN =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30';
  accountsStorage: User[] = JSON.parse(
    localStorage.getItem('accounts') || '[]'
  );

  isRegistred(email: string): boolean {
    return this.accountsStorage.some((account) => account.email === email);
  }

  login(email: string, password: string): boolean {
    const account = this.accountsStorage.find(
      (account) => account.email === email && account.password === password
    );
    if (account) {
      localStorage.setItem('token', this.DEFAULT_TOKEN);
      return true;
    }
    throw Error('Credenciais inválidas.');
  }

  register(registerData: RegisterData): void {
    if (this.isRegistred(registerData.email)) {
      throw Error('Usuário já registrado.');
    }
    const user: User = {
      id: crypto.randomUUID().toString(),
      email: registerData.email,
      password: registerData.password,
      name: registerData.name,
      phone: '',
      role: 'USER',
      createdAt: new Date().toISOString(),
    };
    this.accountsStorage.push(user);
    localStorage.setItem('accounts', JSON.stringify(this.accountsStorage));
  }

  logout(): void {
    localStorage.removeItem('token');
    this._router.navigate(['/login']);
  }
}
