
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Company } from '@smart-management/shared';
import { TitleService } from '@smart-management/layout';

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
  ],
})
export class CompanyFormComponent implements OnInit {
  private readonly _titleService = inject(TitleService);
  companyForm: FormGroup;
  loading = false;
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
      email: ['', [Validators.email]],
      cnpj: [''],
      phone: [''],
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
    this._titleService.setTitle(this.isEdit ? 'Editar Empresa' : 'Criar Empresa');
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
  }

  onSubmit(): void {
    if (this.companyForm.valid) {
      const value: Company = { ...this.companyForm.value };
      this.loading = true;
      // TODO: Implementar lógica de salvar/criar empresa (API)
      setTimeout(() => {
        this.loading = false;
        this.snackBar.open(
          this.isEdit ? 'Empresa atualizada com sucesso!' : 'Empresa criada com sucesso!',
          'Fechar',
          { duration: 3500, panelClass: 'snackbar-success' }
        );
        this.router.navigate(['/admin/companies']);
      }, 1200);
    } else {
      this.companyForm.markAllAsTouched();
      this.snackBar.open(
        'Preencha todos os campos obrigatórios corretamente.',
        'Fechar',
        { duration: 3500, panelClass: 'snackbar-error' }
      );
    }
  }

  onCancel(): void {
    this.router.navigate(['/admin/companies']);
  }
}
