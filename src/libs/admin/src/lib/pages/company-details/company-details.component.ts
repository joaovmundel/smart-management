import { Component, OnDestroy, OnInit } from "@angular/core";
import { Company, mockCompany } from "@smart-management/shared";
import { Subject } from "rxjs";

@Component({
    selector: 'company-details-page',
    templateUrl: './company-details.component.html',
    styleUrls: ['./company-details.component.scss'],
    standalone: true,
    imports: []
})
export class CompanyDetailsComponent implements OnInit, OnDestroy {
    private readonly _destroy$: Subject<void> = new Subject<void>();
    company!: Company;
    isLoading = false;

    ngOnInit(): void {
        this.loadCompany();
    }

    loadCompany(): void {
        this.isLoading = true;
        this.company = mockCompany;
        this.isLoading = false;
    }

    ngOnDestroy(): void {
        this._destroy$.next();
        this._destroy$.complete();
    }

}