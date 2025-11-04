import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiService } from '@smart-management/shared';
import {
  LoginData,
  RecoverPassCodeData,
  RecoverPasswordData,
  RegisterData,
  ILoginResponse,
} from '../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private apiService: ApiService
  ) {}

  /**
   * Registra um novo usuário
   */
  register(data: RegisterData): Observable<unknown> {
    return this.apiService.post('/auth/register', data);
  }

  /**
   * Realiza login e armazena o token JWT
   */
  login(data: LoginData): Observable<ILoginResponse> {
    return this.apiService.post<ILoginResponse>('/auth/login', data).pipe(
      tap((response: ILoginResponse) => {
        if (response.token) {
          this.apiService.setAuthToken(response.token);
        }
      })
    );
  }

  /**
   * Envia código de recuperação de senha
   */
  sendRecoverPassCode(data: RecoverPassCodeData): Observable<unknown> {
    return this.apiService.post('/auth/send-recover-pass-code', data);
  }

  /**
   * Recupera a senha usando o código
   */
  recoverPassword(data: RecoverPasswordData): Observable<unknown> {
    return this.apiService.post('/auth/recover-password', data);
  }

  /**
   * Faz logout removendo o token
   */
  logout(): void {
    this.apiService.logout();
  }

  /**
   * Verifica se o usuário está autenticado
   */
  isAuthenticated(): boolean {
    return this.apiService.isAuthenticated();
  }

  /**
   * Obtém o token atual
   */
  getToken(): string | null {
    return this.apiService.getAuthToken();
  }
}
