import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Company, empresasMock, User } from '@smart-management/shared';
import { mockedUsers } from '@smart-management/shared';
import { TitleService } from '@smart-management/layout';

@Component({
  selector: 'admin-user-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatAutocompleteModule,
  ],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
})
export class UserFormComponent implements OnInit, OnDestroy {
  private readonly _titleService = inject(TitleService);
  companies: Company[] = empresasMock;
  companyFilterCtrl: FormControl = new FormControl('');
  filteredCompanies: Company[] = this.companies.slice();
  private routeSub?: Subscription;
  userForm: FormGroup;
  hidePassword = true;
  hideConfirmPassword = true;
  loading = false;
  isEdit = false;
  userId?: string;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this._titleService.setTitle(
      this.isEdit ? 'Editar Usuário' : 'Criar Usuário'
    );
    this.userForm = this.fb.group(
      {
        nome: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', [Validators.required]],
        empresa: [null, [Validators.required]],
        password: ['', [Validators.minLength(6)]],
        confirmPassword: [''],
        tokenRegistro: [''],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  ngOnInit(): void {
    this.setupCompanySearch();
    this.routeSub = this.route.params.subscribe(
      (params: { id?: string }): void => {
        if (params['id']) {
          this.isEdit = true;
          this.userId = params['id'];
          const user: User | undefined = mockedUsers.find(
            (u: User) => u.id === this.userId
          );
          if (user) {
            this.userForm.patchValue({
              nome: user.name,
              email: user.email,
              phone: user.phone,
              companyId: user.companyId,
              tokenRegistro: user.registerToken || '',
              password: '',
              confirmPassword: '',
            });
            if (user.companyId && user.companyName) {
              this.companyFilterCtrl.setValue(user.companyName);
            }
          }
          this.userForm.get('password')?.clearValidators();
          this.userForm.get('confirmPassword')?.clearValidators();
          this.userForm.get('password')?.updateValueAndValidity();
          this.userForm.get('confirmPassword')?.updateValueAndValidity();
        }
      }
    );
  }

  private setupCompanySearch(): void {
    this.companyFilterCtrl.valueChanges.subscribe((search: string) => {
      const s = (search || '').trim().toLowerCase();
      if (!s) {
        this.filteredCompanies = this.companies.slice();
      } else {
        this.filteredCompanies = this.companies.filter((e: Company) =>
          e.name.toLowerCase().includes(s)
        );
      }
    });
  }

  passwordMatchValidator(form: FormGroup): { [key: string]: boolean } | null {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    if (password && confirmPassword && password !== confirmPassword) {
      return { passwordMismatch: true };
    }
    return null;
  }

  onCompanySelected(event: MatAutocompleteSelectedEvent): void {
    const name = event.option.value;
    const company = this.companies.find((e) => e.name === name) || null;
    this.userForm.get('company')?.setValue(company);
  }

  onCompanyBlur(): void {
    const name = this.companyFilterCtrl.value;
    const company = this.companies.find((e) => e.name === name) || null;
    this.userForm.get('company')?.setValue(company);
    if (!company) {
      this.userForm.get('company')?.setErrors({ required: true });
    }
  }

  compareCompanies(companyA: Company, companyB: Company): boolean {
    return !!companyA && !!companyB && companyA.id === companyB.id;
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const value: User = { ...this.userForm.value };
      if (!value.password) delete value.password;
      if (!value.confirmPassword) delete value.confirmPassword;
      this.loading = true;
      //TODO: Implementar a lógica
      // Aqui você faria a chamada de API para salvar/criar usuário
      setTimeout((): void => {
        this.loading = false;
        this.snackBar.open(
          this.isEdit
            ? 'Usuário atualizado com sucesso!'
            : 'Usuário criado com sucesso!',
          'Fechar',
          { duration: 3500, panelClass: 'snackbar-success' }
        );
        this.router.navigate(['/admin/users']);
      }, 1200);
    } else {
      this.userForm.markAllAsTouched();
      this.snackBar.open(
        'Preencha todos os campos obrigatórios corretamente.',
        'Fechar',
        { duration: 3500, panelClass: 'snackbar-error' }
      );
    }
  }

  onCancel(): void {
    this.router.navigate(['/admin/users']);
  }

  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }
}
