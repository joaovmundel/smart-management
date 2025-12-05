import { Injectable } from '@angular/core';
import { TokenStorage } from '../models/token-storage.model';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  get registrationTokenStorage(): TokenStorage[] {
    return JSON.parse(localStorage.getItem('registrationTokens') || '[]');
  }

  saveToken(tokenData: TokenStorage): void {
    const registrationTokenStorage = this.registrationTokenStorage;
    registrationTokenStorage.push(tokenData);
    localStorage.setItem(
      'registrationTokens',
      JSON.stringify(registrationTokenStorage)
    );
  }

  findToken(token: string): TokenStorage | undefined {
    return this.registrationTokenStorage.find((t) => t.token === token);
  }

  tokenExists(token: string): boolean {
    return this.registrationTokenStorage.some((t) => t.token === token);
  }

  deleteToken(token: string): void {
    const registrationTokenStorage = this.registrationTokenStorage.filter(
      (t) => t.token !== token
    );
    localStorage.setItem(
      'registrationTokens',
      JSON.stringify(registrationTokenStorage)
    );
  }
}
