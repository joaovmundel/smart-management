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
import { TitleService } from '@smart-management/layout';
import {
  Company,
  CompanyService,
  CreateCompanyRequest,
  User,
  UserService,
} from '@smart-management/shared';
import { Subscription } from 'rxjs';

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
  private readonly _companyService = inject(CompanyService);
  private readonly _userService = inject(UserService);
  companies: CreateCompanyRequest[] = [];
  companyFilterCtrl: FormControl = new FormControl('');
  filteredCompanies: CreateCompanyRequest[] = this.companies.slice();
  private routeSub?: Subscription;
  userForm: FormGroup;
  hidePassword = true;
  hideConfirmPassword = true;
  loading = false;
  isEdit = false;
  userId?: string;
  existingUser?: User;

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
        name: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        phone: [''],
        company: [null, [Validators.required]],
        password: [''],
        confirmPassword: [''],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  // Getters para facilitar acesso aos controles no template
  get name() {
    return this.userForm.get('name');
  }

  get email() {
    return this.userForm.get('email');
  }

  get phone() {
    return this.userForm.get('phone');
  }

  get company() {
    return this.userForm.get('company');
  }

  get password() {
    return this.userForm.get('password');
  }

  get confirmPassword() {
    return this.userForm.get('confirmPassword');
  }

  ngOnInit(): void {
    this.companies = this._companyService.companyStorage;
    this.filteredCompanies = this.companies.slice();
    this.setupCompanySearch();
    this.loadUserForEdit();
    this.setupPasswordValidation();
  }

  private setupPasswordValidation(): void {
    // Configura validação de senha baseada no modo (criação/edição)
    this.route.params.subscribe((params: { id?: string }) => {
      if (params['id']) {
        // Modo edição: senha não obrigatória, mas deve ter tamanho correto se preenchida
        this.userForm.get('password')?.setValidators([
          Validators.minLength(6),
          Validators.maxLength(20),
        ]);
        this.userForm.get('confirmPassword')?.setValidators([
          Validators.minLength(6),
          Validators.maxLength(20),
        ]);
      } else {
        // Modo criação: senha obrigatória
        this.userForm.get('password')?.setValidators([
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(20),
        ]);
        this.userForm.get('confirmPassword')?.setValidators([
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(20),
        ]);
      }
      this.userForm.get('password')?.updateValueAndValidity();
      this.userForm.get('confirmPassword')?.updateValueAndValidity();
    });
  }

  loadUserForEdit(): void {
    this.routeSub = this.route.params.subscribe(
      (params: { id?: string }): void => {
        console.log(params);
        if (params['id']) {
          this.isEdit = true;
          this.userId = params['id'];
          const user: User | undefined = this._userService.getUserById(
            this.userId
          );
          if (user) {
            this.existingUser = user;
            console.log(user);
            
            // Encontrar a empresa completa pelo ID
            const userCompany = this.companies.find(c => c.id === user.companyId);
            
            this.userForm.patchValue({
              name: user.name,
              email: user.email,
              phone: user.phone,
              company: userCompany || null,
              password: '',
              confirmPassword: '',
            });
            
            // Setar o nome da empresa no campo de autocomplete
            if (userCompany) {
              this.companyFilterCtrl.setValue(userCompany.name);
            }
            
            // Formatar o telefone se existir
            if (user.phone) {
              const formattedPhone = this.formatPhone(user.phone);
              this.userForm.patchValue({ phone: formattedPhone });
            }
          }
        }
      }
    );
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirm = form.get('confirmPassword')?.value;

    // Só valida se ambos os campos tiverem valor
    if (!password && !confirm) {
      return null;
    }

    return password === confirm ? null : { passwordMismatch: true };
  }
  private setupCompanySearch(): void {
    this.companyFilterCtrl.valueChanges.subscribe((search: string) => {
      const s = (search || '').trim().toLowerCase();
      if (!s) {
        this.filteredCompanies = this.companies.slice();
      } else {
        this.filteredCompanies = this.companies.filter(
          (e: CreateCompanyRequest) => e.name.toLowerCase().includes(s)
        );
      }
    });
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
      this.loading = true;
      // Mesclar dados existentes com dados do formulário
      const user: User = this.isEdit && this.existingUser
        ? { ...this.existingUser, ...this.userForm.value }
        : { ...this.userForm.value };
      this.saveUser(user);
    } else {
      this.userForm.markAllAsTouched();
      this.snackBar.open(
        'Preencha todos os campos obrigatórios corretamente.',
        'Fechar',
        { duration: 3500, panelClass: 'snackbar-error' }
      );
    }
  }

  saveUser(user: User): void {
    try {
      if (!this.isEdit) {
        user.createdAt = new Date().toISOString();
      }
      user.companyId = this.userForm.value.company.id;
      if (this.isEdit && this.userId) {
        this._userService.updateUser({ ...user, id: this.userId! });
      } else {
        this._userService.createUser(user);
      }
      this.snackBar.open('Usuário salvo com sucesso!', 'Fechar', {
        duration: 3500,
        panelClass: 'snackbar-success',
      });
      this.router.navigate(['/admin/users']);
    } catch (error) {
      this.snackBar.open(
        `Ocorreu um erro ao salvar o usuário. ${(error as any).message}`,
        'Fechar',
        { duration: 3500, panelClass: 'snackbar-error' }
      );
    } finally {
      this.loading = false;
    }
  }

  onCancel(): void {
    this.router.navigate(['/admin/users']);
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
    this.userForm
      .get('phone')
      ?.setValue(value, { emitEvent: false });
  }

  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }
}
