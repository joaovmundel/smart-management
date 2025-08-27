import { Component } from "@angular/core";
import { Company, mockCompany } from "@smart-management/shared";
import { CompanyCardComponent } from "../../components/company-card/company-card.component";
import { CommonModule } from "@angular/common";

@Component({
    selector: 'company-list',
    templateUrl: './company.component.html',
    styleUrls: ['./company.component.scss'],
    standalone: true,
    imports: [
        CompanyCardComponent,
        CommonModule
    ]
})
export class CompanyComponent {
    companyMock: Company = mockCompany;
    companyList: Company[] = []
    
    constructor() {
        for (let i = 0; i < 100; i++) {
            this.companyList.push(this.companyMock);
        }
    }
}