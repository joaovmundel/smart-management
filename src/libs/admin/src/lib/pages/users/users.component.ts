import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { mockedUsers, User } from '@smart-management/shared';
import { take } from 'rxjs';
import { ConfirmationModalComponent } from '../../components/confirmation-modal/confirmation-modal.component';

import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'users-list',
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
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
})
export class UsersComponent {
  @Input() tableOnly = false;

  private readonly _dialog: MatDialog = inject(MatDialog);
  private readonly _router: Router = inject(Router);

  users: User[] = mockedUsers;
  filteredUsers: User[] = [];
  searchTerm = '';

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

  constructor() {
    this.filteredUsers = this.users;
  }

  redirectToCreateUser() {
    this._router.navigate(['/admin/users/create']);
  }

  editUser(user: User) {
    this._router.navigate(['/admin/users/edit', user.id]);
  }

  deleteUser(user: unknown) {
    //TODO: Implementar a logica real de deleção
    this._dialog.open(ConfirmationModalComponent).afterClosed().pipe(take(1)).subscribe((confirmed) => {
      if (confirmed) {
        console.log(`Estamos deletando ${user}`)
      }
    });
  }

  applyFilter() {
    const term = this.searchTerm?.toLowerCase() || '';
    this.filteredUsers = this.users.filter(user =>
      user.name?.toLowerCase().includes(term) ||
      user.email?.toLowerCase().includes(term) ||
      user.phone?.toLowerCase().includes(term)
    );
  }

  clearSearch() {
    this.searchTerm = '';
    this.applyFilter();
  }
}
