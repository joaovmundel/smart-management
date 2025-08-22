import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

interface Token {
  token: string;
  createdAt: Date;
}

@Component({
  selector: 'lib-tokens',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatSnackBarModule
  ],
  templateUrl: './tokens.component.html',
  styleUrls: ['./tokens.component.scss']
})
export class TokensComponent {
  tokens: Token[] = [
    { token: 'ABC123', createdAt: new Date() },
    { token: 'XYZ789', createdAt: new Date(Date.now() - 86400000) }
  ];
  displayedColumns = ['token', 'createdAt', 'actions'];

  constructor(private snackBar: MatSnackBar) {}

  copyToken(token: string) {
    navigator.clipboard.writeText(token);
    this.snackBar.open('Token copiado!', 'Fechar', { duration: 2000, panelClass: 'snackbar-success' });
  }
}
