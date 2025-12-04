import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { v4 as uuidv4 } from 'uuid';
import { MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Company, empresasMock } from '@smart-management/shared';

@Component({
  selector: 'token-creation',
  templateUrl: './token-creation.component.html',
  styleUrls: ['./token-creation.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatButtonModule,
  ],
})
export class TokenCreationComponent implements OnInit, OnDestroy {
  private readonly _dialogRef = inject(MatDialogRef<TokenCreationComponent>);
  form: FormGroup;
  companies: Company[] = empresasMock;
  filteredCompanies: Company[] = [...this.companies];
  companyFilterCtrl = new FormControl('');
  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      token: [{ value: uuidv4(), disabled: true }, Validators.required],
      empresa: [null, Validators.required],
    });
  }

  ngOnInit() {
    this.companyFilterCtrl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((search: string | null) => {
        this.filteredCompanies = search
          ? this.companies.filter((company) =>
              company.name.toLowerCase().includes(search.toLowerCase())
            )
          : [...this.companies];
      });
  }

  onCompanySelected(event: MatAutocompleteSelectedEvent): void {
    const name = event.option.value;
    const company = this.companies.find((e) => e.name === name) || null;
    this.form.get('empresa')?.setValue(company);
  }

  onCompanyBlur(): void {
    const name = this.companyFilterCtrl.value;
    const company = this.companies.find((e) => e.name === name) || null;
    this.form.get('empresa')?.setValue(company);
    if (!company) {
      this.form.get('empresa')?.setErrors({ required: true });
    }
  }

  //TODO: Implementar a lógica de criação do token

  close(created = false): void {
    this._dialogRef.close({
      created: created,
      token: this.form.getRawValue().token,
      company: this.form.get('empresa')?.value,
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
