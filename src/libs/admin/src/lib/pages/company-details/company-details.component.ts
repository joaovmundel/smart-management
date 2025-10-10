import { Component, inject, OnDestroy, OnInit } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { Company, mockCompany } from "@smart-management/shared";
import { Subject } from "rxjs";
import { UsersComponent } from "../users/users.component";
import { TitleService } from "@smart-management/layout";

@Component({
    selector: 'company-details-page',
    templateUrl: './company-details.component.html',
    styleUrls: ['./company-details.component.scss'],
    standalone: true,
    imports: [MatIconModule, UsersComponent]
})
export class CompanyDetailsComponent implements OnInit, OnDestroy {
    private readonly _destroy$: Subject<void> = new Subject<void>();
    private readonly _title = inject(TitleService);

    company!: Company;
    isLoading = false;

    ngOnInit(): void {
        this._title.setTitle('Visualizando empresa');
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