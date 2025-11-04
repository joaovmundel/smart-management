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
				RouterModule
			],
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.scss']
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
		this.registerForm = this.fb.group({
			name: ['', [Validators.required]],
			email: ['', [Validators.required, Validators.email]],
			password: ['', [Validators.required, Validators.minLength(6)]],
			confirmPassword: ['', [Validators.required]],
			phone: ['']
		}, { validators: this.passwordMatchValidator });
	}

	passwordMatchValidator(form: FormGroup) {
		const password = form.get('password')?.value;
		const confirm = form.get('confirmPassword')?.value;
		return password === confirm ? null : { passwordMismatch: true };
	}


			onSubmit() {
				if (this.registerForm.valid) {
					this.loading = true;
					const { name, email, password, phone } = this.registerForm.value;
					const registerData: RegisterData = { name, email, password, phone };
					this.authService.register(registerData).subscribe({
						next: () => {
							this.snackBar.open('Registro realizado com sucesso!', 'Fechar', { duration: 3500, panelClass: 'snackbar-success' });
							this.loading = false;
							this.router.navigate(['/login']);
						},
						error: (err) => {
							this.snackBar.open(err?.error?.message || 'Erro ao registrar.', 'Fechar', { duration: 4000, panelClass: 'snackbar-error' });
							this.loading = false;
						}
					});
				} else {
					this.registerForm.markAllAsTouched();
				}
			}

	goToLogin() {
		this.router.navigate(['/login']);
	}
}
