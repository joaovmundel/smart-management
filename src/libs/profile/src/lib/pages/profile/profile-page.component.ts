import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { User } from '@smart-management/shared';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'lib-profile-page',
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
    MatCardModule,
  ],
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss'],
})
export class ProfilePageComponent implements OnInit {
  profileForm: FormGroup;
  loading = false;
  editing = false;
  user: User | null = null;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private profileService: ProfileService
  ) {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[+]?[1-9][\d]{0,15}$/)]],
    });
  }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.loading = true;
    this.profileService.getUserProfile().subscribe({
      next: (user) => {
        this.user = user;
        this.profileForm.patchValue({
          name: user.name,
          email: user.email,
          phone: user.phone,
        });
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading user profile:', error);
        this.snackBar.open('Erro ao carregar perfil do usuário', 'Fechar', {
          duration: 3000,
        });
        this.loading = false;
      }
    });
  }

  toggleEdit(): void {
    this.editing = !this.editing;
    if (!this.editing) {
      // Reset form to original values when canceling edit
      this.loadUserProfile();
    }
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      this.loading = true;
      const formData = this.profileForm.value;

      this.profileService.updateUserProfile(formData).subscribe({
        next: (updatedUser) => {
          this.user = updatedUser;
          this.loading = false;
          this.editing = false;
          this.snackBar.open('Perfil atualizado com sucesso!', 'Fechar', {
            duration: 3000,
          });
        },
        error: (error) => {
          console.error('Error updating user profile:', error);
          this.snackBar.open('Erro ao atualizar perfil', 'Fechar', {
            duration: 3000,
          });
          this.loading = false;
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.profileForm.controls).forEach(key => {
      const control = this.profileForm.get(key);
      control?.markAsTouched();
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.profileForm.get(fieldName);
    if (control?.hasError('required')) {
      return 'Este campo é obrigatório';
    }
    if (control?.hasError('email')) {
      return 'Email inválido';
    }
    if (control?.hasError('minlength')) {
      return 'Nome deve ter pelo menos 2 caracteres';
    }
    if (control?.hasError('pattern')) {
      return 'Telefone inválido';
    }
    return '';
  }
}