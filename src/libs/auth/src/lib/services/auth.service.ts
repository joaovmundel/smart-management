import { Injectable } from '@angular/core';

export interface StoredAccount {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  DEFAULT_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30"
  accountsStorage: StoredAccount[] = JSON.parse(localStorage.getItem("accounts") || '[]');

  login(email: string, password: string): void {
    this.accountsStorage.forEach(account => {
      if (account.email === email && account.password === password) {
        localStorage.setItem("token", this.DEFAULT_TOKEN)
        return;
      }
    })
    throw Error("Credenciais inválidas.")
  }

}
