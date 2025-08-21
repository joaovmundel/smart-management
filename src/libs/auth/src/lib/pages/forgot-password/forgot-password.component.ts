import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RecoverPassCodeData } from '../../models/auth.model';

@Component({
  selector: 'lib-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatIconModule,
    MatProgressSpinnerModule,
    RouterModule
  ],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  forgotForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.forgotForm.valid) {
      this.loading = true;
      const { email } = this.forgotForm.value;
      const data: RecoverPassCodeData = { email };
      this.authService.sendRecoverPassCode(data).subscribe({
        next: () => {
          this.snackBar.open('Código de recuperação enviado!', 'Fechar', { duration: 3500, panelClass: 'snackbar-success' });
          this.loading = false;
          // Redirecionar para página de inserir código ou informar usuário
        },
        error: (err) => {
          this.snackBar.open(err?.error?.message || 'Erro ao enviar código.', 'Fechar', { duration: 4000, panelClass: 'snackbar-error' });
          this.loading = false;
        }
      });
    } else {
      this.forgotForm.markAllAsTouched();
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
