import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
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
    MatTooltipModule,
  ],
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss'],
})
export class ProfilePageComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  
  profileForm: FormGroup;
  loading = false;
  user: User | null = null;
  hidePassword = true;
  hideConfirmPassword = true;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private profileService: ProfileService
  ) {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[+]?[1-9][\d]{0,15}$/)]],
      newPassword: [''],
      confirmPassword: [''],
    }, { validators: [this.passwordMatchValidator] });
  }

  ngOnInit(): void {
    this.loadUserProfile();
    this.setupPasswordValidation();
  }

  // Validador para garantir que as senhas coincidam
  passwordMatchValidator = (control: AbstractControl) => {
    const newPassword = control.get('newPassword')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    
    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      return { passwordMismatch: true };
    }
    return null;
  };

  private setupPasswordValidation(): void {
    const newPasswordControl = this.profileForm.get('newPassword');
    const confirmPasswordControl = this.profileForm.get('confirmPassword');

    newPasswordControl?.valueChanges.subscribe(() => {
      if (newPasswordControl.value) {
        confirmPasswordControl?.setValidators([Validators.required]);
      } else {
        confirmPasswordControl?.clearValidators();
      }
      confirmPasswordControl?.updateValueAndValidity();
    });
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

  onSubmit(): void {
    if (this.profileForm.valid) {
      this.loading = true;
      const formData = { ...this.profileForm.value };
      
      // Remove empty password fields
      if (!formData.newPassword) {
        delete formData.newPassword;
        delete formData.confirmPassword;
      }

      this.profileService.updateUserProfile(formData).subscribe({
        next: (updatedUser) => {
          this.user = updatedUser;
          this.loading = false;
          this.profileForm.markAsPristine();
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

  resetForm(): void {
    this.loadUserProfile();
    this.profileForm.markAsPristine();
  }

  uploadPhoto(): void {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        this.snackBar.open('Por favor, selecione apenas arquivos de imagem', 'Fechar', {
          duration: 3000,
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.snackBar.open('A imagem deve ter no máximo 5MB', 'Fechar', {
          duration: 3000,
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        if (this.user && e.target?.result) {
          this.user.photo = e.target.result as string;
          // TODO: Implementar upload real da foto
          this.snackBar.open('Foto atualizada! Clique em "Salvar Alterações" para confirmar.', 'Fechar', {
            duration: 3000,
          });
        }
      };
      reader.readAsDataURL(file);
    }
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'default-avatar.svg';
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
      const minLength = control.getError('minlength').requiredLength;
      return `Deve ter pelo menos ${minLength} caracteres`;
    }
    if (control?.hasError('pattern')) {
      return 'Telefone inválido';
    }
    
    // Validação específica para senha
    if (fieldName === 'confirmPassword' && this.profileForm.hasError('passwordMismatch')) {
      return 'As senhas não coincidem';
    }
    
    return '';
  }
}