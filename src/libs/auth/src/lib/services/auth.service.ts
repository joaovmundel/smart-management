import { HttpClient } from '@angular/common/http';
import {
  LoginData,
  RecoverPassCodeData,
  RecoverPasswordData,
  RegisterData,
} from '../models/auth.model';
import { Injectable, Inject } from '@angular/core';
import { AUTH_CONFIG, AuthConfig } from '../configs/auth-config.token';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    @Inject(AUTH_CONFIG) private config: AuthConfig,
    private http: HttpClient
  ) {}

  register(data: RegisterData) {
    return this.http.post(`${this.config.apiUrl}/register`, data);
  }

  login(data: LoginData) {
    return this.http.post(`${this.config.apiUrl}/login`, data);
  }

  sendRecoverPassCode(data: RecoverPassCodeData) {
    return this.http.post(`${this.config.apiUrl}/send-recover-pass-code`, data);
  }

  recoverPassword(data: RecoverPasswordData) {
    return this.http.post(`${this.config.apiUrl}/recover-password`, data);
  }
}
