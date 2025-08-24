import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { ConfirmationModalComponent } from '../../components/confirmation-modal/confirmation-modal.component';
import { Subject, takeUntil } from 'rxjs';
import { mockedTokens, Token } from '@smart-management/shared';
import { TokenCreationComponent } from '../../components/token-creation/token-creation.component';

@Component({
  selector: 'lib-tokens',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatSnackBarModule,
  ],
  templateUrl: './tokens.component.html',
  styleUrls: ['./tokens.component.scss'],
})
export class TokensComponent implements OnDestroy {
  private dialog = inject(MatDialog);
  private destroy$ = new Subject<void>();

  tokens: Token[] = mockedTokens;
  displayedColumns = ['token', 'empresa', 'createdAt', 'actions'];

  constructor(private snackBar: MatSnackBar) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  copyToken(token: string): void {
    navigator.clipboard.writeText(token);
    this.snackBar.open('Token copiado!', 'Fechar', {
      duration: 2000,
      panelClass: 'snackbar-success',
    });
  }

  openTokenCreationModal(): void {
    this.dialog.open(TokenCreationComponent);
  }

  deleteToken(token: Token): void {
    this.dialog
      .open(ConfirmationModalComponent)
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((confirmed) => {
        if (confirmed) {
          const idx = this.tokens.findIndex((t) => t.token === token.token);
          if (idx > -1) {
            this.tokens.splice(idx, 1);
            this.snackBar.open('Token deletado!', 'Fechar', {
              duration: 2000,
              panelClass: 'snackbar-success',
            });
          }
        }
      });
  }
}
