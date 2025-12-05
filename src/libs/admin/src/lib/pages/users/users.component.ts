import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { User, UserService } from '@smart-management/shared';
import { take } from 'rxjs';
import { ConfirmationModalComponent } from '../../components/confirmation-modal/confirmation-modal.component';
import { UserDetailsModalComponent } from '../../components/user-details-modal/user-details-modal.component';

import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TitleService } from 'src/libs/layout/src/lib/services/title.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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
export class UsersComponent implements OnInit, OnChanges {
  @Input() tableOnly = false;
  @Input() companyId?: string;

  private readonly _dialog: MatDialog = inject(MatDialog);
  private readonly _router: Router = inject(Router);
  private readonly _titleService = inject(TitleService);
  private readonly _userService = inject(UserService);
  private readonly _snackbar: MatSnackBar = inject(MatSnackBar);

  users: User[] = [];
  filteredUsers: User[] = [];
  searchTerm = '';
  showRowTooltip = true;

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

  ngOnInit(): void {
    if (!this.tableOnly) {
      this._titleService.setTitle('Usuários');
    }
    this.loadUsers();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Recarrega usuários quando companyId muda
    if (changes['companyId'] && !changes['companyId'].firstChange) {
      this.loadUsers();
    }
  }

  loadUsers(): void {
    const allUsers = this._userService.listUsers();
    
    // Se companyId foi fornecido, filtrar apenas usuários dessa empresa
    if (this.companyId) {
      this.users = allUsers.filter(user => user.companyId === this.companyId);
    } else {
      this.users = allUsers;
    }
    
    this.filteredUsers = this.users;
  }

  redirectToCreateUser() {
    this._router.navigate(['/admin/users/create']);
  }

  editUser(user: User) {
    this._router.navigate(['/admin/users/edit', user.id]);
  }

  deleteUser(user: User) {
    this._dialog
      .open(ConfirmationModalComponent)
      .afterClosed()
      .pipe(take(1))
      .subscribe((confirmed) => {
        if (confirmed) {
          if (user.email === this._userService.getCurrentUser().email) {
            this._snackbar.open('Usuário não pode se deletar', 'Fechar', {
              duration: 3000,
            });
            throw new Error('Usuário não pode se deletar');
          } else {
            this._userService.deleteUser(user.id);
            this._snackbar.open('Usuário deletado com sucesso', 'Fechar', {
              duration: 3000,
            });
          }
          this.loadUsers();
        }
      });
  }

  viewUserDetails(user: User) {
    this._dialog.open(UserDetailsModalComponent, {
      width: '600px',
      maxWidth: '90vw',
      data: user,
      autoFocus: false,
      restoreFocus: false,
    });
  }

  applyFilter() {
    const term = this.searchTerm?.toLowerCase() || '';
    this.filteredUsers = this.users.filter(
      (user) =>
        user.name?.toLowerCase().includes(term) ||
        user.email?.toLowerCase().includes(term) ||
        user.phone?.toLowerCase().includes(term)
    );
  }

  clearSearch() {
    this.searchTerm = '';
    this.applyFilter();
  }

  onActionsMouseEnter() {
    this.showRowTooltip = false;
  }

  onActionsMouseLeave() {
    this.showRowTooltip = true;
  }

  formatPhone(phone: string): string {
    if (!phone) return 'Não informado';
    // Remove non-digits
    const cleaned = phone.replace(/\D/g, '');
    // Format as (XX) XXXXX-XXXX or (XX) XXXX-XXXX
    if (cleaned.length === 11) {
      return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (cleaned.length === 10) {
      return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return phone;
  }
}
