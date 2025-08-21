import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'lib-recover-password',
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
  templateUrl: './recover-password.component.html',
  styleUrls: ['./recover-password.component.scss']
})
export class RecoverPasswordComponent {
  codeControls: FormControl[] = [];
  loading = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    for (let i = 0; i < 6; i++) {
      this.codeControls.push(new FormControl('', [Validators.required, Validators.pattern(/^[0-9a-zA-Z]$/)]));
    }
  }

  onCodeInput(event: any, idx: number) {
    const input = event.target;
    const value = input.value;
    if (value.length > 1) {
      input.value = value.charAt(0);
      this.codeControls[idx].setValue(value.charAt(0));
    }
    if (value && idx < 5) {
      const next = document.querySelectorAll('.code-box')[idx + 1] as HTMLInputElement;
      if (next) next.focus();
    }
  }

  onCodeKeydown(event: KeyboardEvent, idx: number) {
    if (event.key === 'Backspace' && !this.codeControls[idx].value && idx > 0) {
      const prev = document.querySelectorAll('.code-box')[idx - 1] as HTMLInputElement;
      if (prev) prev.focus();
    }
  }

  onSubmit() {
    if (this.codeControls.every(ctrl => ctrl.valid && ctrl.value)) {
      this.loading = true;
      const code = this.codeControls.map(ctrl => ctrl.value).join('');
      // Aqui você pode chamar o AuthService para verificar o código, ou emitir um evento, conforme a lógica desejada
      // Exemplo de feedback:
      this.snackBar.open('Código enviado: ' + code, 'Fechar', { duration: 3500, panelClass: 'snackbar-success' });
      this.loading = false;
      // Redirecionar ou avançar para próxima etapa se necessário
    } else {
      this.codeControls.forEach(ctrl => ctrl.markAsTouched());
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
