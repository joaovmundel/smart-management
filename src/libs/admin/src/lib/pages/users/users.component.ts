import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { mockedUsers } from '@smart-management/shared';

@Component({
  selector: 'lib-admin-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTooltipModule,
  ],
})
export class UsersComponent {
  private readonly _router: Router = inject(Router);
  users = mockedUsers;

  displayedColumns = [
    'id',
    'nome',
    'telefone',
    'email',
    'empresa',
    'criadoEm',
    'tokenRegistro',
    'actions',
  ];

  redirectToCreateUser() {
    this._router.navigate(['/admin/users/create']);
  }

  editUser(user: unknown) {
    // Lógica para editar usuário
  }

  deleteUser(user: unknown) {
    // Lógica para deletar usuário
  }
}
