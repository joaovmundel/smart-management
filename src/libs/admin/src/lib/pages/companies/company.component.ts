import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { Company, mockCompany, mockCompanyList } from "@smart-management/shared";
import { FormsModule } from '@angular/forms';
import { CompanyCardComponent } from "../../components/company-card/company-card.component";

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
    ]
})
export class CompanyComponent {
    companyMock: Company = mockCompany;
    companyList: Company[] = mockCompanyList;
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

    onSearchChange() {
        this.page = 1;
    }
}