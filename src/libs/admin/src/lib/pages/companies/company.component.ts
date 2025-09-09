import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterModule } from "@angular/router";
import { Company, mockCompany, mockCompanyList } from "@smart-management/shared";
import { CompanyCardComponent } from "../../components/company-card/company-card.component";
import { MatDialog } from "@angular/material/dialog";
import { ConfirmationModalComponent } from "../../components/confirmation-modal/confirmation-modal.component";
import { take } from "rxjs";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

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
        RouterModule
    ]
})
export class CompanyComponent {
    private readonly _router: Router = inject(Router);
    private readonly _dialog: MatDialog = inject(MatDialog);

    companyMock: Company = mockCompany;
    companyList: Company[] = mockCompanyList;
    isLoading = false;
    page = 1;
    pageSize = 12;
    search = '';

    constructor() {
        for (let i = 0; i < 103; i++) {
            const companyCopy = { ...this.companyMock };
            companyCopy.name = `${this.companyMock.name} [${i}]`;
            this.companyList.push(companyCopy);
        }
    }

    get filteredCompanies(): Company[] {
        if (!this.search.trim()) return this.companyList;
        return this.companyList.filter(c => c.name.toLowerCase().includes(this.search.trim().toLowerCase()));
    }

    get paginatedCompanies(): Company[] {
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

    onViewDetails(company: Company): void {
        this._router.navigate([`/admin/companies/${company.id}`]);
    }

    onDelete(company: Company): void {
        this._dialog.open(ConfirmationModalComponent).afterClosed().pipe(take(1)).subscribe(result => {
            if (result === true) {
                //TODO: Implements delete method
                console.log(`Deletando a empresa ${company.id}`);
            }
        });
    }

    onEditCompany(company: Company): void {
        this._router.navigate([`/admin/companies/edit/${company.id}`]);
    }

    goToCreatePage(): void {
        this._router.navigate(['/admin/companies/create']);
    }

    onSearchChange() {
        this.page = 1;
    }
}