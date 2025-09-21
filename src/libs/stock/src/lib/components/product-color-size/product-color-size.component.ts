import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { NgxColorsModule, validColorValidator } from 'ngx-colors';
import { Color } from '../../models/product.model';

@Component({
  selector: 'sm-product-color-size',
  templateUrl: './product-color-size.component.html',
  styleUrls: ['./product-color-size.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatListModule,
    MatIconModule,
    NgxColorsModule,
  ],
})
export class ProductColorSizeComponent implements OnInit {
  public colorForm: FormGroup = new FormGroup(
    {
      colorVariantCodeTextCtrl: new FormControl(
        'rgb(79, 195, 255)',
        validColorValidator()
      ),
      colorVariantPickerCtrl: new FormControl('rgb(79, 195, 255)'),
      colorVariantNameCtrl: new FormControl('', [Validators.required]),
    },
    { updateOn: 'change' }
  );

  public colors: Color[] = [
    { name: 'Cyan', code: 'rgb(79, 195, 255)' },
    { name: 'Sky Blue', code: 'hsl(200, 100%, 65%)' },
    { name: 'Light Blue', code: '#4fc3ff' },
    { name: 'Transparent Cyan', code: 'rgba(79, 195, 255, 0.5)' },
  ];

  ngOnInit(): void {
    this.colorForm.controls['colorVariantCodeTextCtrl'].valueChanges.subscribe(
      (color) => {
        if (this.colorForm.controls['colorVariantPickerCtrl'].valid) {
          this.colorForm.controls['colorVariantPickerCtrl'].setValue(color, {
            emitEvent: false,
          });
        }
      }
    );
    this.colorForm.controls['colorVariantPickerCtrl'].valueChanges.subscribe(
      (color) =>
        this.colorForm.controls['colorVariantCodeTextCtrl'].setValue(color, {
          emitEvent: false,
        })
    );
  }

  addColor(): void {
    console.log('Add color');
  }

  removeColor(color: number): void {
    console.log('Remove color', color);
  }
}
