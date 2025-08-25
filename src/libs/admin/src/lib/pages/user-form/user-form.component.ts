import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
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

@Component({
  selector: 'lib-admin-user-form',
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
  // Validador para garantir que password e confirmPassword sejam iguais
  passwordMatchValidator(form: FormGroup): { [key: string]: boolean } | null {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    if (password && confirmPassword && password !== confirmPassword) {
      return { passwordMismatch: true };
    }
    return null;
  }
  empresas: Company[] = empresasMock;
  empresaFilterCtrl: FormControl = new FormControl('');
  filteredEmpresas: Company[] = this.empresas.slice();
  private routeSub?: Subscription;
  userForm: FormGroup;
  hidePassword = true;
  hideConfirmPassword = true;
  loading = false;
  isEdit = false;
  userId?: number;

  private setupEmpresaSearch(): void {
    this.empresaFilterCtrl.valueChanges.subscribe((search: string) => {
      const s = (search || '').trim().toLowerCase();
      if (!s) {
        this.filteredEmpresas = this.empresas.slice();
      } else {
        this.filteredEmpresas = this.empresas.filter((e: Company) =>
          e.name.toLowerCase().includes(s)
        );
      }
    });
  }

  onEmpresaSelected(event: MatAutocompleteSelectedEvent): void {
    const nome = event.option.value;
    const empresa = this.empresas.find((e) => e.name === nome) || null;
    this.userForm.get('empresa')?.setValue(empresa);
  }

  onEmpresaBlur(): void {
    const nome = this.empresaFilterCtrl.value;
    const empresa = this.empresas.find((e) => e.name === nome) || null;
    this.userForm.get('empresa')?.setValue(empresa);
    if (!empresa) {
      this.userForm.get('empresa')?.setErrors({ required: true });
    }
  }

  empresasFiltradas(): Company[] {
    return this.filteredEmpresas;
  }

  compareEmpresa(a: Company, b: Company): boolean {
    return !!a && !!b && a.id === b.id;
  }

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.userForm = this.fb.group(
      {
        nome: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        telefone: ['', [Validators.required]],
        empresa: [null, [Validators.required]],
        password: ['', [Validators.minLength(6)]],
        confirmPassword: [''],
        tokenRegistro: [''],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  ngOnInit(): void {
    // Exemplo: checar se há parâmetro de rota para edição
    this.setupEmpresaSearch();
    this.routeSub = this.route.params.subscribe(
      (params: { id?: string }): void => {
        if (params['id']) {
          this.isEdit = true;
          this.userId = +params['id'];
          // Aqui você buscaria os dados do usuário para edição (mock):
          // this.loadUser(this.userId);
          // Exemplo de preenchimento:
          // this.userForm.patchValue({ nome: 'João', empresa: this.empresas[0], ... });
          // Para edição, senha não é obrigatória
          this.userForm.get('password')?.clearValidators();
          this.userForm.get('confirmPassword')?.clearValidators();
          this.userForm.get('password')?.updateValueAndValidity();
          this.userForm.get('confirmPassword')?.updateValueAndValidity();
          // Preencher autocomplete se já houver empresa
          const empresa = this.userForm.get('empresa')?.value;
          if (empresa && empresa.nome) {
            this.empresaFilterCtrl.setValue(empresa.nome);
          }
        }
      }
    );
  }
  onSubmit(): void {
    if (this.userForm.valid) {
      const value: User = { ...this.userForm.value };
      if (!value.password) delete value.password;
      if (!value.confirmPassword) delete value.confirmPassword;
      this.loading = true;
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
