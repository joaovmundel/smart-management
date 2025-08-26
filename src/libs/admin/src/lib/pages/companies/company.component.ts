import { Component } from "@angular/core";
import { Company, mockCompany } from "@smart-management/shared";
import { CompanyCardComponent } from "../../components/company-card/company-card.component";

@Component({
    selector: 'company-list',
    templateUrl: './company.component.html',
    styleUrls: ['./company.component.scss'],
    standalone: true,
    imports: [
        CompanyCardComponent,
    ]
})
export class CompanyComponent {
    companyMock: Company = mockCompany;
}