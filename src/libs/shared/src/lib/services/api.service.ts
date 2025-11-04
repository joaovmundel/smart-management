import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface ApiConfig {
  apiUrl: string;
}

export const API_CONFIG = 'API_CONFIG';

interface RequestOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly API_BASE_URL: string;

  constructor(
    private http: HttpClient,
    @Inject(API_CONFIG) private config: ApiConfig
  ) {
    this.API_BASE_URL = config.apiUrl;
  }

  /**
   * Função base para realizar requests HTTP com gerenciamento de token JWT
   */
  private apiRequest<T>(endpoint: string, options: RequestOptions = {}): Observable<T> {
    const token = localStorage.getItem('authToken');
    
    const headers: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers
    });

    const config = {
      ...options,
      headers
    };

    const method = options.method || 'GET';
    const url = `${this.API_BASE_URL}${endpoint}`;

    let request$: Observable<T>;
    
    switch (method.toUpperCase()) {
      case 'GET':
        request$ = this.http.get<T>(url, config);
        break;
      case 'POST':
        request$ = this.http.post<T>(url, options.body, config);
        break;
      case 'PUT':
        request$ = this.http.put<T>(url, options.body, config);
        break;
      case 'DELETE':
        request$ = this.http.delete<T>(url, config);
        break;
      default:
        throw new Error(`Método HTTP não suportado: ${method}`);
    }

    return request$.pipe(
      catchError(this.handleError)
    );
  }

  /**
   * GET request
   */
  get<T>(endpoint: string): Observable<T> {
    return this.apiRequest<T>(endpoint, { method: 'GET' });
  }

  /**
   * POST request
   */
  post<T>(endpoint: string, body: unknown): Observable<T> {
    return this.apiRequest<T>(endpoint, { 
      method: 'POST', 
      body: JSON.stringify(body) 
    });
  }

  /**
   * PUT request
   */
  put<T>(endpoint: string, body: unknown): Observable<T> {
    return this.apiRequest<T>(endpoint, { 
      method: 'PUT', 
      body: JSON.stringify(body) 
    });
  }

  /**
   * DELETE request
   */
  delete<T>(endpoint: string): Observable<T> {
    return this.apiRequest<T>(endpoint, { method: 'DELETE' });
  }

  /**
   * Tratamento de erros da API
   */
  private handleError = (error: HttpErrorResponse) => {
    let errorMessage = '';

    if (error.status === 401) {
      // Token inválido ou expirado
      localStorage.removeItem('authToken');
      window.location.href = '/login';
      errorMessage = 'Sessão expirada. Faça login novamente.';
    } else if (error.status === 403) {
      // Sem permissão
      errorMessage = 'Você não tem permissão para esta ação.';
    } else if (error.status === 404) {
      // Não encontrado
      errorMessage = 'Recurso não encontrado.';
    } else if (error.status === 400) {
      // Dados inválidos
      errorMessage = error.error?.message || 'Dados inválidos fornecidos.';
    } else if (error.status === 0) {
      // Erro de rede/servidor offline
      errorMessage = 'Erro de conexão. Verifique sua internet ou se o servidor está online.';
    } else {
      // Erro genérico
      errorMessage = error.error?.message || 'Ocorreu um erro inesperado. Tente novamente.';
    }

    console.error('API Error:', error);
    return throwError(() => new Error(errorMessage));
  };

  /**
   * Verifica se o usuário está autenticado
   */
  isAuthenticated(): boolean {
    const token = localStorage.getItem('authToken');
    return !!token;
  }

  /**
   * Remove o token de autenticação
   */
  logout(): void {
    localStorage.removeItem('authToken');
  }

  /**
   * Salva o token de autenticação
   */
  setAuthToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  /**
   * Obtém o token de autenticação
   */
  getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }
}