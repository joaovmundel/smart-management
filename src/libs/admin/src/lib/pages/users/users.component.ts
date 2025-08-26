import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { mockedUsers, User } from '@smart-management/shared';
import { take } from 'rxjs';
import { ConfirmationModalComponent } from '../../components/confirmation-modal/confirmation-modal.component';

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
  ],
})
export class UsersComponent {
  private readonly _dialog: MatDialog = inject(MatDialog);
  private readonly _router: Router = inject(Router);
  users: User[] = mockedUsers;

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
}
