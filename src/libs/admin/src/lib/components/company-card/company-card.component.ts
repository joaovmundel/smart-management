import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Company, CreateCompanyRequest } from '@smart-management/shared';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'company-card',
  templateUrl: './company-card.component.html',
  styleUrls: ['./company-card.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
  ],
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

  onImageError(event: Event): void {
    (event.target as HTMLImageElement).src = '/default-company-logo.png';
  }

  isActive(): boolean | null {
    const company = this.company as Company;
    return company?.isActive !== undefined ? company.isActive : null;
  }

  getCnpj(): string | undefined {
    const company = this.company as Company;
    return company?.cnpj;
  }

  getEmail(): string | undefined {
    const company = this.company as Company;
    return company?.email;
  }

  getPhone(): string | undefined {
    const company = this.company as Company;
    return company?.phone;
  }

  getLocation(): string | undefined {
    const company = this.company as Company;
    if (company?.city || company?.state) {
      const parts = [company.city, company.state].filter(Boolean);
      return parts.join(', ');
    }
    return undefined;
  }

  hasContactInfo(): boolean {
    return !!(this.getEmail() || this.getPhone() || this.getLocation());
  }

  formatCnpj(cnpj: string): string {
    // Remove non-digits
    const cleaned = cnpj.replace(/\D/g, '');
    // Format as XX.XXX.XXX/XXXX-XX
    if (cleaned.length === 14) {
      return cleaned.replace(
        /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
        '$1.$2.$3/$4-$5'
      );
    }
    return cnpj;
  }

  formatPhone(phone: string): string {
    // Remove non-digits
    const cleaned = phone.replace(/\D/g, '');
    // Format as (XX) XXXXX-XXXX or (XX) XXXX-XXXX
    if (cleaned.length === 11) {
      return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (cleaned.length === 10) {
      return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return phone;
  }
}
