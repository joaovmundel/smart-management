import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, ElementRef, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { User } from '@smart-management/shared';
import { TitleService } from '@smart-management/layout';
import { ProfileService } from '../../services/profile.service';
import { PasswordConfirmationModalComponent } from '../../components/password-confirmation-modal/password-confirmation-modal.component';
import { take } from 'rxjs';

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
    MatDialogModule,
  ],
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss'],
})
export class ProfilePageComponent implements OnInit {
  private readonly _titleService = inject(TitleService);
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  profileForm: FormGroup;
  loading = false;
  user: User | null = null;
  hidePassword = true;
  hideConfirmPassword = true;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private profileService: ProfileService,
    private dialog: MatDialog
  ) {
    this._titleService.setTitle('Meu Perfil');
    this.profileForm = this.fb.group(
      {
        name: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        phone: [''],
        newPassword: [''],
        confirmPassword: [''],
      },
      { validators: [this.passwordMatchValidator] }
    );
  }

  ngOnInit(): void {
    this.loadUserProfile();
    this.setupPasswordValidation();
  }

  formatPhone(phone: string): string {
    let value = phone.replace(/\D/g, '');

    // Limita a 11 dígitos
    if (value.length > 11) {
      value = value.slice(0, 11);
    }

    // Aplica a formatação
    if (value.length <= 10) {
      value = value.replace(
        /(\d{2})(\d{0,4})(\d{0,4})/,
        (match, p1, p2, p3) => {
          let formatted = '';
          if (p1) formatted += `(${p1}`;
          if (p2) formatted += `) ${p2}`;
          if (p3) formatted += `-${p3}`;
          return formatted;
        }
      );
    } else {
      value = value.replace(/(\d{2})(\d{5})(\d{0,4})/, (match, p1, p2, p3) => {
        let formatted = `(${p1}) ${p2}`;
        if (p3) formatted += `-${p3}`;
        return formatted;
      });
    }

    return value;
  }

  onPhoneInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = this.formatPhone(input.value);

    input.value = value;
    this.profileForm
      .get('phone')
      ?.setValue(value, { emitEvent: false });
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
        const formattedPhone = this.formatPhone(user.phone || '');
        this.profileForm.patchValue({
          name: user.name,
          email: user.email,
          phone: formattedPhone,
        });
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading user profile:', error);
        this.snackBar.open('Erro ao carregar perfil do usuário', 'Fechar', {
          duration: 3000,
        });
        this.loading = false;
      },
    });
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      // Open password confirmation modal
      this.dialog
        .open(PasswordConfirmationModalComponent, {
          width: '450px',
          disableClose: true,
        })
        .afterClosed()
        .pipe(take(1))
        .subscribe((result) => {
          if (result?.confirmed) {
            this.updateProfile(result.password);
          }
        });
    } else {
      this.markFormGroupTouched();
    }
  }

  private updateProfile(currentPassword: string): void {
    this.loading = true;
    const formData = { ...this.profileForm.value };

    // Include photo if it was updated
    if (this.user?.photo) {
      formData.photo = this.user.photo;
    }

    // Rename newPassword to password for service
    if (formData.newPassword) {
      formData.password = formData.newPassword;
    }

    // Clean up form data
    delete formData.newPassword;

    this.profileService.updateUserProfile(formData, currentPassword).subscribe({
      next: (updatedUser) => {
        this.user = updatedUser;
        this.loading = false;
        this.profileForm.markAsPristine();
        // Clear password fields
        this.profileForm.patchValue({
          newPassword: '',
          confirmPassword: '',
        });
        this.snackBar.open('Perfil atualizado com sucesso!', 'Fechar', {
          duration: 3000,
          panelClass: 'snackbar-success',
        });
        window.location.reload();
      },
      error: (error) => {
        console.error('Error updating user profile:', error);
        this.snackBar.open(
          error.message || 'Erro ao atualizar perfil',
          'Fechar',
          {
            duration: 3000,
            panelClass: 'snackbar-error',
          }
        );
        this.loading = false;
      },
    });
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
        this.snackBar.open(
          'Por favor, selecione apenas arquivos de imagem',
          'Fechar',
          {
            duration: 3000,
            panelClass: 'snackbar-error',
          }
        );
        return;
      }

      // Validate file size (max 200KB)
      if (file.size > 200 * 1024) {
        this.snackBar.open('A imagem deve ter no máximo 200KB', 'Fechar', {
          duration: 3000,
          panelClass: 'snackbar-error',
        });
        return;
      }

      this.loading = true;
      const reader = new FileReader();
      
      reader.onload = (e) => {
        if (e.target?.result) {
          const img = new Image();
          img.onload = () => {
            // Validate dimensions (max 400x400)
            if (img.width > 400 || img.height > 400) {
              this.snackBar.open(
                'A imagem deve ter no máximo 400x400 pixels',
                'Fechar',
                {
                  duration: 3000,
                  panelClass: 'snackbar-error',
                }
              );
              this.loading = false;
              return;
            }

            // Create canvas to resize and convert to base64
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            if (!ctx) {
              this.snackBar.open('Erro ao processar imagem', 'Fechar', {
                duration: 3000,
                panelClass: 'snackbar-error',
              });
              this.loading = false;
              return;
            }

            // Set canvas size to image size (already validated)
            canvas.width = img.width;
            canvas.height = img.height;

            // Draw image on canvas
            ctx.drawImage(img, 0, 0);

            // Convert to base64
            const base64Image = canvas.toDataURL('image/jpeg', 0.9);

            // Check final size after compression
            const finalSize = Math.round((base64Image.length * 3) / 4);
            if (finalSize > 200 * 1024) {
              this.snackBar.open(
                'A imagem processada excede 200KB. Tente uma imagem menor.',
                'Fechar',
                {
                  duration: 3000,
                  panelClass: 'snackbar-error',
                }
              );
              this.loading = false;
              return;
            }

            // Update user photo
            if (this.user) {
              this.user.photo = base64Image;
              this.profileForm.markAsDirty();
              this.snackBar.open(
                'Foto atualizada! Clique em "Salvar Alterações" para confirmar.',
                'Fechar',
                {
                  duration: 3000,
                  panelClass: 'snackbar-success',
                }
              );
            }
            this.loading = false;
          };

          img.onerror = () => {
            this.snackBar.open('Erro ao carregar imagem', 'Fechar', {
              duration: 3000,
              panelClass: 'snackbar-error',
            });
            this.loading = false;
          };

          img.src = e.target.result as string;
        }
      };

      reader.onerror = () => {
        this.snackBar.open('Erro ao ler arquivo', 'Fechar', {
          duration: 3000,
          panelClass: 'snackbar-error',
        });
        this.loading = false;
      };

      reader.readAsDataURL(file);
    }
  }

  getUserPhoto(): string {
    if (this.user?.photo) {
      return this.user.photo;
    }
    // Default avatar SVG base64
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiM2MzY2ZjEiLz4KPHBhdGggZD0iTTIwIDIwQzIyLjc2MTQgMjAgMjUgMTcuNzYxNCAyNSAxNUMyNSAxMi4yMzg2IDIyLjc2MTQgMTAgMjAgMTBDMTcuMjM4NiAxMCAxNSAxMi4yMzg2IDE1IDE1QzE1IDE3Ljc2MTQgMTcuMjM4NiAyMCAyMCAyMFoiIGZpbGw9IiNmZmZmZmYiLz4KPHBhdGggZD0iTTMwIDI4QzMwIDI0LjY4NjMgMjYuNDI3MSAyMiAyMiAyMkgxOEMxMy41NzI5IDIyIDEwIDI0LjY4NjMgMTAgMjhWMzBIMzBWMjhaIiBmaWxsPSIjZmZmZmZmIi8+Cjwvc3ZnPgo=';
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiM2MzY2ZjEiLz4KPHBhdGggZD0iTTIwIDIwQzIyLjc2MTQgMjAgMjUgMTcuNzYxNCAyNSAxNUMyNSAxMi4yMzg2IDIyLjc2MTQgMTAgMjAgMTBDMTcuMjM4NiAxMCAxNSAxMi4yMzg2IDE1IDE1QzE1IDE3Ljc2MTQgMTcuMjM4NiAyMCAyMCAyMFoiIGZpbGw9IiNmZmZmZmYiLz4KPHBhdGggZD0iTTMwIDI4QzMwIDI0LjY4NjMgMjYuNDI3MSAyMiAyMiAyMkgxOEMxMy41NzI5IDIyIDEwIDI0LjY4NjMgMTAgMjhWMzBIMzBWMjhaIiBmaWxsPSIjZmZmZmZmIi8+Cjwvc3ZnPgo=';
  }

  private markFormGroupTouched(): void {
    Object.keys(this.profileForm.controls).forEach((key) => {
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

    // Validação específica para senha
    if (
      fieldName === 'confirmPassword' &&
      this.profileForm.hasError('passwordMismatch')
    ) {
      return 'As senhas não coincidem';
    }

    return '';
  }
}
