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
import { MatTooltipModule } from '@angular/material/tooltip';
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
    MatTooltipModule,
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
    this.route.params.subscribe((params: { id?: string }) => {
      if (params['id']) {
        this.isEdit = true;
        this.companyId = params['id'];
        this.loadCompanyForEdit();
      }
      
      this._titleService.setTitle(
        this.isEdit ? 'Editar Empresa' : 'Criar Empresa'
      );
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

  loadCompanyForEdit(): void {
    if (!this.companyId) return;

    const company = this._companyService.getCompanyById(this.companyId);
    
    if (company) {
      this.companyForm.patchValue({
        name: company.name,
        email: company.email,
        cnpj: company.cnpj,
        phone: company.phone,
        description: company.description,
        websiteUrl: company.websiteUrl,
        logoUrl: company.logoUrl,
        city: company.city,
        state: company.state,
        zipCode: company.zipCode,
        country: company.country,
        address: company.address,
      });

      // Formatar o telefone se existir
      if (company.phone) {
        const formattedPhone = this.formatPhone(company.phone);
        this.companyForm.patchValue({ phone: formattedPhone });
      }
    } else {
      this.snackBar.open('Empresa não encontrada.', 'Fechar', {
        duration: 3000,
        panelClass: 'snackbar-error',
      });
      this.router.navigate(['/admin/companies']);
    }
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
      if (this.isEdit && this.companyId) {
        // Encontrar o índice da empresa
        const index = this._companyService.companyStorage.findIndex(
          (company) => company.id === this.companyId
        );
        
        if (index !== -1) {
          // Manter o ID original ao atualizar
          value.id = this.companyId;
          this._companyService.updateCompany(index, value);
        } else {
          throw new Error('Empresa não encontrada para atualização.');
        }
      } else {
        this._companyService.createCompany(value);
      }
      
      this.notify(
        this.isEdit
          ? 'Empresa atualizada com sucesso!'
          : 'Empresa criada com sucesso!',
        'success'
      );
      this.router.navigate(['/admin/companies']);
    } catch (error) {
      this.notify(
        'Erro ao ' + (this.isEdit ? 'atualizar' : 'criar') + ' empresa: ' + (error as Error).message,
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
    this.companyForm
      .get('phone')
      ?.setValue(value, { emitEvent: false });
  }
}
