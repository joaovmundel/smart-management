import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { TitleService } from '@smart-management/layout';
import { Token } from '@smart-management/shared';
import { Subject, takeUntil } from 'rxjs';
import { ConfirmationModalComponent } from '../../components/confirmation-modal/confirmation-modal.component';
import { TokenCreationComponent } from '../../components/token-creation/token-creation.component';
import { TokenService } from '../../services/token.service';
import { TokenStorage } from '../../models/token-storage.model';

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
export class TokensComponent implements OnInit, OnDestroy {
  private tokenService = inject(TokenService);
  private dialog = inject(MatDialog);
  private destroy$ = new Subject<void>();
  private readonly _titleService = inject(TitleService);

  tokens: Token[] = [];
  displayedColumns = ['token', 'empresa', 'createdAt', 'actions'];

  constructor(private snackBar: MatSnackBar) {
    this._titleService.setTitle('Tokens');
  }

  ngOnInit(): void {
    this.loadTokens();
  }

  loadTokens(): void {
    this.tokens = this.tokenService.registrationTokenStorage;
  }

  copyToken(token: string): void {
    navigator.clipboard.writeText(token);
    this.snackBar.open('Token copiado!', 'Fechar', {
      duration: 2000,
      panelClass: 'snackbar-success',
    });
  }

  openTokenCreationModal(): void {
    this.dialog
      .open(TokenCreationComponent)
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        if (result?.created) {
          const createdToken: TokenStorage = {
            token: result.token,
            createdAt: new Date(),
            companyId: result.company.id,
            companyName: result.company.name,
          };
          this.tokenService.saveToken(createdToken);
          this.loadTokens();
          this.snackBar.open('Token criado!', 'Fechar', {
            duration: 2000,
            panelClass: 'snackbar-success',
          });
        }
      });
  }

  deleteToken(token: Token): void {
    this.dialog
      .open(ConfirmationModalComponent)
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((confirmed) => {
        if (confirmed) {
          this.tokenService.deleteToken(token.token);
          this.loadTokens();
          this.snackBar.open('Token deletado!', 'Fechar', {
            duration: 2000,
            panelClass: 'snackbar-success',
          });
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
