import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Company, CreateCompanyRequest } from '@smart-management/shared';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'company-card',
  templateUrl: './company-card.component.html',
  styleUrls: ['./company-card.component.scss'],
  standalone: true,
  imports: [MatIconModule, MatTooltipModule, MatButtonModule],
})
export class CompanyCardComponent {
  @Input() company!: Company | CreateCompanyRequest | null;
  @Output() view = new EventEmitter<Company | CreateCompanyRequest>();
  @Output() edit = new EventEmitter<Company | CreateCompanyRequest>();
  @Output() delete = new EventEmitter<Company | CreateCompanyRequest>();

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
