import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { Company, mockCompany, mockCompanyList } from "@smart-management/shared";
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
    ]
})
export class CompanyComponent {
    companyMock: Company = mockCompany;
    companyList: Company[] = mockCompanyList;
    page = 1;
    pageSize = 12;

    constructor() {
        for (let i = 0; i < 103; i++) {
            const companyCopy = { ...this.companyMock };
            companyCopy.name = `${this.companyMock.name} [${i}]`;
            this.companyList.push(companyCopy);
        }
    }

    get paginatedCompanies(): Company[] {
        const start = (this.page - 1) * this.pageSize;
        return this.companyList.slice(start, start + this.pageSize);
    }

    get totalPages(): number {
        return Math.ceil(this.companyList.length / this.pageSize);
    }

    setPage(page: number) {
        if (page >= 1 && page <= this.totalPages) {
            this.page = page;
        }
    }
}