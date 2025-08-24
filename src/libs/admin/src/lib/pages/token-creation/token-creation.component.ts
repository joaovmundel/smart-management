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
import { MatButtonModule } from '@angular/material/button';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { v4 as uuidv4 } from 'uuid';
import { MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

interface Empresa {
  id: string;
  nome: string;
}

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
    MatButtonModule,
    NgxMatSelectSearchModule,
  ],
})
export class TokenCreationComponent implements OnInit, OnDestroy {
  private readonly _dialogRef = inject(MatDialogRef<TokenCreationComponent>);
  form: FormGroup;
  empresas: Empresa[] = [
    { id: '1', nome: 'Empresa Alpha' },
    { id: '2', nome: 'Empresa Beta' },
    { id: '3', nome: 'Empresa Gama' },
  ];
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
