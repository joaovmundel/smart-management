/* eslint-disable @nx/enforce-module-boundaries */
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '@smart-management/shared';
import { Observable, throwError } from 'rxjs';
import { RegisterData } from '../models/auth.model';
import { environment } from '@smart-management/environments';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly _router = inject(Router);
  private readonly _http = inject(HttpClient);
  RECOVER_API = environment.API_URL + '/v1/recover-password';
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
      localStorage.setItem('currentUser', JSON.stringify(account));
      return true;
    }
    throw Error('Credenciais inválidas.');
  }

  register(registerData: RegisterData): void {
    if (this.isRegistred(registerData.email)) {
      throw Error('Usuário já registrado.');
    }
    const user: User = {
      id: crypto.randomUUID(),
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

  changePassword(email: string, newPassword: string, confirmPassword: string): void {
    if(newPassword !== confirmPassword) {
      throw new Error('As senhas não coincidem.');
    }
    const accountIndex = this.accountsStorage.findIndex(
      (account) => account.email === email
    );
    if (accountIndex !== -1) {
      this.accountsStorage[accountIndex].password = newPassword;
      localStorage.setItem('accounts', JSON.stringify(this.accountsStorage));
      localStorage.removeItem('resetCode');
      localStorage.removeItem('resetEmail');
    } else {
      throw new Error('Usuário não encontrado.');
    }
  }

  forgotPassword(email: string): Observable<{ code: string }> {
    const headers = {'Content-Type': 'application/json'};
    if (this.isRegistred(email)) {
      return this._http.post<{ code: string }>(this.RECOVER_API, {
        email: email,
      }, { headers });
    } else {
      return throwError(() => new Error('Email não registrado.'));
    }
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this._router.navigate(['/login']);
  }
}
