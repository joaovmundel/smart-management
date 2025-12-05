import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface ViaCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
  erro?: boolean;
}

export interface AddressData {
  address: string;
  city: string;
  state: string;
  neighborhood: string;
  zipCode: string;
  country: string;
}

@Injectable({
  providedIn: 'root',
})
export class ViaCepService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = 'https://viacep.com.br/ws';

  /**
   * Busca endereço pelo CEP na API ViaCEP
   * @param cep CEP no formato 12345678 ou 12345-678
   * @returns Observable com os dados do endereço ou null em caso de erro
   */
  getAddressByCep(cep: string): Observable<AddressData | null> {
    const cleanCep = this.cleanCep(cep);

    if (!this.isValidCep(cleanCep)) {
      return of(null);
    }

    return this.http.get<ViaCepResponse>(`${this.API_URL}/${cleanCep}/json/`).pipe(
      map((response) => {
        if (response.erro) {
          return null;
        }

        return {
          address: response.logradouro,
          city: response.localidade,
          state: response.uf,
          neighborhood: response.bairro,
          zipCode: this.formatCep(response.cep),
          country: 'Brasil',
        };
      }),
      catchError(() => of(null))
    );
  }

  /**
   * Remove caracteres não numéricos do CEP
   */
  private cleanCep(cep: string): string {
    return cep.replace(/\D/g, '');
  }

  /**
   * Valida se o CEP tem 8 dígitos
   */
  private isValidCep(cep: string): boolean {
    return /^\d{8}$/.test(cep);
  }

  /**
   * Formata o CEP para o padrão 12345-678
   */
  private formatCep(cep: string): string {
    const clean = this.cleanCep(cep);
    return clean.replace(/(\d{5})(\d{3})/, '$1-$2');
  }

  /**
   * Verifica se o CEP está completo (8 dígitos)
   */
  isCepComplete(cep: string): boolean {
    return this.cleanCep(cep).length === 8;
  }
}
