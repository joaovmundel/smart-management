import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
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
import { ActivatedRoute, Router } from '@angular/router';
import { TitleService } from '@smart-management/layout';
import {
  CompanyService,
  CreateCompanyRequest,
  ViaCepService,
} from '@smart-management/shared';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-company-form',
  templateUrl: './company-form.component.html',
  styleUrls: ['./company-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatIconModule,
  ],
})
export class CompanyFormComponent implements OnInit {
  private readonly _titleService = inject(TitleService);
  private readonly viaCepService = inject(ViaCepService);
  private readonly _companyService = inject(CompanyService);
  companyForm: FormGroup;
  loading = false;
  loadingCep = false;
  isEdit = false;
  companyId?: string;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.companyForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.email, Validators.required]],
      cnpj: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      description: [''],
      websiteUrl: [''],
      logoUrl: [''],
      city: [''],
      state: [''],
      zipCode: [''],
      country: [''],
      address: [''],
    });
  }

  ngOnInit(): void {
    this._titleService.setTitle(
      this.isEdit ? 'Editar Empresa' : 'Criar Empresa'
    );
    this.route.params.subscribe((params: { id?: string }) => {
      if (params['id']) {
        this.isEdit = true;
        this.companyId = params['id'];
        // TODO: Buscar empresa por id e preencher o formulário
        // Exemplo:
        // const company: Company = ...
        // this.companyForm.patchValue(company);
      }
    });

    // Listener para mudanças no campo CEP
    this.companyForm
      .get('zipCode')
      ?.valueChanges.pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((cep: string) => {
        if (cep && this.viaCepService.isCepComplete(cep)) {
          this.searchCep(cep);
        }
      });
  }

  searchCep(cep: string): void {
    this.loadingCep = true;
    this.viaCepService.getAddressByCep(cep).subscribe({
      next: (addressData) => {
        this.loadingCep = false;
        if (addressData) {
          this.companyForm.patchValue({
            address: addressData.address,
            city: addressData.city,
            state: addressData.state,
            zipCode: addressData.zipCode,
            country: addressData.country,
          });
          this.snackBar.open('CEP encontrado com sucesso!', 'Fechar', {
            duration: 2500,
            panelClass: 'snackbar-success',
          });
        } else {
          this.snackBar.open(
            'CEP não encontrado. Verifique e tente novamente.',
            'Fechar',
            {
              duration: 3000,
              panelClass: 'snackbar-error',
            }
          );
        }
      },
      error: () => {
        this.loadingCep = false;
        this.snackBar.open('Erro ao buscar CEP. Tente novamente.', 'Fechar', {
          duration: 3000,
          panelClass: 'snackbar-error',
        });
      },
    });
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    if (!this.isFormValid()) {
      return;
    }
    const value: CreateCompanyRequest = { ...this.companyForm.value };
    this.loading = true;
    try {
      this._companyService.createCompany(value);
      this.notify(
        this.isEdit
          ? 'Empresa atualizada com sucesso!'
          : 'Empresa criada com sucesso!',
        'success'
      );
      this.router.navigate(['/admin/companies']);
    } catch (error) {
      this.notify(
        'Erro ao criar empresa: ' + (error as Error).message,
        'error'
      );
      return;
    } finally {
      this.loading = false;
    }
  }

  notify(message: string, type: 'success' | 'error'): void {
    this.snackBar.open(message, 'X', {
      duration: 3500,
      panelClass: type === 'success' ? 'snackbar-success' : 'snackbar-error',
    });
  }

  isFormValid(): boolean {
    if (!this.companyForm.valid) {
      this.companyForm.markAllAsTouched();
      this.notify(
        'Preencha todos os campos obrigatórios corretamente.',
        'error'
      );
      return false;
    }
    return true;
  }

  onCancel(): void {
    this.router.navigate(['/admin/companies']);
  }
}
