import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterModule } from '@angular/router';
import { TitleService } from '@smart-management/layout';
import {
  Company,
  CompanyService,
  CreateCompanyRequest,
} from '@smart-management/shared';
import { take } from 'rxjs';
import { CompanyCardComponent } from '../../components/company-card/company-card.component';
import { ConfirmationModalComponent } from '../../components/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'company-list',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss'],
  standalone: true,
  imports: [
    CompanyCardComponent,
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    RouterModule,
  ],
})
export class CompanyComponent {
  private readonly _router: Router = inject(Router);
  private readonly _dialog: MatDialog = inject(MatDialog);
  private readonly _title: TitleService = inject(TitleService);
  private readonly _companyService = inject(CompanyService);
  private readonly _snackBar = inject(MatSnackBar);

  companyList: CreateCompanyRequest[] =
    this._companyService.companyStorage || [];
  isLoading = false;
  hasError = false;
  page = 1;
  pageSize = 12;
  search = '';

  constructor() {
    this._title.setTitle('Empresas');
    this.loadCompanies();
  }

  loadCompanies(): void {
    try {
      this.isLoading = true;
      this.hasError = false;
      
      // Simulating data load from service
      this.companyList = this._companyService.companyStorage || [];
      
      // Mock data generation for testing
      if (this.companyList.length > 0) {
        for (let i = 0; i < 103; i++) {
          const companyCopy = { ...this.companyList[0] } as CreateCompanyRequest;
          companyCopy.name = `${this.companyList[0].name} [${i}]`;
          this.companyList.push(companyCopy);
        }
      }
      
      this.isLoading = false;
    } catch (error) {
      this.isLoading = false;
      this.hasError = true;
      this._snackBar.open(
        'Erro ao carregar a lista de empresas. Tente novamente.',
        'Fechar',
        {
          duration: 4000,
          panelClass: ['error-snackbar'],
        }
      );
    }
  }

  get filteredCompanies(): CreateCompanyRequest[] {
    if (!this.search.trim()) return this.companyList;
    return this.companyList.filter((c) =>
      c.name.toLowerCase().includes(this.search.trim().toLowerCase())
    );
  }

  get paginatedCompanies(): CreateCompanyRequest[] {
    const start = (this.page - 1) * this.pageSize;
    return this.filteredCompanies.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredCompanies.length / this.pageSize);
  }

  setPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.page = page;
    }
  }

  onViewDetails(company: Company | CreateCompanyRequest): void {
    this._router.navigate([`/admin/companies/${company.id}`]);
  }

  onDelete(company: Company | CreateCompanyRequest): void {
    this._dialog
      .open(ConfirmationModalComponent)
      .afterClosed()
      .pipe(take(1))
      .subscribe((result) => {
        if (result === true) {
          try {
            //TODO: Implements delete method
            console.log(`Deletando a empresa ${company.id}`);
            this._snackBar.open(
              'Empresa excluída com sucesso!',
              'Fechar',
              {
                duration: 3000,
                panelClass: ['snackbar-success'],
              }
            );
          } catch (error) {
            this._snackBar.open(
              'Erro ao excluir empresa. Tente novamente.',
              'Fechar',
              {
                duration: 4000,
                panelClass: ['error-snackbar'],
              }
            );
          }
        }
      });
  }

  onEditCompany(company: Company | CreateCompanyRequest): void {
    this._router.navigate([`/admin/companies/edit/${company.id}`]);
  }

  goToCreatePage(): void {
    this._router.navigate(['/admin/companies/create']);
  }

  onSearchChange() {
    this.page = 1;
  }
}
