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
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { v4 as uuidv4 } from 'uuid';
import { MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Empresa, empresasMock } from '@smart-management/shared';


@Component({
  selector: 'lib-token-creation',
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

  onEmpresaSelected(event: MatAutocompleteSelectedEvent): void {
    const nome = event.option.value;
    const empresa = this.empresas.find(e => e.nome === nome) || null;
    this.form.get('empresa')?.setValue(empresa);
  }

  onEmpresaBlur(): void {
    const nome = this.empresaFilterCtrl.value;
    const empresa = this.empresas.find(e => e.nome === nome) || null;
    this.form.get('empresa')?.setValue(empresa);
    if (!empresa) {
      this.form.get('empresa')?.setErrors({ required: true });
    }
  }
  private readonly _dialogRef = inject(MatDialogRef<TokenCreationComponent>);
  form: FormGroup;
  empresas: Empresa[] = empresasMock;
  filteredEmpresas: Empresa[] = [...this.empresas];
  empresaFilterCtrl = new FormControl('');
  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      token: [{ value: uuidv4(), disabled: true }, Validators.required],
      empresa: [null, Validators.required],
    });
  }

  ngOnInit() {
    this.empresaFilterCtrl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((search: string | null) => {
        this.filteredEmpresas = search
          ? this.empresas.filter((e) =>
              e.nome.toLowerCase().includes(search.toLowerCase())
            )
          : [...this.empresas];
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  close(): void {
    this._dialogRef.close();
  }

  compareEmpresa(e1: Empresa, e2: Empresa): boolean {
    return e1 && e2 && e1.id === e2.id;
  }
}
