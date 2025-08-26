import { Component, Input } from "@angular/core";
import { Company } from "@smart-management/shared";
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatButtonModule } from "@angular/material/button";

@Component({
    selector: 'company-card',
    templateUrl: './company-card.component.html',
    styleUrls: ['./company-card.component.scss'],
    standalone: true,
    imports: [
        MatIconModule,
        MatTooltipModule,
        MatButtonModule
    ]
})
export class CompanyCardComponent {
    @Input() company!: Company | null;
}