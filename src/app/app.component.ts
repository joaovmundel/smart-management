import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { User } from 'src/libs/shared/src/lib/models/user.model';

@Component({
  standalone: true,
  imports: [RouterModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'smart-management';
  private isAdminRegistered = false;
  get accountsStorage(): User[] {
    return JSON.parse(localStorage.getItem('accounts') || '[]');
  }

  constructor() {
    if (!this.isAdminRegistered) {
      this.registerAdmin();
      this.isAdminRegistered = true;
    }
  }

  registerAdmin(): void {
    if (
      this.accountsStorage.some(
        (account) => account.email === 'admin@example.com'
      )
    ) {
      return;
    }
    const adminUser: User = {
      id: crypto.randomUUID(),
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'adminpassword',
      phone: '',
      role: 'ADMIN',
      createdAt: new Date().toISOString(),
    };
    const accountsStorage = this.accountsStorage;
    accountsStorage.push(adminUser);
    localStorage.setItem('accounts', JSON.stringify(accountsStorage));
  }
}
