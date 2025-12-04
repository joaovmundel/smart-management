import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RegisterData } from '../../models/auth.model';

@Component({
  selector: 'lib-auth-register',
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
    RouterModule,
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  registerForm: FormGroup;
  hidePassword = true;
  hideConfirmPassword = true;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.registerForm = this.fb.group(
      {
        name: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
        token: [''],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirm = form.get('confirmPassword')?.value;
    return password === confirm ? null : { passwordMismatch: true };
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.loading = true;
      const { name, email, password, token } = this.registerForm.value;
      try {
        this.authService.register({
          name,
          email,
          password,
          token,
        } as RegisterData);
        this.snackBar.open('Registro realizado com sucesso!', 'X', {
          duration: 3000,
        });
        this.router.navigate(['/login']);
      } catch (error) {
        console.log(error);
        this.snackBar.open(
          (error as Error).message || 'Erro ao registrar usuário.',
          'X',
          { duration: 3000 }
        );
        this.registerForm.reset();
      } finally {
        this.loading = false;
      }
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
