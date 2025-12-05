import { CommonModule } from "@angular/common";
import { Component, inject, OnDestroy, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { MatTooltipModule } from "@angular/material/tooltip";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { Company, CompanyService, mockCompany } from "@smart-management/shared";
import { Subject } from "rxjs";
import { UsersComponent } from "../users/users.component";
import { TitleService } from "@smart-management/layout";

@Component({
    selector: 'company-details-page',
    templateUrl: './company-details.component.html',
    styleUrls: ['./company-details.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        MatIconModule,
        MatButtonModule,
        MatTooltipModule,
        MatSnackBarModule,
        RouterModule,
        UsersComponent
    ]
})
export class CompanyDetailsComponent implements OnInit, OnDestroy {
    private readonly _destroy$: Subject<void> = new Subject<void>();
    private readonly _title = inject(TitleService);
    private readonly _companyService = inject(CompanyService);
    private readonly _route = inject(ActivatedRoute);
    private readonly _router = inject(Router);
    private readonly _snackBar = inject(MatSnackBar);

    company!: Company;
    isLoading = false;
    companyId?: string;

    get getCompanyId(): string | undefined {
        return this.company?.id;
    }

    ngOnInit(): void {
        this._route.params.subscribe((params: { id?: string }) => {
            if (params['id']) {
                this.companyId = params['id'];
                this.loadCompany();
            } else {
                this._snackBar.open('ID da empresa não informado.', 'Fechar', {
                    duration: 3000,
                    panelClass: 'snackbar-error',
                });
                this._router.navigate(['/admin/companies']);
            }
        });
    }

    loadCompany(): void {
        if (!this.companyId) return;

        this.isLoading = true;
        const company = this._companyService.getCompanyById(this.companyId);
        
        if (company) {
            this.company = company as Company;
            this._title.setTitle(`${this.company.name} - Detalhes`);
        } else {
            this._snackBar.open('Empresa não encontrada.', 'Fechar', {
                duration: 3000,
                panelClass: 'snackbar-error',
            });
            this._router.navigate(['/admin/companies']);
        }
        
        this.isLoading = false;
    }

    ngOnDestroy(): void {
        this._destroy$.next();
        this._destroy$.complete();
    }

}