import { Component, EventEmitter, Input, Output } from "@angular/core";
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
    @Output() view = new EventEmitter<Company>();
    @Output() edit = new EventEmitter<Company>();
    @Output() delete = new EventEmitter<Company>();


    onView(): void {
        if (this.company) {
            this.view.emit(this.company);
        }
    }

    onDelete(): void {
        if (this.company) {
            this.delete.emit(this.company);
        }
    }

    onEdit(): void {
        if (this.company) {
            this.edit.emit(this.company);
        }
    }
}